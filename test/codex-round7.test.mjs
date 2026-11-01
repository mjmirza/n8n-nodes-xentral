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

// ---------- 7. pre-release review: webhook recovery, country, date clearing, Accept, GET body, beta ----------

const { handleCustomApiCall } = require('../dist/nodes/Xentral/resources/customApiCall/customApiCall.handler.js');
const { Xentral } = require('../dist/nodes/Xentral/Xentral.node.js');
const { HANDWRITTEN_BETA_OPERATIONS } = require('../dist/nodes/Xentral/resources/betaNotices.js');

function createContext(stored, deleteError, remoteUrl = 'https://n8n.example.com/webhook/x') {
	const calls = [];
	return {
		calls,
		getNodeWebhookUrl: () => 'https://n8n.example.com/webhook/x',
		getNodeParameter: (name, fallback) => (name === 'event' ? 'salesOrder.created' : name === 'signatureKey' ? '' : fallback),
		getWorkflowStaticData: () => stored,
		getNode: () => ({ name: 'Trigger' }),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		logger: { warn: () => {} },
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				if (options.method === 'DELETE' && deleteError) throw deleteError;
				if (options.method === 'GET') return { data: { id: '42', url: remoteUrl, events: [] } };
				return options.method === 'POST' ? { data: { id: 99 } } : {};
			},
		},
	};
}

test('[r7-7] create removes a webhook kept from a failed delete before registering a new one', async () => {
	const stored = { webhookId: '42', signatureKey: 'k'.repeat(32) };
	const ctx = createContext(stored);
	await new XentralTrigger().webhookMethods.default.create.call(ctx);
	assert.deepEqual(ctx.calls.map((c) => c.method), ['GET', 'DELETE', 'POST']);
	assert.ok(ctx.calls[1].url.endsWith('/webhooks/42'));
	assert.equal(stored.webhookId, 99);
	const gone = { webhookId: '42', signatureKey: 'k'.repeat(32) };
	const goneCtx = createContext(gone, httpError(404));
	await new XentralTrigger().webhookMethods.default.create.call(goneCtx);
	assert.equal(gone.webhookId, 99);
});

test('[r7-7] create refuses to add a second webhook when the kept one cannot be removed', async () => {
	const stored = { webhookId: '42', signatureKey: 'k'.repeat(32) };
	const ctx = createContext(stored, httpError(403));
	await assert.rejects(() => new XentralTrigger().webhookMethods.default.create.call(ctx), /could not be removed/);
	assert.equal(ctx.calls.some((c) => c.method === 'POST'), false);
	assert.equal(stored.webhookId, '42');
	const fresh = createContext({});
	await new XentralTrigger().webhookMethods.default.create.call(fresh);
	assert.deepEqual(fresh.calls.map((c) => c.method), ['POST']);
});

test('[r7-8] an empty address Country is left out, a set one must be a two-letter code', async () => {
	const pattern = new RegExp(docSpec.components.schemas.CreateDocumentAddressData.properties.country.pattern);
	const empty = context({ customerId: '4', additionalFields: { documentAddress: { address: { ...FILLED } } } });
	await handleOffer.call(empty, 'create', 0);
	assert.equal('country' in empty.calls[0].body.documentAddress, false);
	const set = context({ customerId: '4', additionalFields: { documentAddress: { address: { ...FILLED, country: ' de ' } } } });
	await handleOffer.call(set, 'create', 0);
	assert.ok(pattern.test(set.calls[0].body.documentAddress.country));
	const bad = context({ customerId: '4', additionalFields: { documentAddress: { address: { ...FILLED, country: 'Germany' } } } });
	await assert.rejects(() => handleOffer.call(bad, 'create', 0), /two-letter/);
});

test('[r7-9] Delivery Date: an empty value is ignored as in 1.4.4, an expression returning null clears it', async () => {
	const docs = LINE_ITEMS.filter(([h]) => [handleOffer, handleInvoice, handleCreditNote, handleProformaInvoice].includes(h));
	for (const [handler, ids, param] of docs) {
		const empty = context({ ...ids, lineItemId: '2', [param]: { deliveryDate: '', quantity: 1 } });
		await handler.call(empty, 'updateLineItem', 0);
		assert.equal('deliveryDate' in empty.calls[0].body, false, handler.name);
		const cleared = context({ ...ids, lineItemId: '2', [param]: { deliveryDate: null } });
		await handler.call(cleared, 'updateLineItem', 0);
		assert.equal(cleared.calls[0].body.deliveryDate, null, handler.name);
	}
	for (const [handler, idParam] of [[handleInvoice, 'invoiceId'], [handleProformaInvoice, 'proformaInvoiceId']]) {
		const empty = context({ [idParam]: '1', updateFields: { deliveryDate: '', vatId: 'DE1' } });
		await handler.call(empty, 'update', 0);
		assert.equal('deliveryDate' in empty.calls[0].body, false, handler.name);
		const cleared = context({ [idParam]: '1', updateFields: { deliveryDate: null } });
		await handler.call(cleared, 'update', 0);
		assert.equal(cleared.calls[0].body.deliveryDate, null, handler.name);
	}
});

function apiCallContext(params) {
	const calls = [];
	return {
		calls,
		getNode: () => ({ name: 'Xentral', typeVersion: 2, parameters: {} }),
		getNodeParameter: (name, _i, fallback) => (name in params ? params[name] : fallback),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		continueOnFail: () => false,
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				return { statusCode: 200, headers: { 'content-type': 'application/pdf' }, body: Buffer.from('%PDF') };
			},
			prepareBinaryData: async (buffer, fileName, mimeType) => ({ data: buffer.toString('base64'), fileName, mimeType }),
		},
	};
}

test('[r7-10] Custom API Call sends the Accept header it is given, so File mode can fetch a PDF', async () => {
	const ctx = apiCallContext({ method: 'GET', apiVersion: 'v3', path: 'invoices/5', responseFormat: 'file', accept: 'application/pdf' });
	await handleCustomApiCall.call(ctx, 'request', 0);
	assert.equal(ctx.calls[0].headers.Accept, 'application/pdf');
	const plain = apiCallContext({ method: 'GET', apiVersion: 'v3', path: 'invoices/5', responseFormat: 'file' });
	await handleCustomApiCall.call(plain, 'request', 0);
	assert.equal(plain.calls[0].headers.Accept, '*/*');
	const bad = apiCallContext({ method: 'GET', path: 'invoices/5', accept: 'pdf; drop' });
	await assert.rejects(() => handleCustomApiCall.call(bad, 'request', 0), /Invalid accept type/);
});

test('[r7-11] Custom API Call never reads or sends a GET body, which the n8n HTTP helper drops', async () => {
	const saved = apiCallContext({ method: 'GET', apiVersion: 'v1', path: 'products/5', body: 'not json' });
	await handleCustomApiCall.call(saved, 'request', 0);
	assert.equal('body' in saved.calls[0], false);
	const props = new Xentral().description.properties;
	const bodyField = props.find((p) => p.name === 'body' && p.displayOptions?.show?.resource?.includes('customApiCall'));
	assert.equal(bodyField.displayOptions.show.method.includes('GET'), false);
	assert.equal(props.some((p) => p.name === 'getBody'), false);
	const readme = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
	assert.match(readme, /never sends a body with GET/);
});

test('[r7-12] every hand-written operation on a Xentral beta endpoint shows the beta notice', async () => {
	const props = new Xentral().description.properties;
	const beta = [];
	for (const spec of [docSpec, v1Spec]) {
		for (const [p, ops] of Object.entries(spec.paths)) {
			for (const [m, o] of Object.entries(ops)) {
				if (o && o['x-beta']) beta.push([m.toUpperCase(), new RegExp(`^${p.replace(/\{[^}]+\}/g, '[^/]+')}$`)]);
			}
		}
	}
	const found = {};
	for (const resource of Object.keys(HANDWRITTEN_BETA_OPERATIONS).concat(['offer', 'salesOrder', 'creditNote', 'purchaseOrder', 'product', 'customer', 'supplier', 'salesPrice', 'shipment'])) {
		const opProp = props.find((p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes(resource));
		const handler = Object.values(require(`../dist/nodes/Xentral/resources/${resource}/${resource}.handler.js`)).find((v) => typeof v === 'function' && v.name.startsWith('handle'));
		for (const { value: op } of opProp.options) {
			const ctx = context({ returnAll: false, limit: 1, updateFields: { description: 'x', quantity: 1 }, lineItemUpdateFields: { description: 'x', quantity: 1 } }, { response: { data: [], id: 1 } });
			ctx.getNodeParameter = (name, _i, fallback) => {
				if (name === 'returnAll') return false;
				if (name === 'limit') return 1;
				if (/Fields$/.test(name)) return { description: 'x', quantity: 1, internalComment: 'x' };
				return fallback !== undefined ? fallback : '1';
			};
			ctx.getInputData = () => [{ json: {} }];
			try {
				await handler.call(ctx, op, 0);
			} catch {
				// Some operations need richer input; the request made before any failure still counts.
			}
			for (const call of ctx.calls) {
				const path = new URL(call.url).pathname;
				if (beta.some(([m, re]) => m === call.method && re.test(path))) (found[resource] ??= new Set()).add(op);
			}
		}
	}
	for (const [resource, ops] of Object.entries(found)) {
		const notice = props.find((p) => p.name === 'betaNotice' && p.displayOptions?.show?.resource?.[0] === resource);
		assert.ok(notice, `${resource} has no beta notice`);
		for (const op of ops) assert.ok(notice.displayOptions.show.operation.includes(op), `${resource}.${op}`);
	}
	assert.ok(found.proformaInvoice?.has('getAll') && found.production?.has('create'));
});

// ---------- 8. second pre-release review ----------

const { handleLiability } = require('../dist/nodes/Xentral/resources/liability/liability.handler.js');

test('[r7-13] a matching webhook that cannot be replaced stops activation instead of adding a second one', async () => {
	const stored = {};
	const calls = [];
	const ctx = {
		getNodeWebhookUrl: () => 'https://n8n.example.com/webhook/x',
		getNodeParameter: (name, fallback) => (name === 'event' ? 'salesOrder.created' : fallback),
		getWorkflowStaticData: () => stored,
		getNode: () => ({ name: 'Trigger' }),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		logger: { warn: () => {} },
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				if (options.method === 'GET') return { data: [{ id: '77', url: 'https://n8n.example.com/webhook/x', events: [{ id: 'com.xentral.salesOrder.created.v1' }] }] };
				throw httpError(403);
			},
		},
	};
	await assert.rejects(() => new XentralTrigger().webhookMethods.default.checkExists.call(ctx), /could not be replaced/);
	assert.deepEqual(calls.map((c) => c.method), ['GET', 'DELETE']);
});

test('[r7-14] Age Rating None clears the rating only with Clear Empty Fields, otherwise it is dropped as in 1.4.4', async () => {
	const legacy = context({ productId: '5', updateFields: { ageRating: '', name: 'Neu' } });
	await handleProduct.call(legacy, 'update', 0);
	assert.equal('ageRating' in legacy.calls[0].body, false);
	const only = context({ productId: '5', updateFields: { ageRating: '', clearEmptyFields: true } });
	await handleProduct.call(only, 'update', 0);
	assert.equal(only.calls[0].body.ageRating, '');
	assert.ok(JSON.stringify(v1Spec).match(/"ageRating":\{[^}]*"enum":\["",/), 'the spec lists the empty rating');
	const set = context({ productId: '5', updateFields: { ageRating: '16' } });
	await handleProduct.call(set, 'update', 0);
	assert.equal(set.calls[0].body.ageRating, '16');
});

test('[r7-15] the liability status offers only values Xentral accepts, a saved Cancelled still fails clearly', async () => {
	const { Xentral } = require('../dist/nodes/Xentral/Xentral.node.js');
	const status = new Xentral().description.properties
		.find((p) => p.name === 'additionalFields' && p.displayOptions?.show?.resource?.includes('liability'))
		.options.find((o) => o.name === 'status');
	assert.deepEqual(status.options.map((o) => o.value).sort(), ['PAID', 'PARTIALLY_PAID', 'PENDING']);
	const saved = context({ supplierId: '3', additionalFields: { status: 'CANCELLED' } });
	await assert.rejects(() => handleLiability.call(saved, 'create', 0), /open or paid/);
});

test('[r7-16] product option examples match the schema, plain text option values become {name}', async () => {
	const { Xentral } = require('../dist/nodes/Xentral/Xentral.node.js');
	const props = new Xentral().description.properties.filter((p) => p.displayOptions?.show?.resource?.includes('product'));
	const descriptions = props.flatMap((p) => (p.options ?? []).map((o) => `${o.name}: ${o.description ?? ''}`));
	const free = descriptions.filter((x) => x.startsWith('freeFields'));
	assert.equal(free.length, 2);
	for (const d of free) assert.match(d, /free field ID and its value/);
	const ctx = context({ productId: '5', updateFields: { options: '[{"name":"Color","values":["Red",{"name":"Blue","sort":2}]}]' } });
	await handleProduct.call(ctx, 'update', 0);
	assert.deepEqual(ctx.calls[0].body.options, [{ name: 'Color', values: [{ name: 'Red' }, { name: 'Blue', sort: 2 }] }]);
});

test('[r7-17] a stored webhook that now points elsewhere is never deleted, on activation or deactivation', async () => {
	const stored = { webhookId: '42', signatureKey: 'k'.repeat(32) };
	const ctx = createContext(stored, undefined, 'https://other.example.com/hook');
	await new XentralTrigger().webhookMethods.default.create.call(ctx);
	assert.deepEqual(ctx.calls.map((c) => c.method), ['GET', 'POST']);
	const off = { webhookId: '42', signatureKey: 'k'.repeat(32) };
	const offCtx = createContext(off, undefined, 'https://other.example.com/hook');
	assert.equal(await new XentralTrigger().webhookMethods.default.delete.call(offCtx), true);
	assert.deepEqual(offCtx.calls.map((c) => c.method), ['GET']);
	assert.equal('webhookId' in off, false);
});

test('[r7-18] an explicit null Country or Type in an address update is still sent to clear it', async () => {
	const ctx = context({ invoiceId: '1', updateFields: { documentAddress: { address: { name: 'ACME', country: null, type: null } } } });
	await handleInvoice.call(ctx, 'update', 0);
	assert.deepEqual(ctx.calls[0].body.documentAddress, { name: 'ACME', country: null, type: null });
});

test('[r7-17] deactivation deletes the stored webhook when it still points at this node', async () => {
	const stored = { webhookId: '42', signatureKey: 'k'.repeat(32) };
	const ctx = createContext(stored);
	assert.equal(await new XentralTrigger().webhookMethods.default.delete.call(ctx), true);
	assert.deepEqual(ctx.calls.map((c) => c.method), ['GET', 'DELETE']);
	assert.equal('webhookId' in stored, false);
});

// ---------- 9. third pre-release review ----------

const { handlePurchasePrice } = require('../dist/nodes/Xentral/resources/purchasePrice/purchasePrice.handler.js');
const { handleSalesPrice } = require('../dist/nodes/Xentral/resources/salesPrice/salesPrice.handler.js');
const transport7 = require('../dist/nodes/Xentral/transport.js');
const { createHmac } = require('node:crypto');

test('[r7-19] line item updates never send product or product number, which the V3 schemas do not accept', async () => {
	for (const [handler, ids, param] of LINE_ITEMS) {
		const mixed = context({ ...ids, lineItemId: '2', [param]: { productId: '8', number: 'SKU-1', quantity: 2 } });
		await handler.call(mixed, 'updateLineItem', 0);
		assert.equal('product' in mixed.calls[0].body, false, handler.name);
		assert.equal('number' in mixed.calls[0].body, false, handler.name);
		assert.equal(mixed.calls[0].body.quantity, 2);
		const only = context({ ...ids, lineItemId: '2', [param]: { productId: '8' } });
		const result = await handler.call(only, 'updateLineItem', 0);
		assert.equal(only.calls.length, 0, handler.name);
		assert.equal(result.changed, false);
		assert.match(result.message, /Product ID/);
	}
	const props = docSpec.components.schemas.UpdateProductLineItemData.properties;
	assert.equal('product' in props || 'number' in props, false);
});

test('[r7-20] line item adds never send a product number, which the V3 create schemas do not accept', async () => {
	const adds = [
		[handleOffer, { offerId: '1' }], [handleInvoice, { invoiceId: '1' }], [handleCreditNote, { creditNoteId: '1' }],
		[handleSalesOrder, { salesOrderId: '1' }], [handlePurchaseOrder, { purchaseOrderId: '1' }],
		[handleProformaInvoice, { proformaInvoiceId: '1' }], [handleDeliveryNote, { deliveryNoteId: '1' }], [handleReturn, { returnId: '1' }],
	];
	for (const [handler, ids] of adds) {
		const ctx = context({ ...ids, productId: '5', quantity: 1, lineItemOptions: { number: 'SKU-1' }, additionalFields: { number: 'SKU-1' } });
		await handler.call(ctx, 'addLineItem', 0);
		assert.equal('number' in ctx.calls[0].body, false, handler.name);
		assert.deepEqual(ctx.calls[0].body.product, { id: '5' });
	}
});

test('[r7-21] a null validity date clears it on purchase and sales prices', async () => {
	const purchase = context({ purchasePriceId: '1', updateFields: { expiresAt: null, validFrom: null } });
	await handlePurchasePrice.call(purchase, 'update', 0);
	assert.equal(purchase.calls[0].body.expiresAt, null);
	assert.equal(purchase.calls[0].body.validFrom, null);
	const sales = context({ salesPriceId: '1', updateFields: { expiresAt: null } });
	await handleSalesPrice.call(sales, 'update', 0);
	assert.equal(sales.calls[0].body.expiresAt, null);
	const empty = context({ salesPriceId: '1', updateFields: { expiresAt: '', remark: 'x' } });
	await handleSalesPrice.call(empty, 'update', 0);
	assert.equal('expiresAt' in empty.calls[0].body, false);
});

test('[r7-22] the trigger starts the workflow only for its own event type', async () => {
	const key = 'k'.repeat(32);
	const run = async (type) => {
		const body = JSON.stringify(type === undefined ? { id: 1 } : { type, body: { id: 1 } });
		const ts = String(Math.floor(Date.now() / 1000));
		const sent = {};
		const ctx = {
			getRequestObject: () => ({ rawBody: Buffer.from(body) }),
			getBodyData: () => JSON.parse(body),
			getHeaderData: () => ({ 'xentral-signature': createHmac('sha256', key).update(body + ts).digest('hex'), 'xentral-request-timestamp': ts }),
			getNodeParameter: (name, fallback) => (name === 'event' ? 'salesOrder.created' : name === 'signatureKey' ? '' : fallback),
			getWorkflowStaticData: () => ({ signatureKey: key }),
			getResponseObject: () => ({ status: (code) => ({ send: (msg) => { sent.code = code; sent.msg = msg; } }) }),
			helpers: { returnJsonArray: (b) => [{ json: b }] },
		};
		return { result: await new XentralTrigger().webhook.call(ctx), sent };
	};
	const other = await run('com.xentral.customer.deleted.v1');
	assert.equal(other.result.workflowData, undefined);
	assert.equal(other.sent.code, 200);
	assert.ok((await run('com.xentral.salesOrder.created.v1')).result.workflowData);
	assert.ok((await run(undefined)).result.workflowData);
});

test('[r7-23] nested validation errors keep their field path', async () => {
	const ctx = context({});
	ctx.helpers.httpRequest = async () => {
		throw Object.assign(new Error('422'), { response: { status: 422, data: { title: 'Invalid', violations: { positions: [{ price: ['Must be non-negative'] }], _: ['General'] } } } });
	};
	await assert.rejects(
		() => transport7.xentralRequest.call(ctx, 'POST', 'salesOrders', { a: 1 }, {}, 'v3'),
		(error) => /positions\.0\.price: Must be non-negative/.test(`${error.message} ${error.description}`) && /General/.test(`${error.message} ${error.description}`),
	);
});

// ---------- 10. fourth pre-release review ----------

test('[r7-24] a webhook stored with its instance is deleted there even after the n8n URL changed, and never on another instance', async () => {
	const same = { webhookId: '42', signatureKey: 'k'.repeat(32), webhookInstance: 'https://acme.xentral.com' };
	const moved = createContext(same, undefined, 'https://old-n8n.example.com/webhook/x');
	assert.equal(await new XentralTrigger().webhookMethods.default.delete.call(moved), true);
	assert.deepEqual(moved.calls.map((c) => c.method), ['DELETE']);
	assert.equal('webhookInstance' in same, false);
	const other = { webhookId: '42', signatureKey: 'k'.repeat(32), webhookInstance: 'https://other.xentral.com' };
	const otherCtx = createContext(other);
	assert.equal(await new XentralTrigger().webhookMethods.default.delete.call(otherCtx), true);
	assert.equal(otherCtx.calls.length, 0);
	const created = {};
	await new XentralTrigger().webhookMethods.default.create.call(createContext(created));
	assert.equal(created.webhookInstance, 'https://acme.xentral.com');
});

test('[r7-25] a null address override still clears it, as in 1.4.4', async () => {
	const ctx = context({ salesOrderId: '1', updateFields: { deviatingShipToAddress: { address: null } } });
	await handleSalesOrder.call(ctx, 'update', 0);
	assert.equal(ctx.calls[0].body.deviatingShipToAddress, null);
	assert.ok('deviatingShipToAddress' in ctx.calls[0].body);
});

test('[r7-26] product update clears empty text fields only with Clear Empty Fields, and drops them as in 1.4.4 otherwise', async () => {
	const legacy = context({ productId: '5', updateFields: { name: 'New', ean: '', countryOfOrigin: '', description: '' } });
	await handleProduct.call(legacy, 'update', 0);
	assert.deepEqual(Object.keys(legacy.calls[0].body), ['name']);
	const only = context({ productId: '5', updateFields: { description: '', clearEmptyFields: true } });
	await handleProduct.call(only, 'update', 0);
	assert.deepEqual(only.calls[0].body, { description: '' });
	const mixed = context({ productId: '5', updateFields: { name: 'New', description: '', ean: '', countryOfOrigin: '', clearEmptyFields: true } });
	await handleProduct.call(mixed, 'update', 0);
	assert.deepEqual(mixed.calls[0].body, { name: 'New', description: '', ean: '', countryOfOrigin: null });
	const create = context({ name: 'Widget', projectId: '1', additionalFields: { description: '' } });
	await handleProduct.call(create, 'create', 0);
	assert.equal('description' in create.calls[0].body, false);
});

// ---------- 11. fifth pre-release review ----------

test('[r7-27] a pre-1.4.5 stored webhook is deleted only when it points at this node URL', async () => {
	const stored = { webhookId: '42', signatureKey: 'k'.repeat(32) };
	const calls = [];
	const ctx = {
		getNodeWebhookUrl: () => 'https://n8n.example.com/webhook/x',
		getNodeParameter: (name, fallback) => (name === 'event' ? 'salesOrder.created' : fallback),
		getWorkflowStaticData: () => stored,
		getNode: () => ({ name: 'Trigger' }),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		logger: { warn: () => {} },
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				return { data: { id: '42', name: 'n8n-salesOrder.created', url: 'https://n8n.example.com/webhook/other-workflow', events: [{ id: 'com.xentral.salesOrder.created.v1' }] } };
			},
		},
	};
	assert.equal(await new XentralTrigger().webhookMethods.default.delete.call(ctx), true);
	assert.deepEqual(calls.map((c) => c.method), ['GET']);
});

test('[r7-28] a webhook with the stored ID on another instance is not adopted with the old key', async () => {
	const stored = { webhookId: '77', signatureKey: 'o'.repeat(32), webhookInstance: 'https://old.xentral.com' };
	const calls = [];
	const ctx = {
		getNodeWebhookUrl: () => 'https://n8n.example.com/webhook/x',
		getNodeParameter: (name, fallback) => (name === 'event' ? 'salesOrder.created' : fallback),
		getWorkflowStaticData: () => stored,
		getNode: () => ({ name: 'Trigger' }),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		logger: { warn: () => {} },
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				if (options.method === 'GET') return { data: [{ id: '77', url: 'https://n8n.example.com/webhook/x', events: [{ id: 'com.xentral.salesOrder.created.v1' }] }] };
				return {};
			},
		},
	};
	assert.equal(await new XentralTrigger().webhookMethods.default.checkExists.call(ctx), false);
	assert.ok(calls.some((c) => c.method === 'DELETE' && c.url.endsWith('/webhooks/77')));
	assert.equal('signatureKey' in stored, false);
});

test('[r7-29] an Offer update with a null ship-to override clears it', async () => {
	const ctx = context({ offerId: '1', updateFields: { deviatingShipToAddress: { address: null } } });
	await handleOffer.call(ctx, 'update', 0);
	assert.equal(ctx.calls[0].body.deviatingShipToAddress, null);
});

// ---------- 12. sixth pre-release review ----------

test('[r7-30] with several registrations for this URL and event, the owned one is adopted and the rest removed', async () => {
	const stored = { webhookId: '2', signatureKey: 'k'.repeat(32), webhookInstance: 'https://acme.xentral.com' };
	const calls = [];
	const ctx = {
		getNodeWebhookUrl: () => 'https://n8n.example.com/webhook/x',
		getNodeParameter: (name, fallback) => (name === 'event' ? 'salesOrder.created' : fallback),
		getWorkflowStaticData: () => stored,
		getNode: () => ({ name: 'Trigger' }),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		logger: { warn: () => {} },
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				if (options.method === 'GET') {
					const hook = (id) => ({ id, url: 'https://n8n.example.com/webhook/x', events: [{ id: 'com.xentral.salesOrder.created.v1' }] });
					return { data: [hook('1'), hook('2')] };
				}
				return {};
			},
		},
	};
	assert.equal(await new XentralTrigger().webhookMethods.default.checkExists.call(ctx), true);
	assert.deepEqual(calls.filter((c) => c.method === 'DELETE').map((c) => c.url.split('/').pop()), ['1']);
	assert.equal(stored.webhookId, '2');
	assert.equal(stored.signatureKey, 'k'.repeat(32));
});

test('[r7-31] the Sent filter on Sales Order and Return uses isDocumentSent, which their status enum lacks', async () => {
	for (const handler of [handleSalesOrder, handleReturn]) {
		const ctx = context({ returnAll: false, limit: 5, filters: { status: 'sent' } }, { response: { data: [] } });
		await handler.call(ctx, 'getAll', 0);
		assert.equal(ctx.calls[0].qs['filter[0][key]'], 'isDocumentSent', handler.name);
		assert.equal(ctx.calls[0].qs['filter[0][value]'], 'true');
		const released = context({ returnAll: false, limit: 5, filters: { status: 'released' } }, { response: { data: [] } });
		await handler.call(released, 'getAll', 0);
		assert.equal(released.calls[0].qs['filter[0][key]'], 'status');
	}
});

// ---------- 13. seventh pre-release review ----------

test('[r7-32] Return Create From Delivery Note checks the line item shape Xentral requires before the request', async () => {
	const ok = context({ deliveryNoteId: '3', lineItemsJson: '[{"id":"15","quantity":2,"returnReason":{"id":"7"}}]' });
	await handleReturn.call(ok, 'createFromDeliveryNote', 0);
	assert.deepEqual(ok.calls[0].body.lineItems, [{ id: '15', quantity: 2, returnReason: { id: '7' } }]);
	for (const bad of ['[]', '[{"product":{"id":"5"},"quantity":1}]', '[{"id":"15","quantity":1}]']) {
		const ctx = context({ deliveryNoteId: '3', lineItemsJson: bad });
		await assert.rejects(() => handleReturn.call(ctx, 'createFromDeliveryNote', 0), /returnReason/, bad);
		assert.equal(ctx.calls.length, 0);
	}
	const item = docSpec.components.schemas.ReturnLineItemInput;
	assert.deepEqual(item.required, ['id', 'quantity', 'returnReason']);
});

// ---------- 14. eighth pre-release review ----------

test('[r7-33] Custom API Call Full Response keeps cursors and meta in one item, off keeps the 1.4.4 split', async () => {
	const response = { data: [{ id: 1 }, { id: 2 }], extra: { cursor: { nextCursor: 'abc' } } };
	const run = async (fullResponse) => {
		const params = { resource: 'customApiCall', operation: 'request', method: 'GET', apiVersion: 'v1', path: 'customers', responseFormat: 'json' };
		if (fullResponse !== undefined) params.fullResponse = fullResponse;
		const ctx = {
			getNode: () => ({ name: 'Xentral', typeVersion: 2, parameters: {} }),
			getNodeParameter: (name, _i, fallback) => (name in params ? params[name] : fallback),
			getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
			getInputData: () => [{ json: {} }],
			continueOnFail: () => false,
			helpers: { httpRequest: async () => response },
		};
		return (await new Xentral().execute.call(ctx))[0];
	};
	const full = await run(true);
	assert.equal(full.length, 1);
	assert.equal(full[0].json.extra.cursor.nextCursor, 'abc');
	assert.equal((await run(undefined)).length, 2);
});

test('[r7-34] with a configured signing key, a failed webhook listing stops activation instead of risking a duplicate', async () => {
	const make = (signatureKey) => ({
		getNodeWebhookUrl: () => 'https://n8n.example.com/webhook/x',
		getNodeParameter: (name, fallback) => (name === 'event' ? 'salesOrder.created' : name === 'signatureKey' ? signatureKey : fallback),
		getWorkflowStaticData: () => ({}),
		getNode: () => ({ name: 'Trigger' }),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		logger: { warn: () => {} },
		helpers: { httpRequest: async () => { throw httpError(403); } },
	});
	await assert.rejects(() => new XentralTrigger().webhookMethods.default.checkExists.call(make('m'.repeat(32))), /could not be listed/);
	assert.equal(await new XentralTrigger().webhookMethods.default.checkExists.call(make('')), false);
});

// ---------- 15. ninth pre-release review ----------

const { handleCustomer } = require('../dist/nodes/Xentral/resources/customer/customer.handler.js');

function adoptContext(stored, patchError) {
	const calls = [];
	return {
		calls,
		getNodeWebhookUrl: () => 'https://n8n.example.com/webhook/x',
		getNodeParameter: (name, fallback) => (name === 'event' ? 'salesOrder.created' : name === 'signatureKey' ? '' : fallback),
		getWorkflowStaticData: () => stored,
		getNode: () => ({ name: 'Trigger' }),
		getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
		logger: { warn: () => {} },
		helpers: {
			httpRequest: async (options) => {
				calls.push(options);
				if (options.method === 'GET') return { data: [{ id: '77', name: 'n8n-salesOrder.created', url: 'https://n8n.example.com/webhook/x', events: [{ id: 'com.xentral.salesOrder.created.v1' }] }] };
				if (options.method === 'PATCH' && patchError) throw patchError;
				return {};
			},
		},
	};
}

test('[r7-35] adopting a pre-1.4.5 registration writes the stored key to it, so deliveries verify on any tenant', async () => {
	const stored = { webhookId: '77', signatureKey: 'o'.repeat(32) };
	const ctx = adoptContext(stored);
	assert.equal(await new XentralTrigger().webhookMethods.default.checkExists.call(ctx), true);
	const patch = ctx.calls.find((c) => c.method === 'PATCH');
	assert.equal(patch.body.signatureKey, 'o'.repeat(32));
	assert.deepEqual(Object.keys(patch.body).sort(), ['events', 'name', 'signatureKey', 'url']);
	assert.equal(stored.webhookInstance, 'https://acme.xentral.com');
	const failing = { webhookId: '77', signatureKey: 'o'.repeat(32) };
	const failCtx = adoptContext(failing, httpError(403));
	assert.equal(await new XentralTrigger().webhookMethods.default.checkExists.call(failCtx), false);
	assert.ok(failCtx.calls.some((c) => c.method === 'DELETE'));
	assert.equal('signatureKey' in failing, false);
	const current = { webhookId: '77', signatureKey: 'o'.repeat(32), webhookInstance: 'https://acme.xentral.com' };
	const currentCtx = adoptContext(current);
	assert.equal(await new XentralTrigger().webhookMethods.default.checkExists.call(currentCtx), true);
	assert.equal(currentCtx.calls.some((c) => c.method === 'PATCH'), false);
});

test('[r7-36] JSON fields accept an expression that already resolved to an object or array', async () => {
	const product = context({ productId: '5', updateFields: { freeFields: [{ id: '1', value: 'Blue' }], options: [{ name: 'Color', values: ['Red'] }], selectedOptions: [{ id: '3' }] } });
	await handleProduct.call(product, 'update', 0);
	assert.deepEqual(product.calls[0].body.freeFields, [{ id: '1', value: 'Blue' }]);
	assert.deepEqual(product.calls[0].body.options, [{ name: 'Color', values: [{ name: 'Red' }] }]);
	assert.deepEqual(product.calls[0].body.selectedOptions, [{ id: '3' }]);
	const text = context({ productId: '5', updateFields: { freeFields: '[{"id":"1","value":"Blue"}]' } });
	await handleProduct.call(text, 'update', 0);
	assert.deepEqual(text.calls[0].body.freeFields, [{ id: '1', value: 'Blue' }]);
	const customer = context({ customerId: '4', updateFields: { customFields: [{ id: '2', value: 'x' }], additionalContactData: { skype: 'a' } } });
	await handleCustomer.call(customer, 'update', 0);
	const body = customer.calls.find((c) => c.method === 'PATCH').body;
	assert.deepEqual(body.customFields, [{ id: '2', value: 'x' }]);
	assert.deepEqual(body.contactDetails.additionalData, { skype: 'a' });
	const invoice = context({ invoiceId: '1', updateFields: { dunningSettingsJson: { level: 1 } } });
	await handleInvoice.call(invoice, 'update', 0);
	assert.deepEqual(invoice.calls[0].body.dunningSettings, { level: 1 });
});

// ---------- 16. tenth pre-release review ----------

test('[r7-37] Report Execute Query Full Response keeps meta.totalResults, off keeps the 1.4.4 split', async () => {
	const response = { data: { header: ['a'], rows: [[1]] }, meta: { totalResults: 20000 } };
	const run = async (fullResponse) => {
		const params = { resource: 'report', operation: 'executeQuery', reportId: '42', body: '{}', queryParameters: '{}' };
		if (fullResponse !== undefined) params.fullResponse = fullResponse;
		const calls = [];
		const ctx = {
			getNode: () => ({ name: 'Xentral', typeVersion: 2, parameters: {} }),
			getNodeParameter: (name, _i, fallback) => (name in params ? params[name] : fallback),
			getCredentials: async () => ({ instanceUrl: 'acme.xentral.com', accessToken: '2|token' }),
			getInputData: () => [{ json: {} }],
			continueOnFail: () => false,
			helpers: { httpRequest: async (o) => { calls.push(o); return response; } },
		};
		const out = (await new Xentral().execute.call(ctx))[0];
		assert.ok(calls[0].url.endsWith('/v1/analytics/report/42/query'));
		return out;
	};
	const full = await run(true);
	assert.equal(full[0].json.meta.totalResults, 20000);
	const plain = await run(undefined);
	assert.equal(plain[0].json.meta, undefined);
	const field = new Xentral().description.properties.find((p) => p.name === 'fullResponse' && p.displayOptions?.show?.resource?.includes('report'));
	assert.ok(field.displayOptions.show.operation.includes('executeQuery'));
});
