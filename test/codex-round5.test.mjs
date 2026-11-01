import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

// Regression tests for the fifth Codex review (v1.4.2). Each block names the finding it pins.
const require = createRequire(import.meta.url);
const transport = require('../dist/nodes/Xentral/transport.js');
const { Xentral } = require('../dist/nodes/Xentral/Xentral.node.js');
const { handlePurchasePrice } = require('../dist/nodes/Xentral/resources/purchasePrice/purchasePrice.handler.js');
const { handleSalesPrice } = require('../dist/nodes/Xentral/resources/salesPrice/salesPrice.handler.js');
const { handleTag } = require('../dist/nodes/Xentral/resources/tag/tag.handler.js');
const { handleSalesOrder } = require('../dist/nodes/Xentral/resources/salesOrder/salesOrder.handler.js');
const { handleDeliveryNote } = require('../dist/nodes/Xentral/resources/deliveryNote/deliveryNote.handler.js');
const { handlePurchaseOrder } = require('../dist/nodes/Xentral/resources/purchaseOrder/purchaseOrder.handler.js');
const { handleReturn } = require('../dist/nodes/Xentral/resources/return/return.handler.js');
const { handleAddress } = require('../dist/nodes/Xentral/resources/address/address.handler.js');

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

// ---------- 1. redirects are never followed ----------

test('[r5-1] requests disable redirect following', async () => {
	const ctx = context({}, { response: { data: [] } });
	await transport.xentralRequest.call(ctx, 'GET', 'salesOrders', {}, {}, 'v1');
	assert.equal(ctx.calls[0].disableFollowRedirect, true);
	assert.equal(ctx.calls[0].maxRedirects, 0);
});

test('[r5-1] a 3xx answer is an error that names the Location, thrown or returned', async () => {
	const thrown = new Error('Request failed with status code 302');
	thrown.response = { status: 302, headers: { location: 'http://127.0.0.1:8080/private' }, data: '' };
	const a = context({}, { response: () => { throw thrown; } });
	await assert.rejects(() => transport.xentralRequest.call(a, 'GET', 'salesOrders', {}, {}, 'v1'), /redirect.*http:\/\/127\.0\.0\.1:8080\/private/i);
	assert.equal(a.calls.length, 1);
	const b = context({}, { response: { statusCode: 301, headers: { location: 'https://elsewhere.example/x' }, body: '' } });
	await assert.rejects(() => transport.xentralRequest.call(b, 'GET', 'salesOrders', {}, {}, 'v1'), /redirect.*https:\/\/elsewhere\.example\/x/i);
});

// ---------- 2. price updates never default the currency ----------

test('[r5-2] an amount-only price update does not send a currency', async () => {
	const pp = context({ purchasePriceId: '3', updateFields: { priceAmount: 12.34 } }, { response: { id: 1 } });
	await handlePurchasePrice.call(pp, 'update', 0);
	assert.deepEqual(pp.calls[0].body.price, { amount: 12.34 });
	const sp = context({ salesPriceId: '4', updateFields: { priceAmount: 9.5 } }, { response: { id: 1 } });
	await handleSalesPrice.call(sp, 'update', 0);
	assert.deepEqual(sp.calls[0].body.price, { amount: 9.5 });
	const create = context({ productId: '5', additionalFields: { priceAmount: 9.5 } }, { response: { id: 1 } });
	await handleSalesPrice.call(create, 'create', 0);
	assert.deepEqual(create.calls[0].body.price, { amount: 9.5, currency: 'EUR' });
});

// ---------- 4. tags paginate ----------

test('[r5-4] Tag Get Many pages through the list', async () => {
	const ctx = context({ returnAll: true }, {
		response: (o) => ({ data: Array.from({ length: Number(o.qs['page[number]']) === 1 ? 50 : 3 }, (_, i) => ({ id: `${o.qs['page[number]']}-${i}` })) }),
	});
	const rows = await handleTag.call(ctx, 'getAll', 0);
	assert.equal(rows.length, 53);
	assert.equal(ctx.calls.length, 2);
	assert.equal(ctx.calls[0].qs['page[size]'], 50);
	const limited = context({ returnAll: false, limit: 70 }, {
		response: (o) => ({ data: Array.from({ length: 50 }, (_, i) => ({ id: `${o.qs['page[number]']}-${i}` })) }),
	});
	assert.equal((await handleTag.call(limited, 'getAll', 0)).length, 70);
});

// ---------- 5. document dates are YYYY-MM-DD ----------

test('[r5-5] sales order, delivery note and purchase order dates are sent as YYYY-MM-DD', async () => {
	const ts = '2026-11-01T00:00:00.000Z';
	const so = context({ salesOrderId: '1', updateFields: { documentDate: ts, desiredDeliveryDate: ts } }, { response: { id: 1 } });
	await handleSalesOrder.call(so, 'update', 0);
	assert.equal(so.calls[0].body.documentDate, '2026-11-01');
	const dn = context({ deliveryNoteId: '1', updateFields: { documentDate: ts } }, { response: { id: 1 } });
	await handleDeliveryNote.call(dn, 'update', 0);
	assert.equal(dn.calls[0].body.documentDate, '2026-11-01');
	const po = context({ purchaseOrderId: '1', updateFields: { documentDate: ts, confirmedDeliveryDate: ts, desiredDeliveryDate: ts } }, { response: { id: 1 } });
	await handlePurchaseOrder.call(po, 'update', 0);
	assert.equal(po.calls[0].body.documentDate, '2026-11-01');
	assert.equal(po.calls[0].body.confirmedDeliveryDate, '2026-11-01');
	assert.equal(po.calls[0].body.desiredDeliveryDate, '2026-11-01');
	const li = context({ salesOrderId: '1', lineItemId: '2', lineItemUpdateFields: { deliveryDate: ts } }, { response: { id: 1 } });
	await handleSalesOrder.call(li, 'updateLineItem', 0);
	assert.equal(li.calls[0].body.deliveryDate, '2026-11-01');
});

// ---------- 6. return reason ----------

test('[r5-6] return reason is sent as an object with an id, whatever form was saved', async () => {
	for (const [saved, sent] of [['2', { id: '2' }], [2, { id: '2' }], ['{"id":"7"}', { id: '7' }], ['{"id":9}', { id: '9' }]]) {
		const ctx = context({ returnId: '1', lineItemId: '2', updateFields: { returnReason: saved } }, { response: { id: 1 } });
		await handleReturn.call(ctx, 'updateLineItem', 0);
		assert.deepEqual(ctx.calls[0].body.returnReason, sent, String(saved));
	}
	const add = context({ returnId: '1', productId: '5', quantity: 1, lineItemOptions: { returnReason: '3' } }, { response: { id: 1 } });
	await handleReturn.call(add, 'addLineItem', 0);
	assert.deepEqual(add.calls[0].body.returnReason, { id: '3' });
});

// ---------- 7 and 8. addresses ----------

test('[r5-7] address update never sends type', async () => {
	const ctx = context({ customerId: '4', addressId: '6', updateFields: { type: 'billingaddress', city: 'Berlin' } }, { response: { id: 1 } });
	await handleAddress.call(ctx, 'update', 0);
	assert.equal(ctx.calls[0].body.type, undefined);
	assert.equal(ctx.calls[0].body.city, 'Berlin');
});

test('[r5-8] address create works without a ZIP code', async () => {
	const ctx = context({ customerId: '4', name: 'Acme', street: 'Sheikh Zayed Rd', city: 'Dubai', zip: '', country: 'AE', type: 'deliveryaddress', additionalFields: {} }, { response: { id: 1 } });
	await handleAddress.call(ctx, 'create', 0);
	assert.equal(ctx.calls[0].body.zip, undefined);
	const zipField = new Xentral().description.properties.find((p) => p.name === 'zip' && p.displayOptions?.show?.resource?.includes('address'));
	assert.notEqual(zipField.required, true);
});

// ---------- 9. tag colour ----------

test('[r5-9] tag colour is normalised to #RRGGBB', async () => {
	for (const [saved, sent] of [['ff0000', '#ff0000'], ['#00FF00', '#00FF00'], [' 0000ff ', '#0000ff']]) {
		const ctx = context({ title: 'x', type: 'product', additionalFields: { color: saved } }, { response: { id: 1 } });
		await handleTag.call(ctx, 'create', 0);
		assert.equal(ctx.calls[0].body.color, sent, saved);
	}
	const field = new Xentral().description.properties.flatMap((p) => p.options || []).find((o) => o.name === 'color' && typeof o.description === 'string' && /hex/i.test(o.description));
	assert.doesNotMatch(field.description, /without the #/);
});
