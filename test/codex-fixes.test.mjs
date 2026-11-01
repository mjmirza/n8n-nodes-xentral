import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const transport = require('../dist/nodes/Xentral/transport.js');
const { handleInvoice } = require('../dist/nodes/Xentral/resources/invoice/invoice.handler.js');
const { handleLiability } = require('../dist/nodes/Xentral/resources/liability/liability.handler.js');
const { handleCustomer } = require('../dist/nodes/Xentral/resources/customer/customer.handler.js');
const { handlePurchasePrice } = require('../dist/nodes/Xentral/resources/purchasePrice/purchasePrice.handler.js');
const { runSpecOperation } = require('../dist/nodes/Xentral/resources/specDriven/spec.handler.js');
const { SPEC_CATALOG } = require('../dist/nodes/Xentral/resources/specDriven/spec.catalog.js');
const { XentralTrigger } = require('../dist/nodes/Xentral/XentralTrigger.node.js');
const { XentralApi } = require('../dist/credentials/XentralApi.credentials.js');
const { verifyXentralSignature, SIGNATURE_MAX_AGE_MS } = require('../dist/nodes/Xentral/trigger.signature.js');

const BASE = 'https://acme.xentral.com/api';
const HASH40 = '2a' + 'b'.repeat(38);

// The shape n8n's httpRequest really throws: an AxiosError with response.status and response.data.
function httpError(status, headers = {}) {
	const error = new Error(`Request failed with status code ${status}`);
	error.isAxiosError = true;
	error.response = { status, statusText: 'x', headers, data: { title: 'gateway' } };
	return error;
}

// The older request-style shape (response.statusCode and response.body), still supported.
function legacyHttpError(statusCode, headers = {}) {
	const error = new Error(`HTTP ${statusCode}`);
	error.response = { statusCode, headers, body: { title: 'gateway' } };
	return error;
}

function context(params, { response = { data: [] }, binary } = {}) {
	const calls = [];
	return {
		calls,
		getNode: () => ({ name: 'Xentral', type: 'n8n-nodes-xentral.xentral', typeVersion: 2, parameters: {} }),
		getNodeParameter: (name, _i, fallback) => (name in params ? params[name] : fallback),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: params.__token ?? '2|token' }),
		continueOnFail: () => false,
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				return typeof response === 'function' ? response(options, calls.length) : response;
			},
			assertBinaryData: () => binary ?? { fileName: 'scan.pdf', mimeType: 'application/pdf' },
			getBinaryDataBuffer: async () => Buffer.from('%PDF-1.7 hello'),
		},
	};
}

// ---------- 1. retries must not duplicate writes ----------

test('a POST that hits a 504 is sent exactly once', async () => {
	const ctx = context({}, { response: () => { throw httpError(504); } });
	await assert.rejects(() => transport.xentralRequest.call(ctx, 'POST', 'salesOrders', { a: 1 }, {}, 'v1'));
	assert.equal(ctx.calls.length, 1);
});

test('a PATCH that hits a 502 or 503 is not retried either', async () => {
	for (const status of [502, 503]) {
		const ctx = context({}, { response: () => { throw httpError(status); } });
		await assert.rejects(() => transport.xentralRequest.call(ctx, 'PATCH', 'salesOrders/1', { a: 1 }, {}, 'v1'));
		assert.equal(ctx.calls.length, 1, `status ${status}`);
	}
});

test('a POST rate limited with 429 is retried, because Xentral did not process it', async () => {
	const ctx = context({}, {
		response: (_o, n) => { if (n === 1) throw httpError(429, { 'retry-after': '0' }); return { id: 5 }; },
	});
	const result = await transport.xentralRequest.call(ctx, 'POST', 'salesOrders', { a: 1 }, {}, 'v1');
	assert.equal(ctx.calls.length, 2);
	assert.deepEqual(result, { id: 5 });
});

test('the legacy statusCode/body error shape is still retried and keeps its detail', async () => {
	const retried = context({}, {
		response: (_o, n) => { if (n === 1) throw legacyHttpError(429, { 'retry-after': '0' }); return { id: 6 }; },
	});
	await transport.xentralRequest.call(retried, 'POST', 'salesOrders', { a: 1 }, {}, 'v1');
	assert.equal(retried.calls.length, 2);
	const failed = context({}, { response: () => { throw legacyHttpError(504); } });
	await assert.rejects(() => transport.xentralRequest.call(failed, 'POST', 'salesOrders', { a: 1 }, {}, 'v1'), /gateway/);
	assert.equal(failed.calls.length, 1);
});

test('a GET that hits a 504 is retried', async () => {
	const ctx = context({}, {
		response: (_o, n) => { if (n === 1) throw httpError(504, { 'retry-after': '0' }); return { data: [] }; },
	});
	await transport.xentralRequest.call(ctx, 'GET', 'salesOrders', {}, {}, 'v1');
	assert.equal(ctx.calls.length, 2);
});

// ---------- 2. attachments use the JSON schema ----------

test('Invoice Attach File sends keyword, fileName and base64 fileContent as JSON', async () => {
	const ctx = context({ invoiceId: '12', binaryPropertyName: 'data' }, { response: { id: 'f1' } });
	await handleInvoice.call(ctx, 'attachFile', 0);
	const call = ctx.calls[0];
	assert.equal(call.method, 'POST');
	assert.equal(call.url, `${BASE}/v3/invoices/12/files`);
	assert.equal(call.headers['Content-Type'], 'application/json');
	assert.equal(call.body.keyword, 'attachment');
	assert.equal(call.body.fileName, 'scan.pdf');
	assert.equal(Buffer.from(call.body.fileContent, 'base64').toString(), '%PDF-1.7 hello');
	assert.equal(call.body.file, undefined);
});

test('Liability Upload Document uses the v1 documents JSON body', async () => {
	const ctx = context({ liabilityId: '3', binaryPropertyName: 'data' }, { response: { id: 'd1' } });
	await handleLiability.call(ctx, 'uploadDocument', 0);
	const call = ctx.calls[0];
	assert.equal(call.url, `${BASE}/v1/liabilities/3/documents`);
	assert.deepEqual(Object.keys(call.body).sort(), ['fileContent', 'fileName', 'keyword']);
});

// ---------- 3 and 8. trigger fails closed and rejects replays ----------

function sign(key, body, ts) {
	return createHmac('sha256', key).update(body + ts).digest('hex');
}

function webhookContext({ key = '', stored = {}, headers = {}, body = '{"id":1}' } = {}) {
	const sent = {};
	return {
		sent,
		getRequestObject: () => ({ rawBody: Buffer.from(body) }),
		getBodyData: () => JSON.parse(body),
		getHeaderData: () => headers,
		getNodeParameter: (name, fallback) => (name === 'signatureKey' ? key : fallback),
		getWorkflowStaticData: () => stored,
		getResponseObject: () => ({ status: (code) => ({ send: (msg) => { sent.code = code; sent.msg = msg; } }) }),
		helpers: { returnJsonArray: (b) => [{ json: b }] },
	};
}

test('the trigger rejects an unsigned delivery with 401 when no key is known', async () => {
	const ctx = webhookContext();
	const result = await new XentralTrigger().webhook.call(ctx);
	assert.equal(ctx.sent.code, 401);
	assert.equal(result.noWebhookResponse, true);
	assert.equal(result.workflowData, undefined);
});

test('the trigger accepts a correctly signed, fresh delivery', async () => {
	const key = 'k'.repeat(32);
	const ts = String(Math.floor(Date.now() / 1000));
	const body = '{"id":1}';
	const ctx = webhookContext({ stored: { signatureKey: key }, body, headers: { 'xentral-signature': sign(key, body, ts), 'xentral-request-timestamp': ts } });
	const result = await new XentralTrigger().webhook.call(ctx);
	assert.equal(ctx.sent.code, undefined);
	assert.equal(result.workflowData[0][0].json.id, 1);
});

test('a correctly signed delivery from the year 2000 is rejected as a replay', async () => {
	const key = 'k'.repeat(32);
	const ts = '946684800';
	const body = '{"id":1}';
	const ctx = webhookContext({ stored: { signatureKey: key }, body, headers: { 'xentral-signature': sign(key, body, ts), 'xentral-request-timestamp': ts } });
	await new XentralTrigger().webhook.call(ctx);
	assert.equal(ctx.sent.code, 401);
	assert.equal(verifyXentralSignature(key, body, sign(key, body, ts), ts, Date.now()), 'stale');
});

test('the freshness window accepts ISO and millisecond timestamps within five minutes', () => {
	const key = 'k'.repeat(32);
	const now = Date.UTC(2026, 10, 1, 12, 0, 0);
	for (const ts of [new Date(now - 60_000).toISOString(), String(now - 60_000)]) {
		assert.equal(verifyXentralSignature(key, 'b', sign(key, 'b', ts), ts, now), 'ok', ts);
	}
	const late = String(now - SIGNATURE_MAX_AGE_MS - 1000);
	assert.equal(verifyXentralSignature(key, 'b', sign(key, 'b', late), late, now), 'stale');
});

test('a short node key that create() replaced with a generated key does not lock out deliveries', async () => {
	const generated = 'g'.repeat(32);
	const ts = String(Math.floor(Date.now() / 1000));
	const body = '{"id":2}';
	const ctx = webhookContext({ key: 'short', stored: { signatureKey: generated }, body, headers: { 'xentral-signature': sign(generated, body, ts), 'xentral-request-timestamp': ts } });
	const result = await new XentralTrigger().webhook.call(ctx);
	assert.equal(result.workflowData[0][0].json.id, 2);
});

test('checkExists does not adopt an existing webhook whose signing key it does not hold', async () => {
	const calls = [];
	const ctx = {
		getNodeWebhookUrl: () => 'https://n8n.example.com/webhook/x',
		getNodeParameter: (name, fallback) => (name === 'event' ? 'salesOrder.created' : name === 'signatureKey' ? '' : fallback),
		getWorkflowStaticData: () => ({}),
		getNode: () => ({ name: 'Trigger' }),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		logger: { warn: () => {} },
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				if (options.method === 'GET') {
					return { data: [{ id: '77', url: 'https://n8n.example.com/webhook/x', events: [{ id: 'com.xentral.salesOrder.created.v1' }] }] };
				}
				return {};
			},
		},
	};
	const exists = await new XentralTrigger().webhookMethods.default.checkExists.call(ctx);
	assert.equal(exists, false);
	assert.ok(calls.some((c) => c.method === 'DELETE' && c.url.endsWith('/webhooks/77')));
});

// ---------- 4. bare tokens that start with a digit ----------

test('a 40 character bare token that starts with a digit is sent unchanged', async () => {
	const ctx = context({ __token: HASH40 }, { response: { data: [] } });
	await transport.xentralRequest.call(ctx, 'GET', 'salesOrders', {}, {}, 'v1');
	assert.equal(ctx.calls[0].headers.Authorization, `Bearer ${HASH40}`);
	assert.equal(transport.normalizeToken(HASH40), HASH40);
});

test('a Sanctum id glued to a 40 character key loses only the id', () => {
	assert.equal(transport.normalizeToken(`12${HASH40}`), HASH40);
	assert.equal(transport.normalizeToken('2|abc'), '2|abc');
});

test('credential header and transport normalize the same way', () => {
	const credential = new XentralApi();
	const header = credential.authenticate.properties.headers.Authorization;
	const body = header.slice(header.indexOf('{{') + 2, header.lastIndexOf('}}'));
	const evaluate = (accessToken) => new Function('$credentials', `return ${body}`)({ accessToken });
	for (const raw of [HASH40, `12${HASH40}`, ' "Bearer 2|abc" ', '2|abc']) {
		assert.equal(evaluate(raw), transport.normalizeToken(raw), raw);
	}
});

// ---------- 5. customer search uses operators v2 supports ----------

test('customer search queries number, name and email with equals only', async () => {
	const ctx = context({ searchTerm: 'Acme GmbH', returnAll: false, limit: 10 }, { response: { data: [] } });
	await handleCustomer.call(ctx, 'search', 0);
	assert.equal(ctx.calls.length, 3);
	for (const call of ctx.calls) {
		assert.equal(call.url, `${BASE}/v2/customers`);
		assert.equal(call.qs['filter[0][op]'], 'equals');
	}
	assert.deepEqual(ctx.calls.map((c) => c.qs['filter[0][key]']).sort(), ['email', 'name', 'number']);
});

// ---------- 6. creates expose the id from Location ----------

test('a create with an empty body returns the id from the Location header', async () => {
	const ctx = context({}, { response: { statusCode: 201, headers: { location: '/api/v2/customers/4711' }, body: '' } });
	const result = await transport.xentralRequest.call(ctx, 'POST', 'customers', { name: 'x' }, {}, 'v2');
	assert.equal(result.id, '4711');
	assert.equal(result.success, true);
	assert.equal(ctx.calls[0].returnFullResponse, true);
});

test('a response with a body is returned unchanged', async () => {
	const ctx = context({}, { response: { statusCode: 200, headers: {}, body: { data: { id: 9 } } } });
	const result = await transport.xentralRequest.call(ctx, 'GET', 'customers/9', {}, {}, 'v2');
	assert.deepEqual(result, { data: { id: 9 } });
});

// ---------- 7. credential test cannot reach internal hosts ----------

test('the credential test resolves internal and private hosts to an unroutable host', () => {
	const credential = new XentralApi();
	const expr = credential.test.request.baseURL;
	const body = expr.slice(expr.indexOf('{{') + 2, expr.lastIndexOf('}}'));
	const baseUrl = (instanceUrl) => new Function('$credentials', `return ${body}`)({ instanceUrl });
	for (const bad of ['https://127.0.0.1', '10.0.0.5', 'https://192.168.1.10/', 'localhost', 'https://169.254.169.254', 'http://acme.xentral.com', 'https://user@127.0.0.1']) {
		assert.equal(baseUrl(bad), 'https://blocked.invalid', bad);
	}
	assert.equal(baseUrl('acme.xentral.com//'), 'https://acme.xentral.com');
});

// ---------- 9. declared query params on writes ----------

test('Report Execute Query passes the preview query parameter on POST', async () => {
	const op = SPEC_CATALOG.find((r) => r.resource === 'report').ops.find((o) => o.value === 'executeQuery');
	const params = { queryParameters: '{"preview":true}', body: '{"query":"select 1"}' };
	for (const name of op.pathParams) params[name] = '1';
	const ctx = context(params, { response: { data: [] } });
	await runSpecOperation.call(ctx, 'report', 'executeQuery', 0);
	assert.equal(ctx.calls[0].method, 'POST');
	assert.deepEqual(ctx.calls[0].qs, { preview: true });
});

// ---------- 10. cursor pagination at an exact page boundary ----------

test('cursor pagination returns a complete single page when maxPages is 1', async () => {
	const ctx = context({}, { response: { data: [{ id: 1 }, { id: 2 }], extra: { cursor: {} } } });
	const rows = await transport.xentralV1CursorGetAll.call(ctx, 'customers', {}, undefined, 1, 'v2');
	assert.equal(rows.length, 2);
});

test('cursor pagination still reports truncation when more pages exist', async () => {
	const ctx = context({}, { response: { data: [{ id: 1 }], extra: { cursor: { nextCursor: 'abc' } } } });
	await assert.rejects(() => transport.xentralV1CursorGetAll.call(ctx, 'customers', {}, undefined, 1, 'v2'), /more data/);
});

// ---------- 11. purchase price dates are optional ----------

test('purchase price create works without dates and sends YYYY-MM-DD when given', async () => {
	const ctx = context({ productId: '5', fromQuantity: 1, priceAmount: 2.5, priceCurrency: 'EUR' }, { response: { statusCode: 201, headers: { location: '/api/v2/purchasePrices/8' }, body: '' } });
	const result = await handlePurchasePrice.call(ctx, 'create', 0);
	assert.equal(ctx.calls[0].body.validFrom, undefined);
	assert.equal(ctx.calls[0].body.expiresAt, undefined);
	assert.equal(result.id, '8');
	const dated = context({ productId: '5', fromQuantity: 1, priceAmount: 2.5, priceCurrency: 'EUR', validFrom: '2026-11-01T00:00:00.000+01:00', expiresAt: '2027-01-31' }, { response: { id: 1 } });
	await handlePurchasePrice.call(dated, 'create', 0);
	assert.equal(dated.calls[0].body.validFrom, '2026-11-01');
	assert.equal(dated.calls[0].body.expiresAt, '2027-01-31');
});
