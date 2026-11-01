import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

// Regression tests for the third Codex review (v1.4.0). Each block names the finding it pins.
const require = createRequire(import.meta.url);
const transport = require('../dist/nodes/Xentral/transport.js');
const { XentralApi } = require('../dist/credentials/XentralApi.credentials.js');
const { handleCustomApiCall } = require('../dist/nodes/Xentral/resources/customApiCall/customApiCall.handler.js');
const { handleOffer } = require('../dist/nodes/Xentral/resources/offer/offer.handler.js');
const { handleSalesOrder } = require('../dist/nodes/Xentral/resources/salesOrder/salesOrder.handler.js');
const { handleInvoice } = require('../dist/nodes/Xentral/resources/invoice/invoice.handler.js');
const { handleCreditNote } = require('../dist/nodes/Xentral/resources/creditNote/creditNote.handler.js');
const { handleDeliveryNote } = require('../dist/nodes/Xentral/resources/deliveryNote/deliveryNote.handler.js');
const { handleProformaInvoice } = require('../dist/nodes/Xentral/resources/proformaInvoice/proformaInvoice.handler.js');
const { handleReturn } = require('../dist/nodes/Xentral/resources/return/return.handler.js');
const { handlePurchaseOrder } = require('../dist/nodes/Xentral/resources/purchaseOrder/purchaseOrder.handler.js');
const { handleAddress } = require('../dist/nodes/Xentral/resources/address/address.handler.js');
const { handleShippingMethod } = require('../dist/nodes/Xentral/resources/shippingMethod/shippingMethod.handler.js');
const { Xentral } = require('../dist/nodes/Xentral/Xentral.node.js');

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

// ---------- 1. V1/V2 page pagination uses the documented page size of 50 ----------

test('[r3-1] page pagination asks for 50 per page and keeps paging when totalCount says more exist', async () => {
	const page = (n) => ({ data: Array.from({ length: n === 1 ? 50 : 1 }, (_, i) => ({ id: `${n}-${i}` })), extra: { totalCount: 51 } });
	const ctx = context({}, { response: (o) => page(Number(o.qs['page[number]'])) });
	const rows = await transport.xentralV1PageGetAll.call(ctx, 'products', {}, undefined, undefined, 'v2');
	assert.equal(ctx.calls[0].qs['page[size]'], 50);
	assert.equal(rows.length, 51);
	assert.equal(ctx.calls.length, 2);
});

// ---------- 2. percent-encoded and Unicode hosts ----------

const ENCODED = ['https://%31%32%37.0.0.1', 'https://%6c%6f%63%61%6c%68%6f%73%74', 'https://１２７.0.0.1', 'https://127。0.0.1', 'https://127．0.0.1', 'https://1%30.0.0.1', 'https://%zz'];

test('[r3-2] the credential test blocks percent-encoded and Unicode spellings of internal hosts', () => {
	const expr = new XentralApi().test.request.baseURL;
	const body = expr.slice(expr.indexOf('{{') + 2, expr.lastIndexOf('}}'));
	const baseUrl = (instanceUrl) => new Function('$credentials', `return ${body}`)({ instanceUrl });
	for (const url of ENCODED) assert.equal(baseUrl(url), 'https://blocked.invalid', url);
	assert.equal(baseUrl('acme.xentral.com'), 'https://acme.xentral.com');
	assert.equal(baseUrl('https://xn--mnchen-3ya.example.com'), 'https://xn--mnchen-3ya.example.com');
});

test('[r3-2] the transport blocks the same encoded hosts', () => {
	for (const url of ENCODED) assert.throws(() => transport.normalizeUrl(url), /internal or reserved|Invalid/, url);
});

// ---------- 3. Custom API Call DELETE with a body ----------

test('[r3-3] Custom API Call sends a DELETE body when one is given, and none when it is empty', async () => {
	const base = { method: 'DELETE', apiVersion: 'v1', path: 'products', queryParameters: '{}', contentType: 'application/json' };
	const withBody = context({ ...base, body: '[{"id":"1"},{"id":"2"}]' }, { response: {} });
	await handleCustomApiCall.call(withBody, 'request', 0);
	assert.deepEqual(withBody.calls[0].body, [{ id: '1' }, { id: '2' }]);
	const empty = context({ ...base, body: '{}' }, { response: {} });
	await handleCustomApiCall.call(empty, 'request', 0);
	assert.equal(empty.calls[0].body, undefined);
	const bodyField = new Xentral().description.properties.find((p) => p.name === 'body' && p.displayOptions?.show?.resource?.includes('customApiCall'));
	assert.ok(bodyField.displayOptions.show.method.includes('DELETE'));
});

// ---------- 4. saved Sort-only line item updates keep running ----------

test('[r3-4] a saved Sort-only line item update does not throw and sends nothing', async () => {
	const cases = [
		[handleOffer, { offerId: '1', lineItemId: '2', updateFields: { sort: 3 } }],
		[handleInvoice, { invoiceId: '1', lineItemId: '2', updateFields: { sort: 3 } }],
		[handleCreditNote, { creditNoteId: '1', lineItemId: '2', updateFields: { sort: 3 } }],
		[handleSalesOrder, { salesOrderId: '1', lineItemId: '2', lineItemUpdateFields: { sort: 3 } }],
		[handleDeliveryNote, { deliveryNoteId: '1', lineItemId: '2', lineItemUpdateFields: { sort: 3 } }],
		[handlePurchaseOrder, { purchaseOrderId: '1', lineItemId: '2', lineItemUpdateFields: { sort: 3 } }],
		[handleReturn, { returnId: '1', lineItemId: '2', updateFields: { sort: 3 } }],
		[handleProformaInvoice, { proformaInvoiceId: '1', lineItemId: '2', updateFields: { sort: 3 } }],
	];
	for (const [handler, params] of cases) {
		const ctx = context(params, { response: { id: 1 } });
		const result = await handler.call(ctx, 'updateLineItem', 0);
		assert.equal(ctx.calls.length, 0, handler.name);
		assert.equal(result.success, true, handler.name);
	}
	const empty = context({ offerId: '1', lineItemId: '2', updateFields: {} });
	await assert.rejects(() => handleOffer.call(empty, 'updateLineItem', 0), /No fields provided/);
});

// ---------- 5. Hidden on PDF maps to printSettings.hidden ----------

test('[r3-5] Hidden on PDF is sent as printSettings.hidden on every document line item', async () => {
	const cases = [
		[handleOffer, { offerId: '1', lineItemId: '2', updateFields: { hiddenOnPdf: true } }],
		[handleInvoice, { invoiceId: '1', lineItemId: '2', updateFields: { hiddenOnPdf: true } }],
		[handleCreditNote, { creditNoteId: '1', lineItemId: '2', updateFields: { hiddenOnPdf: true } }],
		[handleSalesOrder, { salesOrderId: '1', lineItemId: '2', lineItemUpdateFields: { hiddenOnPdf: true } }],
		[handleDeliveryNote, { deliveryNoteId: '1', lineItemId: '2', lineItemUpdateFields: { hiddenOnPdf: true } }],
		[handlePurchaseOrder, { purchaseOrderId: '1', lineItemId: '2', lineItemUpdateFields: { hiddenOnPdf: true } }],
		[handleReturn, { returnId: '1', lineItemId: '2', updateFields: { hiddenOnPdf: true } }],
		[handleProformaInvoice, { proformaInvoiceId: '1', lineItemId: '2', updateFields: { hiddenOnPdf: true } }],
	];
	for (const [handler, params] of cases) {
		const ctx = context(params, { response: { id: 1 } });
		await handler.call(ctx, 'updateLineItem', 0);
		const body = ctx.calls[0].body;
		assert.deepEqual(body.printSettings, { hidden: true }, handler.name);
		assert.equal(body.hiddenOnPdf, undefined, handler.name);
	}
	const add = context({ offerId: '1', productId: '5', quantity: 1, lineItemOptions: { hiddenOnPdf: false } }, { response: { id: 1 } });
	await handleOffer.call(add, 'addLineItem', 0);
	assert.deepEqual(add.calls[0].body.printSettings, { hidden: false });
});

// ---------- 6. master data addresses fit their schema ----------

test('[r3-6] a masterdata address create sends only the fields its schema allows', async () => {
	const ctx = context({
		customerId: '4', name: 'Acme', street: 'Hauptstr 1', city: 'Berlin', zip: '10115', country: 'DE', type: 'masterdata',
		additionalFields: { email: 'a@b.de', salutation: 'Herr', addressSupplement: 'Hinterhaus' },
	}, { response: { id: 1 } });
	await handleAddress.call(ctx, 'create', 0);
	const allowed = ['addressSupplement', 'city', 'country', 'state', 'street', 'type', 'zip'];
	for (const key of Object.keys(ctx.calls[0].body)) assert.ok(allowed.includes(key), key);
	assert.equal(ctx.calls[0].body.addressSupplement, 'Hinterhaus');
	const billing = context({ customerId: '4', name: 'Acme', street: 's', city: 'c', zip: 'z', country: 'DE', type: 'billingaddress', additionalFields: {} }, { response: { id: 1 } });
	await handleAddress.call(billing, 'create', 0);
	assert.equal(billing.calls[0].body.name, 'Acme');
	const master = context({ customerId: '4', name: '', street: 's', city: 'c', zip: 'z', country: 'DE', type: 'masterdata', additionalFields: {} }, { response: { id: 1 } });
	await handleAddress.call(master, 'create', 0);
	assert.equal(master.calls[0].body.name, undefined);
});

// ---------- 7. carrier credentials are an object ----------

test('[r3-7] shipping method carrier credentials JSON is sent as an object', async () => {
	const ctx = context({ name: 'DHL', additionalFields: { carrierCredentials: '{"bearer":{"token":"test"}}' } }, { response: { id: 1 } });
	await handleShippingMethod.call(ctx, 'create', 0);
	assert.deepEqual(ctx.calls[0].body.carrier.credentials, { bearer: { token: 'test' } });
	const bad = context({ name: 'DHL', additionalFields: { carrierCredentials: '{nope' } });
	await assert.rejects(() => handleShippingMethod.call(bad, 'create', 0), /Invalid JSON/);
});

// ---------- 8. sales order consignment storage location ----------

// 1.4.2 restored the saved warehouse field and added a separate storage location field (see codex-round4 [r4-2]).
test('[r3-8] sales order sends commissionConsignmentStorageLocation', async () => {
	const ctx = context({ salesOrderId: '1', updateFields: { commissionConsignmentStorageLocationId: '12' } }, { response: { id: 1 } });
	await handleSalesOrder.call(ctx, 'update', 0);
	assert.deepEqual(ctx.calls[0].body.commissionConsignmentStorageLocation, { id: '12' });
	assert.equal(ctx.calls[0].body.commissionConsignmentWarehouse, undefined);
});
