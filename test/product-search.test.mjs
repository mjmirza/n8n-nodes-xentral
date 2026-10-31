import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runProductSearch, mergeUniqueById, PRODUCT_SEARCH_FILTERS } from '../dist/nodes/Xentral/resources/product/product.search.js';

// A fake Xentral that applies one filter the way the v1 API does.
const catalog = [
	{ id: 1, name: 'Schutzlack Klar', number: 'ART-1001', ean: '4006381333931' },
	{ id: 2, name: 'Grundierung Weiss', number: 'ART-2002', ean: '4006381333948' },
	{ id: 3, name: 'ART-1001 Zubehoer', number: 'Z-77', ean: '' },
];
function fakeFetch(calls) {
	return async (q, limit) => {
		calls.push(q);
		const key = q['filter[0][key]'], op = q['filter[0][op]'], v = String(q['filter[0][value]']);
		const hit = catalog.filter((p) => (op === 'equals' ? String(p[key]) === v : String(p[key]).includes(v)));
		return limit === undefined ? hit : hit.slice(0, limit);
	};
}

test('finds a product by article number alone (the reported bug)', async () => {
	const r = await runProductSearch(fakeFetch([]), 'ART-2002');
	assert.deepEqual(r.map((p) => p.id), [2]);
});

test('finds a product by name', async () => {
	const r = await runProductSearch(fakeFetch([]), 'Schutzlack');
	assert.deepEqual(r.map((p) => p.id), [1]);
});

test('finds a product by exact EAN', async () => {
	const r = await runProductSearch(fakeFetch([]), '4006381333948');
	assert.deepEqual(r.map((p) => p.id), [2]);
});

test('article number match comes first and duplicates are removed', async () => {
	const r = await runProductSearch(fakeFetch([]), 'ART-1001');
	assert.deepEqual(r.map((p) => p.id), [1, 3]);
});

test('queries number, ean and name, one filter each', async () => {
	const calls = [];
	await runProductSearch(fakeFetch(calls), 'x');
	assert.deepEqual(calls.map((q) => q['filter[0][key]']).sort(), ['ean', 'name', 'number']);
	assert.equal(PRODUCT_SEARCH_FILTERS[0].key, 'number');
});

test('limit applies to the merged result', async () => {
	const r = await runProductSearch(fakeFetch([]), 'ART', 1);
	assert.equal(r.length, 1);
});

test('blank or whitespace term makes no request', async () => {
	const calls = [];
	assert.deepEqual(await runProductSearch(fakeFetch(calls), '   '), []);
	assert.equal(calls.length, 0);
});

test('term is trimmed before searching', async () => {
	const r = await runProductSearch(fakeFetch([]), '  ART-2002  ');
	assert.deepEqual(r.map((p) => p.id), [2]);
});

test('items without an id are kept, never collapsed', () => {
	assert.equal(mergeUniqueById([[{ name: 'a' }], [{ name: 'b' }]]).length, 2);
});

test('a failing lookup surfaces the error instead of a silent partial result', async () => {
	const failing = async (q) => { if (q['filter[0][key]'] === 'ean') throw new Error('API down'); return []; };
	await assert.rejects(runProductSearch(failing, 'x'), /API down/);
});
