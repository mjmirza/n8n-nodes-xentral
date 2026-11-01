import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

// Regression tests for the sixth Codex review (v1.4.3). Each block names the finding it pins.
const require = createRequire(import.meta.url);
const { XentralApi } = require('../dist/credentials/XentralApi.credentials.js');
const { handleOffer } = require('../dist/nodes/Xentral/resources/offer/offer.handler.js');
const { handleSalesOrder } = require('../dist/nodes/Xentral/resources/salesOrder/salesOrder.handler.js');
const { handleInvoice } = require('../dist/nodes/Xentral/resources/invoice/invoice.handler.js');
const { handleCreditNote } = require('../dist/nodes/Xentral/resources/creditNote/creditNote.handler.js');
const { handleProformaInvoice } = require('../dist/nodes/Xentral/resources/proformaInvoice/proformaInvoice.handler.js');
const { handlePurchaseOrder } = require('../dist/nodes/Xentral/resources/purchaseOrder/purchaseOrder.handler.js');
const { handleReturn } = require('../dist/nodes/Xentral/resources/return/return.handler.js');
const { handleCustomer } = require('../dist/nodes/Xentral/resources/customer/customer.handler.js');
const { handlePurchasePrice } = require('../dist/nodes/Xentral/resources/purchasePrice/purchasePrice.handler.js');
const { handleSalesPrice } = require('../dist/nodes/Xentral/resources/salesPrice/salesPrice.handler.js');

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

// ---------- 1. the credential test never follows a redirect ----------

test('[r6-1] the credential test request disables redirect following', () => {
	const request = new XentralApi().test.request;
	assert.equal(request.disableFollowRedirect, true);
	assert.equal(request.maxRedirects, 0);
});

// ---------- 2. line item updates keep the currency unless it was set ----------

test('[r6-2] an amount-only line item update sends no currency, an add still defaults to EUR', async () => {
	const cases = [
		[handleOffer, { offerId: '1', lineItemId: '2', updateFields: { priceAmount: 15 } }],
		[handleInvoice, { invoiceId: '1', lineItemId: '2', updateFields: { priceAmount: 15 } }],
		[handleCreditNote, { creditNoteId: '1', lineItemId: '2', updateFields: { priceAmount: 15 } }],
		[handleSalesOrder, { salesOrderId: '1', lineItemId: '2', lineItemUpdateFields: { priceAmount: 15 } }],
		[handlePurchaseOrder, { purchaseOrderId: '1', lineItemId: '2', lineItemUpdateFields: { priceAmount: 15 } }],
		[handleProformaInvoice, { proformaInvoiceId: '1', lineItemId: '2', updateFields: { priceAmount: 15 } }],
	];
	for (const [handler, params] of cases) {
		const ctx = context(params);
		await handler.call(ctx, 'updateLineItem', 0);
		assert.deepEqual(ctx.calls[0].body.price, { net: { amount: 15 } }, handler.name);
	}
	const set = context({ offerId: '1', lineItemId: '2', updateFields: { priceAmount: 15, priceCurrency: 'USD' } });
	await handleOffer.call(set, 'updateLineItem', 0);
	assert.deepEqual(set.calls[0].body.price, { net: { amount: 15, currency: 'USD' } });
	const add = context({ offerId: '1', productId: '5', quantity: 1, lineItemOptions: { priceAmount: 15 } });
	await handleOffer.call(add, 'addLineItem', 0);
	assert.deepEqual(add.calls[0].body.price, { net: { amount: 15, currency: 'EUR' } });
});

// ---------- 3. a saved null return reason clears it again ----------

test('[r6-3] Return Reason "null" sends JSON null and an empty value sends nothing, as in 1.4.2', async () => {
	const cleared = context({ returnId: '1', lineItemId: '2', updateFields: { returnReason: 'null', quantity: 1 } });
	await handleReturn.call(cleared, 'updateLineItem', 0);
	assert.equal(cleared.calls[0].body.returnReason, null);
	assert.ok('returnReason' in cleared.calls[0].body);
	const empty = context({ returnId: '1', lineItemId: '2', updateFields: { returnReason: '', quantity: 1 } });
	await handleReturn.call(empty, 'updateLineItem', 0);
	assert.equal('returnReason' in empty.calls[0].body, false);
	const id = context({ returnId: '1', lineItemId: '2', updateFields: { returnReason: '4' } });
	await handleReturn.call(id, 'updateLineItem', 0);
	assert.deepEqual(id.calls[0].body.returnReason, { id: '4' });
});

// ---------- 4. customer payment and SEPA flags are booleans ----------

test('[r6-4] fixed payment terms and SEPA flags are sent as JSON booleans', async () => {
	const ctx = context({ salutation: 'company', name: 'Acme', additionalFields: { fixedPaymentTerms: 'false', sepaCompanySepa: 'true', sepaInitial: 'FALSE', sepaMandateReferenceChange: true } });
	await handleCustomer.call(ctx, 'create', 0);
	const body = ctx.calls[0].body;
	assert.equal(body.financials.paymentTerms.fixedPaymentTerms, false);
	assert.equal(body.primaryBankAccount.sepa.companySepa, true);
	assert.equal(body.primaryBankAccount.sepa.initial, false);
	assert.equal(body.primaryBankAccount.sepa.mandateReferenceChange, true);
	const upd = context({ customerId: '9', updateFields: { fixedPaymentTerms: 'true' } });
	await handleCustomer.call(upd, 'update', 0);
	assert.equal(upd.calls[0].body.financials.paymentTerms.fixedPaymentTerms, true);
});

// ---------- 5. price amounts follow the schema type ----------

test('[r6-5] price amounts are strings where the schema says string, numbers where it says number', async () => {
	const ppCreate = context({ productId: '5', supplierId: '6', fromQuantity: 1, priceAmount: 13.37, priceCurrency: 'EUR' });
	await handlePurchasePrice.call(ppCreate, 'create', 0);
	assert.equal(ppCreate.calls[0].body.price.amount, '13.37');
	const ppUpdate = context({ purchasePriceId: '3', updateFields: { priceAmount: 13.37 } });
	await handlePurchasePrice.call(ppUpdate, 'update', 0);
	assert.equal(ppUpdate.calls[0].body.price.amount, 13.37);
	const spCreate = context({ productId: '5', additionalFields: { priceAmount: 9.5 } });
	await handleSalesPrice.call(spCreate, 'create', 0);
	assert.equal(spCreate.calls[0].body.price.amount, '9.5');
	const spUpdate = context({ salesPriceId: '4', updateFields: { priceAmount: 9.5 } });
	await handleSalesPrice.call(spUpdate, 'update', 0);
	assert.equal(spUpdate.calls[0].body.price.amount, '9.5');
});

// ---------- 6. the release workflow runs the n8n scanner ----------

const script = path.resolve('scripts/scan-published.sh');

function runScan(fakeNpmVersion, version, extraEnv = {}) {
	const bin = fs.mkdtempSync(path.join(os.tmpdir(), 'scan-'));
	const log = path.join(bin, 'calls.log');
	fs.writeFileSync(path.join(bin, 'npm'), `#!/bin/bash\necho "npm $*" >> "${log}"\necho "${fakeNpmVersion}"\n`, { mode: 0o755 });
	// The real scanner exits 0 even when checks fail, so the script must read its verdict line.
	fs.writeFileSync(path.join(bin, 'npx'), `#!/bin/bash\necho "npx $*" >> "${log}"\nif [ -n "\${FAKE_SCAN_FAILED_OUTPUT:-}" ]; then echo "Package x has failed security checks"; else echo "Package x has passed all security checks"; fi\nexit "\${FAKE_SCAN_EXIT:-0}"\n`, { mode: 0o755 });
	const result = spawnSync('bash', ['-e', script, 'n8n-nodes-xentral', version], {
		env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, SCAN_WAIT_ATTEMPTS: '2', SCAN_WAIT_SECONDS: '0', ...extraEnv },
		encoding: 'utf8',
	});
	const calls = fs.existsSync(log) ? fs.readFileSync(log, 'utf8') : '';
	return { status: result.status, calls };
}

test('[r6-6] publish.yml runs the scanner script on Node 22 after publishing', () => {
	const yml = fs.readFileSync('.github/workflows/publish.yml', 'utf8');
	const publishAt = yml.indexOf('npm publish --provenance');
	const scanAt = yml.indexOf('scripts/scan-published.sh');
	assert.ok(publishAt > 0 && scanAt > publishAt);
	assert.match(yml.slice(publishAt), /node-version: 22/);
});

test('[r6-6] the scanner script scans once the version is live, and fails when the scan fails or never appears', () => {
	const ok = runScan('1.4.4', '1.4.4');
	assert.equal(ok.status, 0);
	assert.match(ok.calls, /npx .*@n8n\/scan-community-package@0\.41\.1 n8n-nodes-xentral/);
	assert.equal(runScan('1.4.4', '1.4.4', { FAKE_SCAN_EXIT: '1' }).status, 1);
	assert.equal(runScan('1.4.4', '1.4.4', { FAKE_SCAN_FAILED_OUTPUT: '1' }).status, 1);
	const late = runScan('1.4.3', '1.4.4');
	assert.notEqual(late.status, 0);
	assert.doesNotMatch(late.calls, /npx/);
});
