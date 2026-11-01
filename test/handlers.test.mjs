import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { handleProduct, productWriteTarget } = require('../dist/nodes/Xentral/resources/product/product.handler.js');
const { handlePurchasePrice } = require('../dist/nodes/Xentral/resources/purchasePrice/purchasePrice.handler.js');
const { runSpecOperation } = require('../dist/nodes/Xentral/resources/specDriven/spec.handler.js');
const { SPEC_CATALOG } = require('../dist/nodes/Xentral/resources/specDriven/spec.catalog.js');
const { handleCustomApiCall } = require('../dist/nodes/Xentral/resources/customApiCall/customApiCall.handler.js');
const { resolveCustomPath } = require('../dist/nodes/Xentral/resources/customApiCall/customApiCall.path.js');
const { Xentral } = require('../dist/nodes/Xentral/Xentral.node.js');

const BASE = 'https://acme.xentral.com/api';

// A minimal n8n execution context that records every HTTP request.
function context(params, { typeVersion = 2, response = { data: [] } } = {}) {
	const calls = [];
	const ctx = {
		calls,
		getNode: () => ({ name: 'Xentral', type: 'n8n-nodes-xentral.xentral', typeVersion, parameters: {} }),
		getNodeParameter: (name, _i, fallback) => (name in params ? params[name] : fallback),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		continueOnFail: () => false,
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				return typeof response === 'function' ? response(options) : response;
			},
		},
	};
	return ctx;
}

// ---------- products ----------

test('product get keeps v1 on node version 1 so saved workflows see the same output', async () => {
	const ctx = context({ productId: '7' }, { typeVersion: 1, response: { data: { id: '7' } } });
	await handleProduct.call(ctx, 'get', 0);
	assert.equal(ctx.calls[0].method, 'GET');
	assert.equal(ctx.calls[0].url, `${BASE}/v1/products/7`);
});

test('product get reads from v2 on node version 2', async () => {
	const ctx = context({ productId: '7' }, { response: { data: { id: '7' } } });
	await handleProduct.call(ctx, 'get', 0);
	assert.equal(ctx.calls[0].url, `${BASE}/v2/products/7`);
});

test('product get many pages through v2 with page[number] and page[size]', async () => {
	const ctx = context({ returnAll: false, limit: 2 }, { response: { data: [{ id: '1' }, { id: '2' }] } });
	const result = await handleProduct.call(ctx, 'getAll', 0);
	assert.equal(ctx.calls[0].url, `${BASE}/v2/products`);
	assert.equal(ctx.calls[0].qs['page[number]'], 1);
	assert.equal(result.length, 2);
});

test('product search on v2 still queries article number, EAN and name', async () => {
	const ctx = context({ searchTerm: 'ART-1', returnAll: false, limit: 10 }, { response: { data: [] } });
	await handleProduct.call(ctx, 'search', 0);
	assert.equal(ctx.calls.length, 3);
	for (const call of ctx.calls) assert.equal(call.url, `${BASE}/v2/products`);
	assert.deepEqual(ctx.calls.map((c) => c.qs['filter[0][key]']).sort(), ['ean', 'name', 'number']);
});

test('product search on node version 1 keeps the v1 endpoint', async () => {
	const ctx = context({ searchTerm: 'ART-1', returnAll: false, limit: 10 }, { typeVersion: 1 });
	await handleProduct.call(ctx, 'search', 0);
	for (const call of ctx.calls) assert.equal(call.url, `${BASE}/v1/products`);
});

test('product create goes to v2 and maps category to categories', async () => {
	const ctx = context({ name: 'Lack', projectId: '1', additionalFields: { categoryId: '9', ean: '400' } });
	await handleProduct.call(ctx, 'create', 0);
	const call = ctx.calls[0];
	assert.equal(call.method, 'POST');
	assert.equal(call.url, `${BASE}/v2/products`);
	assert.deepEqual(call.body.categories, [{ id: '9' }]);
	assert.equal(call.body.category, undefined);
	assert.equal(call.body.ean, '400');
	assert.deepEqual(call.body.project, { id: '1' });
});

test('product update goes to v2', async () => {
	const ctx = context({ productId: '7', updateFields: { name: 'Neu' } });
	await handleProduct.call(ctx, 'update', 0);
	assert.equal(ctx.calls[0].method, 'PATCH');
	assert.equal(ctx.calls[0].url, `${BASE}/v2/products/7`);
	assert.equal(ctx.calls[0].body.name, 'Neu');
});

test('a write that sets shop price display stays on v1, because v2 has no such field', () => {
	const target = productWriteTarget({ name: 'x', shopPriceDisplay: '1.5', category: { id: '9' } });
	assert.equal(target.version, 'v1');
	assert.deepEqual(target.body.category, { id: '9' });
});

test('product delete stays on v1, the only delete endpoint', async () => {
	const ctx = context({ productId: '7' }, { response: '' });
	await handleProduct.call(ctx, 'delete', 0);
	assert.equal(ctx.calls[0].method, 'DELETE');
	assert.equal(ctx.calls[0].url, `${BASE}/v1/products/7`);
});

test('product extra operation get stock calls the stocks endpoint', async () => {
	const ctx = context({ productId: '7', queryParameters: '{}' }, { response: { data: [] } });
	await handleProduct.call(ctx, 'getStock', 0);
	assert.equal(ctx.calls[0].url, `${BASE}/v1/products/7/stocks`);
});

// ---------- purchase prices ----------

test('purchase price create uses v2 instead of the deprecated v1', async () => {
	const ctx = context({ productId: '7', fromQuantity: 1, priceAmount: 10, priceCurrency: 'EUR', validFrom: '2026-01-01', expiresAt: '2027-01-01', additionalFields: {} });
	await handlePurchasePrice.call(ctx, 'create', 0);
	assert.equal(ctx.calls[0].method, 'POST');
	assert.equal(ctx.calls[0].url, `${BASE}/v2/purchasePrices`);
});

test('purchase price update uses v2', async () => {
	const ctx = context({ purchasePriceId: '3', updateFields: { fromQuantity: 2 } });
	await handlePurchasePrice.call(ctx, 'update', 0);
	assert.equal(ctx.calls[0].method, 'PATCH');
	assert.equal(ctx.calls[0].url, `${BASE}/v2/purchasePrices/3`);
});

test('purchase price list uses v2', async () => {
	const ctx = context({ returnAll: false, limit: 1 }, { response: { data: [{ id: '1' }] } });
	await handlePurchasePrice.call(ctx, 'getAll', 0);
	assert.equal(ctx.calls[0].url, `${BASE}/v2/purchasePrices`);
});

// ---------- every generated operation ----------

for (const resource of SPEC_CATALOG) {
	for (const op of resource.ops) {
		test(`${resource.resource} ${op.value} calls ${op.method} /api/${op.version}/${op.path}`, async () => {
			const params = { queryParameters: '{}', returnAll: false, limit: 5, body: '{"name":"x"}' };
			op.pathParams.forEach((name, index) => (params[name] = String(index + 11)));
			const ctx = context(params, { response: { data: [{ id: '1' }] } });
			await runSpecOperation.call(ctx, resource.resource, op.value, 0);
			const call = ctx.calls[0];
			let expected = op.path;
			op.pathParams.forEach((name, index) => (expected = expected.replace(`{${name}}`, String(index + 11))));
			assert.equal(call.method, op.method);
			assert.equal(call.url, `${BASE}/${op.version}/${expected}`);
			if (op.body !== 'none' && op.pager === 'none') assert.deepEqual(call.body, { name: 'x' });
			if (op.pager === 'v3') assert.ok('perPage' in call.qs);
			if (op.pager === 'v1page') assert.ok('page[number]' in call.qs);
		});
	}
}

test('generated operations reject a path value with traversal characters', async () => {
	const ctx = context({ reportId: '../users', queryParameters: '{}' });
	await assert.rejects(runSpecOperation.call(ctx, 'report', 'get', 0), /reportId/);
	assert.equal(ctx.calls.length, 0);
});

test('an invalid JSON body is rejected before any request', async () => {
	const ctx = context({ reportId: '5', body: '{not json' });
	await assert.rejects(runSpecOperation.call(ctx, 'report', 'executeQuery', 0), /Body must be valid JSON/);
	assert.equal(ctx.calls.length, 0);
});

test('query parameters reach the request', async () => {
	const ctx = context({ queryParameters: '{"filter[0][key]":"name"}', returnAll: false, limit: 5 });
	await runSpecOperation.call(ctx, 'user', 'getAll', 0);
	assert.equal(ctx.calls[0].qs['filter[0][key]'], 'name');
});

// ---------- custom API call ----------

test('custom API call sends method, version, path, query and body', async () => {
	const ctx = context(
		{ method: 'POST', apiVersion: 'v1', path: 'analytics/report/5/query', queryParameters: '{"a":"1"}', body: '{"x":1}', contentType: 'application/json' },
		{ response: { data: {} } },
	);
	await handleCustomApiCall.call(ctx, 'request', 0);
	const call = ctx.calls[0];
	assert.equal(call.method, 'POST');
	assert.equal(call.url, `${BASE}/v1/analytics/report/5/query`);
	assert.deepEqual(call.qs, { a: '1' });
	assert.deepEqual(call.body, { x: 1 });
});

test('custom API call takes the version from a pasted /api/v3 path', async () => {
	const ctx = context({ method: 'GET', apiVersion: 'v1', path: '/api/v3/supplierInvoices', queryParameters: '{}', contentType: '' });
	await handleCustomApiCall.call(ctx, 'request', 0);
	assert.equal(ctx.calls[0].url, `${BASE}/v3/supplierInvoices`);
	assert.equal(ctx.calls[0].body, undefined);
});

test('custom API call sends a vendor content type', async () => {
	const ctx = context({ method: 'PATCH', apiVersion: 'v1', path: 'products/7', queryParameters: '{}', body: '{}', contentType: 'application/vnd.xentral.minimal+json' });
	await handleCustomApiCall.call(ctx, 'request', 0);
	assert.equal(ctx.calls[0].headers['Content-Type'], 'application/vnd.xentral.minimal+json');
});

for (const [label, path] of [
	['an absolute URL', 'https://evil.example.com/api/v1/products'],
	['a protocol relative URL', '//evil.example.com/products'],
	['path traversal', 'products/../../etc'],
	['a query string in the path', 'products?x=1'],
	['an unfilled placeholder', 'products/{id}'],
	['an unknown resource', 'notAResource/1'],
	['an empty path', '   '],
]) {
	test(`custom API call rejects ${label}`, async () => {
		const ctx = context({ method: 'GET', apiVersion: 'v1', path, queryParameters: '{}' });
		await assert.rejects(handleCustomApiCall.call(ctx, 'request', 0));
		assert.equal(ctx.calls.length, 0);
	});
}

test('custom API call rejects a malformed content type', async () => {
	const ctx = context({ method: 'POST', apiVersion: 'v1', path: 'products', queryParameters: '{}', body: '{}', contentType: 'text/html; x' });
	await assert.rejects(handleCustomApiCall.call(ctx, 'request', 0), /Invalid content type/);
});

test('resolveCustomPath keeps the selected version for a plain path', () => {
	assert.deepEqual(resolveCustomPath('v2', 'users'), { version: 'v2', path: 'users' });
});

// ---------- node description ----------

test('node offers version 1 and 2 and defaults to 2', () => {
	const description = new Xentral().description;
	assert.deepEqual(description.version, [1, 2]);
	assert.equal(description.defaultVersion, 2);
});

test('resource options are unique, sorted and include the new resources', () => {
	const options = new Xentral().description.properties.find((p) => p.name === 'resource').options;
	const values = options.map((o) => o.value);
	assert.equal(new Set(values).size, values.length);
	const names = options.map((o) => o.name);
	assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
	for (const v of ['customApiCall', 'report', 'supplierInvoice', 'user', 'productOption', 'customerAddress']) {
		assert.ok(values.includes(v), v);
	}
});

test('generated and extended operation lists are sorted by name', () => {
	const generated = new Set([...SPEC_CATALOG.map((r) => r.resource), 'customApiCall']);
	for (const p of new Xentral().description.properties.filter(
		(x) => x.name === 'operation' && generated.has(x.displayOptions.show.resource[0]),
	)) {
		const names = p.options.map((o) => o.name);
		assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)), JSON.stringify(p.displayOptions));
	}
});
