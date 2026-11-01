import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

// Checks the generated catalog against the raw Xentral specs, independently of the generator.
const require = createRequire(import.meta.url);
const { SPEC_CATALOG } = require('../dist/nodes/Xentral/resources/specDriven/spec.catalog.js');
const specs = ['specs/xentral-api.openapi-3.0.0.json', 'specs/xentral-documents-api.openapi-3.1.0.json'].map((f) =>
	JSON.parse(fs.readFileSync(new URL(`../${f}`, import.meta.url))),
);

function resolve(spec, node) {
	if (!node || !node.$ref) return node;
	let target = spec;
	for (const part of node.$ref.replace('#/', '').split('/')) target = target[part];
	return resolve(spec, target);
}

function findInSpecs(method, version, template) {
	const shape = `/api/${version}/${template.replace(/\{[^}]+\}/g, '{}')}`;
	for (const spec of specs) {
		for (const [p, item] of Object.entries(spec.paths)) {
			if (p.replace(/\{[^}]+\}/g, '{}') === shape && item[method.toLowerCase()]) {
				return { spec, item, op: item[method.toLowerCase()] };
			}
		}
	}
	return undefined;
}

const ops = SPEC_CATALOG.flatMap((r) => r.ops.map((o) => ({ resource: r.resource, ...o })));

test('every generated operation exists in the raw specs with the same method', () => {
	for (const o of ops) {
		assert.ok(findInSpecs(o.method, o.version, o.path), `${o.resource}.${o.value} ${o.method} ${o.version}/${o.path}`);
	}
});

test('every generated operation is not deprecated in the raw specs', () => {
	for (const o of ops) {
		const hit = findInSpecs(o.method, o.version, o.path);
		assert.notEqual(hit.op.deprecated, true, `${o.resource}.${o.value}`);
	}
});

test('declared query keys match the spec query parameters', () => {
	for (const o of ops) {
		const { spec, item, op } = findInSpecs(o.method, o.version, o.path);
		const names = [...(item.parameters || []), ...(op.parameters || [])]
			.map((p) => resolve(spec, p))
			.filter((p) => p.in === 'query')
			.map((p) => p.name);
		assert.deepEqual([...o.queryKeys].sort(), names.sort(), `${o.resource}.${o.value}`);
	}
});

test('a body the spec requires is marked required, never optional with an empty default', () => {
	for (const o of ops) {
		const { spec, op } = findInSpecs(o.method, o.version, o.path);
		if (!op.requestBody) {
			assert.equal(o.body, 'none', `${o.resource}.${o.value}`);
			continue;
		}
		const rb = resolve(spec, op.requestBody);
		const schema = resolve(spec, rb.content[o.contentType].schema) || {};
		const branches = (schema.anyOf || schema.oneOf || []).map((b) => resolve(spec, b) || {});
		const needsFields =
			rb.required ||
			(Array.isArray(schema.required) && schema.required.length > 0 && rb.required) ||
			(branches.length > 0 && branches.every((b) => Array.isArray(b.required) && b.required.length > 0));
		if (needsFields) assert.equal(o.body, 'required', `${o.resource}.${o.value}`);
	}
});
