import type { INode, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll, xentralFileUpload, assertSafeId, assertNonEmptyBody, applyLineItemPosition, applyLineItemHidden, sortOnlyLineItemUpdate } from '../../transport';

/**
 * Build the nested body structure from flat n8n fields for invoice create/update.
 */
function buildInvoiceBody(node: INode, fields: IDataObject): IDataObject {
	const body: IDataObject = {};

	// Simple string/date fields - pass through directly
	const directFields = [
		'bodyIntroduction', 'bodyOutroduction', 'costCenter', 'customerOrderNumber',
		'deliveryDate', 'deliveryTerms', 'deviatingDebtorAccountNumber',
		'documentDate', 'internalComment', 'internalDesignation', 'language',
		'masterReferenceNumber', 'useAlternativeDocumentTitle', 'vatId',
	];
	for (const key of directFields) {
		if (fields[key] !== undefined && fields[key] !== '') {
			body[key] = fields[key];
		}
	}

	// Boolean fields that should pass through even when false
	const booleanFields = ['useAlternativeDocumentTitle', 'dunningSetManually'];
	for (const key of booleanFields) {
		if (fields[key] !== undefined) {
			body[key] = fields[key];
		}
	}

	// Nested object refs: wrap as { id: "..." }
	if (fields.editorId) body.editor = { id: fields.editorId };
	if (fields.projectId !== undefined) {
		body.project = fields.projectId === '' ? null : { id: fields.projectId };
	}

	// Sales: { id: "..." }
	if (fields.salesId) {
		body.sales = { id: fields.salesId };
	}

	// Financials: { currency: "EUR", tax: { taxation: "domestic" } }
	const financials: IDataObject = {};
	if (fields.currency) financials.currency = fields.currency;
	if (fields.taxation) financials.tax = { taxation: fields.taxation };
	if (Object.keys(financials).length > 0) body.financials = financials;

	// Document address (fixedCollection)
	if (fields.documentAddress !== undefined) {
		const fc = fields.documentAddress as IDataObject;
		const addr = fc.address as IDataObject;
		if (addr) body.documentAddress = addr;
	}

	// Tags: comma-separated string to array
	if (fields.tags !== undefined && fields.tags !== '') {
		body.tags = (fields.tags as string).split(',').map((t: string) => t.trim()).filter((t: string) => t !== '').map((t: string) => ({ title: t }));
	}

	// Print settings (fixedCollection)
	if (fields.printSettings !== undefined) {
		const ps = (fields.printSettings as IDataObject).settings as IDataObject;
		if (ps !== undefined) body.printSettings = ps;
	}

	// Dunning settings (complex objects passed as JSON strings)
	if (fields.dunningManualSettingsJson !== undefined && fields.dunningManualSettingsJson !== '') {
		const raw = fields.dunningManualSettingsJson as string;
		if (raw === 'null') {
			body.dunningManualSettings = null;
		} else {
			try {
				body.dunningManualSettings = JSON.parse(raw);
			} catch {
				throw new NodeOperationError(node, 'Invalid JSON in dunningManualSettings. Please provide valid JSON.');
			}
		}
	}
	if (fields.dunningSettingsJson !== undefined && fields.dunningSettingsJson !== '') {
		try {
			body.dunningSettings = JSON.parse(fields.dunningSettingsJson as string);
		} catch {
			throw new NodeOperationError(node, 'Invalid JSON in dunningSettings. Please provide valid JSON.');
		}
	}

	return body;
}

/**
 * Build nested line item body from flat n8n fields.
 */
function buildLineItemBody(fields: IDataObject, isAdd = false): IDataObject {
	const body: IDataObject = {};

	// Direct pass-through fields
	const directFields = [
		'countryOfOrigin', 'customerProductNumber', 'deliveryDate',
		'description', 'hsCode', 'internalComment', 'name', 'number', 'taxLegalNotice',
	];
	for (const key of directFields) {
		if (fields[key] !== undefined && fields[key] !== '') {
			body[key] = fields[key];
		}
	}

	// Boolean field
	if (fields.deliveryDateAsCalendarWeek !== undefined) {
		body.deliveryDateAsCalendarWeek = fields.deliveryDateAsCalendarWeek;
	}

	// Numeric fields that can be 0
	if (fields.discount !== undefined) body.discount = fields.discount;
	if (fields.quantity !== undefined) body.quantity = fields.quantity;
	applyLineItemPosition(body, fields);

	// Boolean fields
	applyLineItemHidden(body, fields);

	// Product ref
	if (fields.productId) body.product = { id: fields.productId };

	// Price object: { net: { amount: X, currency: "EUR" } }
	if (fields.priceAmount !== undefined && fields.priceAmount !== '') {
		const net: IDataObject = { amount: fields.priceAmount };
		// An update only changes the currency when it was set; a new line item defaults to EUR.
		if (fields.priceCurrency) net.currency = fields.priceCurrency;
		else if (isAdd) net.currency = 'EUR';
		body.price = { net };
	}

	return body;
}

export async function handleInvoice(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		assertSafeId(customerId, 'customerId');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body = buildInvoiceBody(this.getNode(), additionalFields);
		body.address = { id: customerId };

		return xentralRequest.call(this, 'POST', 'invoices', body as IDataObject, {}, 'v3');
	}

	if (operation === 'createFromSalesOrder') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		const body: IDataObject = {
			salesOrder: { id: salesOrderId },
		};
		return xentralRequest.call(this, 'POST', 'invoices/actions/createFromSalesOrder', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		assertSafeId(invoiceId, 'invoiceId');
		return xentralRequest.call(this, 'GET', `invoices/${invoiceId}`, {}, {}, 'v3');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const query: IDataObject = {};
		let filterIndex = 0;
		if (filters.status !== undefined && filters.status !== '') {
			query[`filter[${filterIndex}][key]`] = 'status';
			query[`filter[${filterIndex}][op]`] = 'equals';
			query[`filter[${filterIndex}][value]`] = filters.status;
			filterIndex++;
		}
		if (filters.customerId !== undefined && filters.customerId !== '') {
			query[`filter[${filterIndex}][key]`] = 'address.id';
			query[`filter[${filterIndex}][op]`] = 'equals';
			query[`filter[${filterIndex}][value]`] = filters.customerId;
			filterIndex++;
		}
		if (filters.createdAfter !== undefined && filters.createdAfter !== '') {
			query[`filter[${filterIndex}][key]`] = 'createdAt';
			query[`filter[${filterIndex}][op]`] = 'greaterThanOrEquals';
			query[`filter[${filterIndex}][value]`] = filters.createdAfter;
			filterIndex++;
		}
		return xentralV3GetAll.call(this, 'invoices', query, limit, maxPages);
	}

	if (operation === 'update') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		assertSafeId(invoiceId, 'invoiceId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		const body = buildInvoiceBody(this.getNode(), updateFields);
		assertNonEmptyBody(body as IDataObject, 'invoice update');
		return xentralRequest.call(this, 'PATCH', `invoices/${invoiceId}`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'delete') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		assertSafeId(invoiceId, 'invoiceId');
		return xentralRequest.call(this, 'DELETE', `invoices/${invoiceId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		assertSafeId(invoiceId, 'invoiceId');
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
		const quantity = this.getNodeParameter('quantity', itemIndex) as number;
		const lineItemOptions = this.getNodeParameter('lineItemOptions', itemIndex, {}) as IDataObject;

		const body = buildLineItemBody(lineItemOptions, true);
		body.product = { id: productId };
		body.quantity = quantity;

		return xentralRequest.call(this, 'POST', `invoices/${invoiceId}/lineItems`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		assertSafeId(invoiceId, 'invoiceId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		const body = buildLineItemBody(updateFields);
		const sortOnly = sortOnlyLineItemUpdate(body, updateFields);
		if (sortOnly) return sortOnly;
		assertNonEmptyBody(body as IDataObject, 'invoice line item update');
		return xentralRequest.call(this, 'PATCH', `invoices/${invoiceId}/lineItems/${lineItemId}`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		assertSafeId(invoiceId, 'invoiceId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		return xentralRequest.call(this, 'DELETE', `invoices/${invoiceId}/lineItems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		assertSafeId(invoiceId, 'invoiceId');
		return xentralRequest.call(this, 'PATCH', `invoices/${invoiceId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'send') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		assertSafeId(invoiceId, 'invoiceId');
		return xentralRequest.call(this, 'PATCH', `invoices/${invoiceId}/actions/send`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		assertSafeId(invoiceId, 'invoiceId');
		const activityMessage = this.getNodeParameter('activityMessage', itemIndex) as string;
		const body: IDataObject = { message: activityMessage };
		return xentralRequest.call(this, 'PATCH', `invoices/${invoiceId}/actions/logActivity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		assertSafeId(invoiceId, 'invoiceId');
		return xentralRequest.call(this, 'PATCH', `invoices/${invoiceId}/actions/setWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		assertSafeId(invoiceId, 'invoiceId');
		return xentralRequest.call(this, 'PATCH', `invoices/${invoiceId}/actions/removeWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		assertSafeId(invoiceId, 'invoiceId');
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
		return xentralFileUpload.call(this, `invoices/${invoiceId}/files`, binaryPropertyName, itemIndex);
	}

	throw new Error(`Unknown invoice operation: ${operation}`);
}
