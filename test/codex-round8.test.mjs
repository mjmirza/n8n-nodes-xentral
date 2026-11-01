import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { Xentral } = require('../dist/nodes/Xentral/Xentral.node.js');
const { handleProduction } = require('../dist/nodes/Xentral/resources/production/production.handler.js');
const description = new Xentral().description;
const docSpec = JSON.parse(fs.readFileSync(new URL('../specs/xentral-documents-api.openapi-3.1.0.json', import.meta.url)));

test('[r8-1] production create omits all four empty optional dates and preserves set dates', async () => {
	const dates = {
		productionStartDate: '2026-11-02',
		productionEndDate: '2026-11-06',
		stockProvisioningDate: '2026-11-01',
		stockRetrievalDate: '2026-11-07',
	};
	const schema = docSpec.components.schemas.CreateProductionData.allOf.find((part) => part.properties).properties;
	for (const key of Object.keys(dates)) {
		assert.equal(schema[key].type, 'string', key);
		assert.equal(schema[key].format, 'date', key);
	}
	for (const additionalFields of [
		Object.fromEntries(Object.keys(dates).map((key) => [key, ''])),
		dates,
		{ ...dates, productionEndDate: '', stockRetrievalDate: '' },
	]) {
		const params = { produceProductId: '5', produceQuantity: 2, additionalFields };
		const calls = [];
		const ctx = {
			getNode: () => ({ name: 'Xentral', type: 'n8n-nodes-xentral.xentral', typeVersion: 2, parameters: params }),
			getNodeParameter: (name, _index, fallback) => {
				assert.ok(name in params || fallback !== undefined, `Missing parameter ${name}`);
				return name in params ? params[name] : fallback;
			},
			getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
			helpers: { httpRequest: async (options) => { calls.push(options); return { id: '9' }; } },
		};
		await handleProduction.call(ctx, 'create', 0);
		assert.equal(calls.length, 1);
		assert.equal(calls[0].method, 'POST');
		assert.equal(new URL(calls[0].url).pathname, '/api/v3/productions');
		assert.deepEqual(calls[0].body.produceProduct, { id: '5' });
		assert.equal(calls[0].body.produceQuantity, 2);
		for (const key of Object.keys(dates)) {
			if (additionalFields[key] === '') assert.equal(Object.hasOwn(calls[0].body, key), false, key);
			else assert.equal(calls[0].body[key], dates[key], key);
		}
	}
});

function visible(field, params) {
	const { show = {}, hide = {} } = field.displayOptions ?? {};
	return Object.entries(show).every(([key, values]) => values.includes(params[key]))
		&& !Object.entries(hide).some(([key, values]) => values.includes(params[key]));
}

function checkParameters(params, fields, path, errors, root = params) {
	const available = fields.filter((field) => visible(field, { ...root, ...params }));
	for (const field of available.filter((field) => field.required)) {
		if (!Object.hasOwn(params, field.name) || params[field.name] === '' || params[field.name] == null) {
			errors.push(`${path}.${field.name}: required parameter missing`);
		}
	}
	for (const [name, value] of Object.entries(params)) {
		const field = available.find((candidate) => candidate.name === name);
		const location = `${path}.${name}`;
		if (!field) {
			errors.push(`${location}: unknown parameter for ${root.resource}/${root.operation}`);
			continue;
		}
		// Expressions are evaluated by n8n; only literal option values can be checked here.
		if (typeof value === 'string' && value.startsWith('=')) continue;
		if (field.type === 'options' || field.type === 'multiOptions') {
			const options = (field.options ?? []).filter((option) => Object.hasOwn(option, 'value'));
			for (const selected of field.type === 'multiOptions' ? value : [value]) {
				if (!options.some((option) => option.value === selected)) errors.push(`${location}: invalid option ${JSON.stringify(selected)}`);
			}
		} else if (field.type === 'collection') {
			checkParameters(value, field.options, location, errors, root);
		} else if (field.type === 'fixedCollection') {
			for (const [group, entries] of Object.entries(value)) {
				const option = field.options.find((candidate) => candidate.name === group);
				if (!option) errors.push(`${location}.${group}: unknown collection`);
				else for (const entry of Array.isArray(entries) ? entries : [entries]) {
					checkParameters(entry, option.values, `${location}.${group}`, errors, root);
				}
			}
		}
	}
}

test('[r8-2] every example Xentral parameter and option matches its resource/operation description', () => {
	const errors = [];
	const directory = new URL('../examples/', import.meta.url);
	const files = fs.readdirSync(directory).filter((name) => name.endsWith('.json'));
	assert.ok(files.length > 0, 'Example workflows exist');
	let checked = 0;
	for (const file of files) {
		const workflow = JSON.parse(fs.readFileSync(new URL(file, directory)));
		for (const node of workflow.nodes.filter((node) => node.type === 'n8n-nodes-xentral.xentral')) {
			checkParameters(node.parameters, description.properties, `${file}: ${node.name}`, errors);
			checked++;
		}
	}
	assert.ok(checked > 0, 'Xentral example nodes were checked');
	assert.deepEqual(errors, []);
});

test('[r8-3] examples avoid parallel main targets and offer deletion downstream of release', () => {
	const errors = [];
	const directory = new URL('../examples/', import.meta.url);
	const files = fs.readdirSync(directory).filter((name) => name.endsWith('.json'));
	assert.ok(files.length > 0, 'Example workflows exist');
	assert.ok(files.includes('workflow-2-offer-lifecycle.json'), 'Offer lifecycle example exists');
	for (const file of files) {
		const workflow = JSON.parse(fs.readFileSync(new URL(file, directory)));
		const nodes = new Map(workflow.nodes.map((node) => [node.name, node]));
		const targets = (name) => (workflow.connections[name]?.main ?? []).flat().map((connection) => connection.node);
		for (const node of workflow.nodes) {
			if (!['n8n-nodes-base.if', 'n8n-nodes-base.switch'].includes(node.type) && targets(node.name).length > 1) {
				errors.push(`${file}: ${node.name} has multiple outgoing main targets`);
			}
		}
		if (file !== 'workflow-2-offer-lifecycle.json') continue;
		for (const release of workflow.nodes.filter((node) => node.parameters.resource === 'offer' && node.parameters.operation === 'release')) {
			const pending = [...targets(release.name)];
			const visited = new Set();
			while (pending.length > 0) {
				const name = pending.pop();
				if (visited.has(name)) continue;
				visited.add(name);
				const node = nodes.get(name);
				assert.ok(node, `${file}: connection target ${name} exists`);
				if (node.parameters.resource === 'offer' && node.parameters.operation === 'delete') {
					errors.push(`${file}: ${name} deletes an offer downstream of ${release.name}`);
				}
				pending.push(...targets(name));
			}
		}
	}
	assert.deepEqual(errors, []);
});
