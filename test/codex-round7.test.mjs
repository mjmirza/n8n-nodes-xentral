import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

// Regression tests for the seventh Codex review (v1.4.4). Each block names the finding it pins.
const require = createRequire(import.meta.url);
const { XentralTrigger } = require('../dist/nodes/Xentral/XentralTrigger.node.js');
const { handleOffer } = require('../dist/nodes/Xentral/resources/offer/offer.handler.js');
const { handleSalesOrder } = require('../dist/nodes/Xentral/resources/salesOrder/salesOrder.handler.js');
const { handleInvoice } = require('../dist/nodes/Xentral/resources/invoice/invoice.handler.js');
const { handleCreditNote } = require('../dist/nodes/Xentral/resources/creditNote/creditNote.handler.js');
const { handleDeliveryNote } = require('../dist/nodes/Xentral/resources/deliveryNote/deliveryNote.handler.js');
const { handleProformaInvoice } = require('../dist/nodes/Xentral/resources/proformaInvoice/proformaInvoice.handler.js');
const { handlePurchaseOrder } = require('../dist/nodes/Xentral/resources/purchaseOrder/purchaseOrder.handler.js');
const { handleReturn } = require('../dist/nodes/Xentral/resources/return/return.handler.js');
const { handleProduct } = require('../dist/nodes/Xentral/resources/product/product.handler.js');

const docSpec = JSON.parse(fs.readFileSync(new URL('../specs/xentral-documents-api.openapi-3.1.0.json', import.meta.url)));
const v1Spec = JSON.parse(fs.readFileSync(new URL('../specs/xentral-api.openapi-3.0.0.json', import.meta.url)));

function context(params, { response = { id: 1 } } = {}) {
	const calls = [];
	return {
		calls,
		getNode: () => ({ name: 'Xentral', type: 'n8n-nodes-xentral.xentral', typeVersion: 2, parameters: {} }),
		getNodeParameter: (name, _i, fallback) => (name in params ? params[name] : fallback),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		continueOnFail: () => false,
		helpers: { httpRequest: async (options) => { calls.push(options); return response; } },
	};
}

// ---------- 1. an empty address Type is not sent ----------

// The fields n8n fills in for an address override with only a name, every other value at its default.
const FILLED = { name: 'ACME', street: '', zipCode: '', city: '', country: '', email: '', type: '' };

const DOCUMENTS = [
	[handleOffer, 'customerId', 'offerId', ['documentAddress', 'deviatingShipToAddress']],
	[handleInvoice, 'customerId', 'invoiceId', ['documentAddress']],
	[handleCreditNote, 'customerId', 'creditNoteId', ['documentAddress']],
	[handleDeliveryNote, 'customerId', 'deliveryNoteId', ['documentAddress']],
	[handlePurchaseOrder, 'supplierId', 'purchaseOrderId', ['documentAddress']],
	[handleSalesOrder, 'customerId', 'salesOrderId', ['documentAddress', 'deviatingShipToAddress']],
	[handleProformaInvoice, 'customerId', 'proformaInvoiceId', ['documentAddress']],
	[handleReturn, 'customerId', 'returnId', ['documentAddress']],
];

const allowedTypes = docSpec.components.schemas.CreateDocumentAddressData.properties.type.enum;

test('[r7-1] address overrides never send an empty Type on any document, create or update', async () => {
	for (const [handler, ownerParam, idParam, collections] of DOCUMENTS) {
		for (const field of collections) {
			const fields = { [field]: { address: { ...FILLED } } };
			const create = context({ [ownerParam]: '4', additionalFields: fields });
			await handler.call(create, 'create', 0);
			const created = create.calls[0].body[field];
			assert.equal('type' in created, false, `${handler.name} create ${field}`);
			assert.equal(created.name, 'ACME');
			const update = context({ [idParam]: '9', updateFields: { [field]: { address: { ...FILLED } } } });
			await handler.call(update, 'update', 0);
			const updated = update.calls.find((c) => c.method === 'PATCH').body[field];
			assert.equal('type' in updated, false, `${handler.name} update ${field}`);
		}
	}
});

test('[r7-1] a set address Type is sent in the schema form, an unknown one is rejected before the request', async () => {
	const ok = context({ customerId: '4', additionalFields: { documentAddress: { address: { ...FILLED, type: ' Company ' } } } });
	await handleSalesOrder.call(ok, 'create', 0);
	assert.equal(ok.calls[0].body.documentAddress.type, 'company');
	assert.ok(allowedTypes.includes(ok.calls[0].body.documentAddress.type));
	const bad = context({ customerId: '4', additionalFields: { documentAddress: { address: { ...FILLED, type: 'Herr' } } } });
	await assert.rejects(() => handleInvoice.call(bad, 'create', 0), /mrs, mr, company, other/);
	assert.equal(bad.calls.length, 0);
});

// ---------- 2. proforma invoices honour Created After ----------

test('[r7-2] proforma invoice getAll sends Created After as createdAt greaterThanOrEquals', async () => {
	const ctx = context({ returnAll: false, limit: 5, filters: { createdAfter: '2026-01-01T00:00:00' } }, { response: { data: [] } });
	await handleProformaInvoice.call(ctx, 'getAll', 0);
	const qs = ctx.calls[0].qs;
	assert.equal(qs['filter[0][key]'], 'createdAt');
	assert.equal(qs['filter[0][op]'], 'greaterThanOrEquals');
	assert.equal(qs['filter[0][value]'], '2026-01-01T00:00:00');
	const both = context({ returnAll: false, limit: 5, filters: { customerId: '7', createdAfter: '2026-01-01' } }, { response: { data: [] } });
	await handleProformaInvoice.call(both, 'getAll', 0);
	assert.equal(both.calls[0].qs['filter[0][key]'], 'address.id');
	assert.equal(both.calls[0].qs['filter[1][key]'], 'createdAt');
});

// ---------- 3. a currency-only line item update is sent ----------

const LINE_ITEMS = [
	[handleOffer, { offerId: '1' }, 'updateFields'],
	[handleInvoice, { invoiceId: '1' }, 'updateFields'],
	[handleCreditNote, { creditNoteId: '1' }, 'updateFields'],
	[handleSalesOrder, { salesOrderId: '1' }, 'lineItemUpdateFields'],
	[handlePurchaseOrder, { purchaseOrderId: '1' }, 'lineItemUpdateFields'],
	[handleProformaInvoice, { proformaInvoiceId: '1' }, 'updateFields'],
];

test('[r7-3] a line item update that only sets the currency sends it, alone or with other fields', async () => {
	for (const [handler, ids, param] of LINE_ITEMS) {
		const only = context({ ...ids, lineItemId: '2', [param]: { priceCurrency: 'USD' } });
		await handler.call(only, 'updateLineItem', 0);
		assert.deepEqual(only.calls[0].body.price, { net: { currency: 'USD' } }, `${handler.name} currency only`);
		const mixed = context({ ...ids, lineItemId: '2', [param]: { priceCurrency: 'USD', quantity: 3 } });
		await handler.call(mixed, 'updateLineItem', 0);
		assert.deepEqual(mixed.calls[0].body.price, { net: { currency: 'USD' } }, `${handler.name} with quantity`);
		assert.equal(mixed.calls[0].body.quantity, 3);
		const amount = context({ ...ids, lineItemId: '2', [param]: { priceAmount: 15 } });
		await handler.call(amount, 'updateLineItem', 0);
		assert.deepEqual(amount.calls[0].body.price, { net: { amount: 15 } }, `${handler.name} amount only`);
	}
});

// ---------- 4. the calculated purchase price amount is a string ----------

test('[r7-4] product create and update send the calculated purchase price amount as a string', async () => {
	const update = context({ productId: '5', updateFields: { calculatedPurchasePriceAmount: 13.37, calculatedPurchasePriceCurrency: 'eur' } });
	await handleProduct.call(update, 'update', 0);
	const patch = update.calls.find((c) => c.method === 'PATCH');
	assert.deepEqual(patch.body.calculatedPurchasePrice.price, { amount: '13.37', currency: 'EUR' });
	const create = context({ name: 'Widget', projectId: '1', additionalFields: { calculatedPurchasePriceAmount: 0 } });
	await handleProduct.call(create, 'create', 0);
	assert.equal(create.calls[0].body.calculatedPurchasePrice.price.amount, '0');
	// The schema the request targets declares amount as a string.
	const text = JSON.stringify(v1Spec);
	assert.ok(text.includes('"description":"A string representing the amount","type":"string"'));
});

// ---------- 5. a failed webhook delete keeps the state for a retry ----------

function hookContext(stored, deleteError) {
	const calls = [];
	return {
		calls,
		getNodeWebhookUrl: () => 'https://n8n.example.com/webhook/x',
		getNodeParameter: (name, fallback) => (name === 'event' ? 'salesOrder.created' : fallback),
		getWorkflowStaticData: () => stored,
		getNode: () => ({ name: 'Trigger' }),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		logger: { warn: () => {} },
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				if (deleteError) throw deleteError;
				return {};
			},
		},
	};
}

function httpError(status) {
	return Object.assign(new Error(`HTTP ${status}`), { response: { status, data: { title: 'no' } } });
}

test('[r7-5] a 403 on webhook delete keeps the registration ID and signing key', async () => {
	const stored = { webhookId: '42', signatureKey: 'k'.repeat(32) };
	const ctx = hookContext(stored, httpError(403));
	const result = await new XentralTrigger().webhookMethods.default.delete.call(ctx);
	assert.equal(result, false);
	assert.equal(stored.webhookId, '42');
	assert.equal(stored.signatureKey, 'k'.repeat(32));
});

test('[r7-5] a webhook that is already gone, or deleted, clears the stored state', async () => {
	for (const error of [httpError(404), httpError(410), undefined]) {
		const stored = { webhookId: 42, signatureKey: 'k'.repeat(32) };
		const ctx = hookContext(stored, error);
		const result = await new XentralTrigger().webhookMethods.default.delete.call(ctx);
		assert.equal(result, true);
		assert.equal('webhookId' in stored, false);
		assert.equal('signatureKey' in stored, false);
		assert.ok(ctx.calls[0].url.endsWith('/webhooks/42'));
	}
});

// ---------- 6. the scanner gates publication ----------

test('[r7-6] publish scans the packed tarball before npm publish, and CI runs the same preflight', () => {
	const publish = fs.readFileSync(new URL('../.github/workflows/publish.yml', import.meta.url), 'utf8');
	const preflight = publish.indexOf('scripts/scan-preflight.sh "$TARBALL"');
	const npmPublish = publish.indexOf('npm publish --provenance --access public "$TARBALL"');
	assert.ok(preflight > 0, 'preflight step present');
	assert.ok(npmPublish > preflight, 'npm publish runs after the preflight and publishes the scanned tarball');
	assert.ok(publish.indexOf('scan-published.sh') > npmPublish, 'post-publish provenance scan kept');
	const ci = fs.readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
	assert.ok(ci.includes('scripts/scan-preflight.sh'), 'CI runs the preflight');
	const script = fs.readFileSync(new URL('../scripts/scan-preflight.mjs', import.meta.url), 'utf8');
	assert.ok(script.includes('SOURCE_FILE_PATTERNS') && script.includes("'**/*.js', 'package.json'"));
});
