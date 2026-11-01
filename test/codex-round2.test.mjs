import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

// Regression tests for the second Codex review of v1.3.0. Each block names the finding it pins.
const require = createRequire(import.meta.url);
const transport = require('../dist/nodes/Xentral/transport.js');
const { XentralApi } = require('../dist/credentials/XentralApi.credentials.js');
const { XentralTrigger } = require('../dist/nodes/Xentral/XentralTrigger.node.js');
const { Xentral } = require('../dist/nodes/Xentral/Xentral.node.js');
const { resolveCustomPath } = require('../dist/nodes/Xentral/resources/customApiCall/customApiCall.path.js');
const { handleOffer } = require('../dist/nodes/Xentral/resources/offer/offer.handler.js');
const { handleSalesOrder } = require('../dist/nodes/Xentral/resources/salesOrder/salesOrder.handler.js');
const { handleInvoice } = require('../dist/nodes/Xentral/resources/invoice/invoice.handler.js');
const { handleCreditNote } = require('../dist/nodes/Xentral/resources/creditNote/creditNote.handler.js');
const { handleDeliveryNote } = require('../dist/nodes/Xentral/resources/deliveryNote/deliveryNote.handler.js');
const { handleProformaInvoice } = require('../dist/nodes/Xentral/resources/proformaInvoice/proformaInvoice.handler.js');
const { handleReturn } = require('../dist/nodes/Xentral/resources/return/return.handler.js');
const { handlePurchaseOrder } = require('../dist/nodes/Xentral/resources/purchaseOrder/purchaseOrder.handler.js');

const docSpec = JSON.parse(fs.readFileSync(new URL('../specs/xentral-documents-api.openapi-3.1.0.json', import.meta.url)));
const specs = [JSON.parse(fs.readFileSync(new URL('../specs/xentral-api.openapi-3.0.0.json', import.meta.url))), docSpec];

function context(params, { response = { data: [] }, binaryOut } = {}) {
	const calls = [];
	return {
		calls,
		getNode: () => ({ name: 'Xentral', type: 'n8n-nodes-xentral.xentral', typeVersion: 2, parameters: {} }),
		getNodeParameter: (name, _i, fallback) => (name in params ? params[name] : fallback),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		getInputData: () => [{ json: {} }],
		continueOnFail: () => false,
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				return typeof response === 'function' ? response(options, calls.length) : response;
			},
			prepareBinaryData: async (buffer, fileName, mimeType) => {
				const data = { data: buffer.toString('base64'), fileName, mimeType };
				if (binaryOut) binaryOut.push(data);
				return data;
			},
		},
	};
}

// The error n8n's httpRequest really throws: an AxiosError with response.status and response.data.
function axiosError(status, data = { title: 'gateway' }, headers = {}) {
	const error = new Error(`Request failed with status code ${status}`);
	error.isAxiosError = true;
	error.response = { status, statusText: 'x', headers, data };
	return error;
}

// ---------- 1. Axios error shape: retries and error detail ----------

test('[1] a POST rate limited with the real Axios 429 shape is retried', async () => {
	const ctx = context({}, {
		response: (_o, n) => { if (n === 1) throw axiosError(429, {}, { 'retry-after': '0' }); return { id: 5 }; },
	});
	const result = await transport.xentralRequest.call(ctx, 'POST', 'salesOrders', { a: 1 }, {}, 'v1');
	assert.equal(ctx.calls.length, 2);
	assert.deepEqual(result, { id: 5 });
});

test('[1] a GET that hits an Axios 503 is retried', async () => {
	const ctx = context({}, {
		response: (_o, n) => { if (n === 1) throw axiosError(503, {}, { 'retry-after': '0' }); return { data: [] }; },
	});
	await transport.xentralRequest.call(ctx, 'GET', 'salesOrders', {}, {}, 'v1');
	assert.equal(ctx.calls.length, 2);
});

test('[1] the Xentral error detail and HTTP code survive an Axios error', async () => {
	const ctx = context({}, { response: () => { throw axiosError(422, { title: 'Validation failed', detail: 'name is required' }); } });
	await assert.rejects(
		() => transport.xentralRequest.call(ctx, 'POST', 'salesOrders', { a: 1 }, {}, 'v1'),
		(error) => {
			assert.match(error.message + ' ' + (error.description ?? ''), /name is required/);
			assert.equal(String(error.httpCode), '422');
			return true;
		},
	);
	assert.equal(ctx.calls.length, 1);
});

// ---------- 2. supplier returns ----------

test('[2] return create and update send isReturnOrderToSupplier, the key Xentral accepts', async () => {
	const create = context({ customerId: '4', additionalFields: { isSupplierReturnOrder: true } }, { response: { id: 1 } });
	await handleReturn.call(create, 'create', 0);
	assert.equal(create.calls[0].body.isReturnOrderToSupplier, true);
	assert.equal(create.calls[0].body.isSupplierReturnOrder, undefined);
	const update = context({ returnId: '9', updateFields: { isSupplierReturnOrder: false } }, { response: { id: 1 } });
	await handleReturn.call(update, 'update', 0);
	assert.equal(update.calls[0].body.isReturnOrderToSupplier, false);
	assert.equal(update.calls[0].body.isSupplierReturnOrder, undefined);
});

// ---------- 3. internal address canonicalization ----------

const BLOCKED = [
	'https://2130706433', 'https://0x7f000001', 'https://0177.0.0.1', 'https://localhost.', 'https://LOCALHOST..',
	'https://127.1', 'https://0x7f.1', 'https://017700000001', 'https://10.1', 'https://0xa000001', 'https://3232235777',
	'https://169.254.169.254.', 'https://[::1]', 'https://[::ffff:127.0.0.1]', 'https://app.localhost', 'https://0',
	'https://100.64.0.1', 'https://224.0.0.1', 'https://255.255.255.255',
];

test('[3] the transport blocks decimal, hex, octal, short and trailing-dot internal hosts', () => {
	for (const url of BLOCKED) {
		assert.throws(() => transport.normalizeUrl(url), /internal or reserved|Invalid/, url);
	}
	assert.equal(transport.normalizeUrl('acme.xentral.com/'), 'https://acme.xentral.com');
	assert.equal(transport.normalizeUrl('https://8.8.8.8'), 'https://8.8.8.8');
});

test('[3] the credential test maps every canonicalized internal host to an unroutable host', () => {
	const expr = new XentralApi().test.request.baseURL;
	const body = expr.slice(expr.indexOf('{{') + 2, expr.lastIndexOf('}}'));
	const baseUrl = (instanceUrl) => new Function('$credentials', `return ${body}`)({ instanceUrl });
	for (const url of BLOCKED) assert.equal(baseUrl(url), 'https://blocked.invalid', url);
	assert.equal(baseUrl('acme.xentral.com//'), 'https://acme.xentral.com');
	assert.equal(baseUrl('https://8.8.8.8'), 'https://8.8.8.8');
});

// ---------- 4. document list filters ----------

function filterEnum(path) {
	const param = docSpec.paths[path].get.parameters.map((p) => (p.$ref ? docSpec.components.parameters[p.$ref.split('/').pop()] : p)).find((p) => p.name === 'filter');
	const props = param.schema.items.properties;
	return { keys: props.key.enum, ops: props.op.enum };
}

const LISTS = [
	[handleOffer, '/api/v3/offers'],
	[handleSalesOrder, '/api/v3/salesOrders'],
	[handleInvoice, '/api/v3/invoices'],
	[handleCreditNote, '/api/v3/creditNotes'],
	[handleDeliveryNote, '/api/v3/deliveryNotes'],
	[handleProformaInvoice, '/api/v3/proformaInvoices'],
	[handleReturn, '/api/v3/returnOrders'],
	[handlePurchaseOrder, '/api/v3/purchaseOrders'],
];

test('[4] every document list filter uses a key and operator the spec declares', async () => {
	for (const [handler, path] of LISTS) {
		const ctx = context({ returnAll: false, limit: 5, filters: { status: 'released', customerId: '7', createdAfter: '2026-01-01' } });
		await handler.call(ctx, 'getAll', 0);
		const qs = ctx.calls[0].qs;
		const { keys, ops } = filterEnum(path);
		const used = Object.keys(qs).filter((k) => k.endsWith('[key]'));
		assert.ok(used.length > 0, path);
		for (const k of used) {
			assert.ok(keys.includes(qs[k]), `${path} key ${qs[k]}`);
			assert.ok(ops.includes(qs[k.replace('[key]', '[op]')]), `${path} op ${qs[k.replace('[key]', '[op]')]}`);
		}
	}
});

test('[4] the offer customer and date filters map to address.id and createdAt greaterThanOrEquals', async () => {
	const ctx = context({ returnAll: false, limit: 5, filters: { customerId: '7', createdAfter: '2026-01-01' } });
	await handleOffer.call(ctx, 'getAll', 0);
	const qs = ctx.calls[0].qs;
	assert.equal(qs['filter[0][key]'], 'address.id');
	assert.equal(qs['filter[0][value]'], '7');
	assert.equal(qs['filter[1][key]'], 'createdAt');
	assert.equal(qs['filter[1][op]'], 'greaterThanOrEquals');
});

// ---------- 5. offer payment method ----------

test('[5] offer create and update send the payment method inside financials', async () => {
	const create = context({ customerId: '4', additionalFields: { paymentMethodId: '3', currency: 'EUR' } }, { response: { id: 1 } });
	await handleOffer.call(create, 'create', 0);
	assert.deepEqual(create.calls[0].body.financials, { currency: 'EUR', paymentMethod: { id: '3' } });
	assert.equal(create.calls[0].body.paymentMethod, undefined);
	const update = context({ offerId: '8', updateFields: { paymentMethodId: '3' } }, { response: { id: 1 } });
	await handleOffer.call(update, 'update', 0);
	assert.deepEqual(update.calls[0].body.financials, { paymentMethod: { id: '3' } });
});

// ---------- 6. complete v3 results are not reported as truncated ----------

const fifty = Array.from({ length: 50 }, (_, i) => ({ id: i }));

test('[6] a full last page with links.next null and no meta is a complete result', async () => {
	const ctx = context({}, { response: { data: fifty, links: { next: null } } });
	const rows = await transport.xentralV3GetAll.call(ctx, 'offers', {}, undefined, 1);
	assert.equal(rows.length, 50);
	assert.equal(ctx.calls.length, 1);
	const all = context({}, { response: { data: fifty, links: { next: null } } });
	await transport.xentralV3GetAll.call(all, 'offers', {}, undefined, 1000);
	assert.equal(all.calls.length, 1);
});

test('[6] a page with a next link still reports truncation at the page limit', async () => {
	const ctx = context({}, { response: { data: fifty, links: { next: 'https://x/next' } } });
	await assert.rejects(() => transport.xentralV3GetAll.call(ctx, 'offers', {}, undefined, 1), /more data/);
});

// ---------- 7. trigger adoption needs the matching webhook id ----------

function hookContext(stored, remoteId) {
	const calls = [];
	return {
		calls,
		stored,
		getNodeWebhookUrl: () => 'https://n8n.example.com/webhook/x',
		getNodeParameter: (name, fallback) => (name === 'event' ? 'salesOrder.created' : name === 'signatureKey' ? '' : fallback),
		getWorkflowStaticData: () => stored,
		getNode: () => ({ name: 'Trigger' }),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		logger: { warn: () => {} },
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				if (options.method === 'GET') {
					return { data: [{ id: remoteId, url: 'https://n8n.example.com/webhook/x', events: [{ id: 'com.xentral.salesOrder.created.v1' }] }] };
				}
				return {};
			},
		},
	};
}

test('[7] a stored key for a different webhook id is not adopted, the remote one is replaced', async () => {
	const ctx = hookContext({ webhookId: '11', signatureKey: 'o'.repeat(32) }, '77');
	const exists = await new XentralTrigger().webhookMethods.default.checkExists.call(ctx);
	assert.equal(exists, false);
	assert.ok(ctx.calls.some((c) => c.method === 'DELETE' && c.url.endsWith('/webhooks/77')));
});

test('[7] the webhook is adopted when its id matches the one the stored key belongs to', async () => {
	const ctx = hookContext({ webhookId: 77, signatureKey: 'o'.repeat(32) }, '77');
	const exists = await new XentralTrigger().webhookMethods.default.checkExists.call(ctx);
	assert.equal(exists, true);
	assert.ok(!ctx.calls.some((c) => c.method === 'DELETE'));
});

// ---------- 8. custom API call accepts every documented path ----------

function samplePath(spec, p, item) {
	const params = Object.values(item).filter((v) => v && typeof v === 'object').flatMap((op) => op.parameters || []);
	if (Array.isArray(item.parameters)) params.push(...item.parameters);
	const resolved = params.map((x) => (x.$ref ? x.$ref.split('/').slice(1).reduce((t, k) => t[k], spec) : x));
	return p.replace(/\{([^}]+)\}/g, (_m, name) => {
		const hit = resolved.find((x) => x.in === 'path' && x.name === name);
		return String(hit?.schema?.enum?.[0] ?? '1');
	});
}

test('[8] all 573 documented operation paths pass Custom API Call validation', () => {
	let count = 0;
	for (const spec of specs) {
		for (const [p, item] of Object.entries(spec.paths)) {
			for (const m of ['get', 'post', 'put', 'patch', 'delete']) {
				if (!item[m]) continue;
				count++;
				const concrete = samplePath(spec, p, item);
				assert.doesNotThrow(() => resolveCustomPath('v1', concrete), `${m.toUpperCase()} ${p} as ${concrete}`);
			}
		}
	}
	assert.equal(count, 573);
});

test('[8] parameterized roots such as salesOrders files and productsTagAssignments are accepted', () => {
	assert.deepEqual(resolveCustomPath('v1', '/api/v2/salesOrders/7/files'), { version: 'v2', path: 'salesOrders/7/files' });
	assert.deepEqual(resolveCustomPath('v1', '/api/v2/productsTagAssignments'), { version: 'v2', path: 'productsTagAssignments' });
	assert.throws(() => resolveCustomPath('v2', 'notAResource/1'), /not a Xentral v2 resource/);
});

// ---------- 9. downloads keep their content ----------

async function runNode(params, response, binaryOut) {
	const ctx = context({ resource: 'customApiCall', operation: 'request', method: 'GET', apiVersion: 'v1', path: 'accounting/download', queryParameters: '{}', contentType: 'application/json', ...params }, { response, binaryOut });
	const out = await new Xentral().execute.call(ctx);
	return { ctx, items: out[0] };
}

test('[9] a text response is returned as data instead of being replaced by success', async () => {
	const { items } = await runNode({}, { statusCode: 200, headers: { 'content-type': 'text/csv' }, body: 'a;b\n1;2\n' });
	assert.equal(items[0].json.data, 'a;b\n1;2\n');
});

test('[9] Response Format Text decodes the body as text', async () => {
	const { ctx, items } = await runNode({ responseFormat: 'text' }, { statusCode: 200, headers: { 'content-type': 'text/csv' }, body: Buffer.from('x;y\n') });
	assert.equal(items[0].json.data, 'x;y\n');
	assert.notEqual(ctx.calls[0].json, true);
});

test('[9] Response Format File returns the download as binary data', async () => {
	const binaryOut = [];
	const zip = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0xff]);
	const { ctx, items } = await runNode(
		{ responseFormat: 'file', binaryPropertyName: 'export' },
		{ statusCode: 200, headers: { 'content-type': 'application/zip', 'content-disposition': 'attachment; filename="ledger.zip"' }, body: zip },
		binaryOut,
	);
	assert.equal(ctx.calls[0].encoding, 'arraybuffer');
	assert.ok(items[0].binary.export);
	assert.equal(binaryOut[0].fileName, 'ledger.zip');
	assert.equal(binaryOut[0].mimeType, 'application/zip');
	assert.deepEqual(Buffer.from(binaryOut[0].data, 'base64'), zip);
});

// ---------- 10. line item position ----------

test('[10] line item Position After Line Item ID maps to position.afterLineItem and Sort is never sent', async () => {
	const cases = [
		[handleOffer, 'updateLineItem', { offerId: '1', lineItemId: '2', updateFields: { sort: 3, afterLineItemId: '9' } }],
		[handleInvoice, 'updateLineItem', { invoiceId: '1', lineItemId: '2', updateFields: { sort: 3, afterLineItemId: '9' } }],
		[handleCreditNote, 'updateLineItem', { creditNoteId: '1', lineItemId: '2', updateFields: { sort: 3, afterLineItemId: '9' } }],
		[handleSalesOrder, 'updateLineItem', { salesOrderId: '1', lineItemId: '2', lineItemUpdateFields: { sort: 3, afterLineItemId: '9' } }],
		[handleDeliveryNote, 'updateLineItem', { deliveryNoteId: '1', lineItemId: '2', updateFields: { sort: 3, afterLineItemId: '9' }, lineItemUpdateFields: { sort: 3, afterLineItemId: '9' } }],
		[handlePurchaseOrder, 'updateLineItem', { purchaseOrderId: '1', lineItemId: '2', updateFields: { sort: 3, afterLineItemId: '9' }, lineItemUpdateFields: { sort: 3, afterLineItemId: '9' } }],
		[handleReturn, 'updateLineItem', { returnId: '1', lineItemId: '2', updateFields: { sort: 3, afterLineItemId: '9' } }],
		[handleProformaInvoice, 'updateLineItem', { proformaInvoiceId: '1', lineItemId: '2', updateFields: { sort: 3, afterLineItemId: '9' } }],
	];
	for (const [handler, op, params] of cases) {
		const ctx = context(params, { response: { id: 1 } });
		await handler.call(ctx, op, 0);
		const body = ctx.calls[0].body;
		assert.equal(body.sort, undefined, handler.name);
		assert.deepEqual(body.position, { afterLineItem: { id: '9' } }, handler.name);
	}
});

test('[10] every document field set that offered Sort also offers Position After Line Item ID', () => {
	const props = new Xentral().description.properties;
	const collections = props.filter((p) => Array.isArray(p.options) && p.options.some((o) => o.name === 'sort'));
	const docs = collections.filter((c) => !c.displayOptions?.show?.resource?.includes('storageLocation'));
	assert.ok(docs.length >= 8);
	for (const c of docs) {
		assert.ok(c.options.some((o) => o.name === 'afterLineItemId'), `${c.name} for ${c.displayOptions?.show?.resource}`);
	}
});
