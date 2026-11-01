import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

// Regression tests for the fourth Codex review (v1.4.1). Each block names the finding it pins.
const require = createRequire(import.meta.url);
const transport = require('../dist/nodes/Xentral/transport.js');
const { XentralApi } = require('../dist/credentials/XentralApi.credentials.js');
const { Xentral } = require('../dist/nodes/Xentral/Xentral.node.js');
const { handleSalesOrder } = require('../dist/nodes/Xentral/resources/salesOrder/salesOrder.handler.js');
const { handleLiability } = require('../dist/nodes/Xentral/resources/liability/liability.handler.js');
const { handleCustomer } = require('../dist/nodes/Xentral/resources/customer/customer.handler.js');
const { handleContact } = require('../dist/nodes/Xentral/resources/contact/contact.handler.js');
const { handleSalesPrice } = require('../dist/nodes/Xentral/resources/salesPrice/salesPrice.handler.js');
const { handleEmployee } = require('../dist/nodes/Xentral/resources/employee/employee.handler.js');
const { handleWebhook } = require('../dist/nodes/Xentral/resources/webhook/webhook.handler.js');

function context(params, { response = { data: [] } } = {}) {
	const calls = [];
	return {
		calls,
		getNode: () => ({ name: 'Xentral', type: 'n8n-nodes-xentral.xentral', typeVersion: 2, parameters: {} }),
		getNodeParameter: (name, _i, fallback) => (name in params ? params[name] : fallback),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		continueOnFail: () => false,
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				return typeof response === 'function' ? response(options, calls.length) : response;
			},
		},
	};
}

// ---------- 1. userinfo, backslash and whitespace in the instance URL ----------

const BS = String.fromCharCode(92);
const TRICKS = [`https://127.0.0.1${BS}@acme.xentral.com`, 'https://user@127.0.0.1', 'https://acme.xentral.com@127.0.0.1', `https://acme.xentral.com${BS}.evil`, 'https://acme .xentral.com', 'https://user:pw@acme.xentral.com'];

test('[r4-1] the credential test refuses userinfo, backslashes and whitespace', () => {
	const expr = new XentralApi().test.request.baseURL;
	const body = expr.slice(expr.indexOf('{{') + 2, expr.lastIndexOf('}}'));
	const baseUrl = (instanceUrl) => new Function('$credentials', `return ${body}`)({ instanceUrl });
	for (const url of TRICKS) assert.equal(baseUrl(url), 'https://blocked.invalid', url);
	assert.equal(baseUrl('acme.xentral.com'), 'https://acme.xentral.com');
});

test('[r4-1] the transport refuses the same instance URLs', () => {
	for (const url of TRICKS) assert.throws(() => transport.normalizeUrl(url), /not allowed|Invalid/, url);
	assert.equal(transport.normalizeUrl('https://acme.xentral.com'), 'https://acme.xentral.com');
});

// ---------- 2. sales order consignment fields keep their meaning ----------

test('[r4-2] the saved warehouse field sends what 1.4.0 sent, the new storage location field sends its own key', async () => {
	const saved = context({ salesOrderId: '1', updateFields: { commissionConsignmentWarehouseId: '12' } }, { response: { id: 1 } });
	await handleSalesOrder.call(saved, 'update', 0);
	assert.deepEqual(saved.calls[0].body.commissionConsignmentWarehouse, { id: '12' });
	assert.equal(saved.calls[0].body.commissionConsignmentStorageLocation, undefined);
	const fresh = context({ salesOrderId: '1', updateFields: { commissionConsignmentStorageLocationId: '33' } }, { response: { id: 1 } });
	await handleSalesOrder.call(fresh, 'update', 0);
	assert.deepEqual(fresh.calls[0].body.commissionConsignmentStorageLocation, { id: '33' });
	const create = context({ customerId: '4', additionalFields: { commissionConsignmentStorageLocationId: '33' } }, { response: { id: 1 } });
	await handleSalesOrder.call(create, 'create', 0);
	assert.deepEqual(create.calls[0].body.commissionConsignmentStorageLocation, { id: '33' });
	const props = new Xentral().description.properties.filter((p) => p.displayOptions?.show?.resource?.includes('salesOrder') && Array.isArray(p.options));
	assert.ok(props.filter((p) => p.options.some((o) => o.name === 'commissionConsignmentStorageLocationId')).length >= 2);
});

// ---------- 3. liability status ----------

test('[r4-3] liability status is sent lowercase the way Xentral accepts it', async () => {
	for (const [saved, sent] of [['PENDING', 'open'], ['PAID', 'paid'], ['PARTIALLY_PAID', 'open'], ['open', 'open']]) {
		const ctx = context({ supplierId: '3', additionalFields: { status: saved } }, { response: { id: 1 } });
		await handleLiability.call(ctx, 'create', 0);
		assert.equal(ctx.calls[0].body.status, sent, saved);
	}
	const cancelled = context({ supplierId: '3', additionalFields: { status: 'CANCELLED' } });
	await assert.rejects(() => handleLiability.call(cancelled, 'create', 0), /open or paid/);
});

// ---------- 4. customer autoCreateDocuments ----------

test('[r4-4] auto-create documents sends a value from the spec enum', async () => {
	const legacy = context({ salutation: 'company', name: 'Acme', additionalFields: { autoCreateDocuments: true } }, { response: { id: 1 } });
	await handleCustomer.call(legacy, 'create', 0);
	assert.equal(legacy.calls[0].body.documentDelivery.autoCreateDocuments, 'both');
	const off = context({ salutation: 'company', name: 'Acme', additionalFields: { autoCreateDocuments: false } }, { response: { id: 1 } });
	await handleCustomer.call(off, 'create', 0);
	assert.equal(off.calls[0].body.documentDelivery?.autoCreateDocuments, undefined);
	const chosen = context({ customerId: '9', updateFields: { autoCreateDocuments: true, autoCreateDocumentsType: 'invoice' } }, { response: { id: 1 } });
	await handleCustomer.call(chosen, 'update', 0);
	assert.equal(chosen.calls[0].body.documentDelivery.autoCreateDocuments, 'invoice');
});

// ---------- 5. contact groups ----------

test('[r4-5] contact groups are sent as a list of id strings', async () => {
	const ctx = context({ customerId: '4', contactName: 'Eva', additionalFields: { groups: '17, 22' } }, { response: { id: 1 } });
	await handleContact.call(ctx, 'create', 0);
	assert.deepEqual(ctx.calls[0].body.groups, ['17', '22']);
});

// ---------- 6. sales price dates ----------

test('[r4-6] sales price dates are sent as YYYY-MM-DD', async () => {
	const ctx = context({ productId: '5', additionalFields: { validFrom: '2026-11-01T00:00:00.000+01:00', expiresAt: '2027-01-31T00:00:00.000+01:00' } }, { response: { id: 1 } });
	await handleSalesPrice.call(ctx, 'create', 0);
	assert.equal(ctx.calls[0].body.validFrom, '2026-11-01');
	assert.equal(ctx.calls[0].body.expiresAt, '2027-01-31');
	const upd = context({ salesPriceId: '7', updateFields: { validFrom: '2026-12-24T10:00:00.000Z' } }, { response: { id: 1 } });
	await handleSalesPrice.call(upd, 'update', 0);
	assert.equal(upd.calls[0].body.validFrom, '2026-12-24');
});

// ---------- 7. unpaginated lists ----------

test('[r4-7] employees and webhooks are read with one request and no page parameters', async () => {
	const fifty = Array.from({ length: 50 }, (_, i) => ({ id: String(i) }));
	for (const handler of [handleEmployee, handleWebhook]) {
		const ctx = context({ returnAll: false, limit: 51 }, { response: { data: fifty } });
		const rows = await handler.call(ctx, 'getAll', 0);
		assert.equal(ctx.calls.length, 1, handler.name);
		assert.equal(ctx.calls[0].qs?.['page[number]'], undefined, handler.name);
		assert.equal(rows.length, 50, handler.name);
		const all = context({ returnAll: true }, { response: { data: fifty } });
		const allRows = await handler.call(all, 'getAll', 0);
		assert.equal(all.calls.length, 1, handler.name);
		assert.equal(allRows.length, 50, handler.name);
	}
});

// ---------- 8. Retry-After beyond 30 seconds ----------

test('[r4-8] a Retry-After of 120 seconds is honoured, and the cap is configurable', async () => {
	assert.equal(transport.retryAfterMs('120', 0), 120000);
	assert.equal(transport.retryAfterMs('9999', 0), transport.RETRY_CONFIG.maxRetryAfterMs);
	assert.equal(transport.RETRY_CONFIG.maxRetryAfterMs, 120000);
	const before = transport.RETRY_CONFIG.maxRetryAfterMs;
	transport.RETRY_CONFIG.maxRetryAfterMs = 5000;
	try {
		assert.equal(transport.retryAfterMs('120', 0), 5000);
	} finally {
		transport.RETRY_CONFIG.maxRetryAfterMs = before;
	}
});

// ---------- 9. error messages objects ----------

test('[r4-9] a messages object of arrays reaches the error message and description', async () => {
	const error = new Error('Request failed with status code 422');
	error.response = { status: 422, headers: {}, data: { title: 'Validation failed', messages: { 'carrier.credentials': ['must be an object'] } } };
	const ctx = context({}, { response: () => { throw error; } });
	await assert.rejects(
		() => transport.xentralRequest.call(ctx, 'POST', 'shippingMethods', { a: 1 }, {}, 'v1'),
		(e) => {
			assert.match(e.message, /carrier\.credentials: must be an object/);
			assert.match(String(e.description), /carrier\.credentials: must be an object/);
			return true;
		},
	);
});
