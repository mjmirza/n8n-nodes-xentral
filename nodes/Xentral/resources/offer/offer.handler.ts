import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll, xentralFileUpload, assertSafeId, assertNonEmptyBody, applyLineItemPosition, applyLineItemHidden, sortOnlyLineItemUpdate, documentAddress, lineItemUpdatePrice, lineItemAddBody } from '../../transport';

/**
 * Build the nested body structure from flat n8n fields for document create/update.
 * Handles: editor, sales, project, preferredWarehouse, shippingMethod, paymentMethod,
 * financials, documentAddress, deviatingShipToAddress, tags.
 */
function buildOfferBody(fields: IDataObject): IDataObject {
	const body: IDataObject = {};

	// Simple string/date fields - pass through directly
	const directFields = [
		'bodyIntroduction', 'bodyOutroduction', 'costCenter', 'customerReference',
		'deliveryTerms', 'desiredDeliveryDate',
		'documentDate', 'internalComment', 'internalDesignation', 'language',
		'plannedOrderDate', 'validUntilDate', 'vatId',
	];
	for (const key of directFields) {
		if (fields[key] !== undefined && fields[key] !== '') {
			body[key] = fields[key];
		}
	}

	// Boolean fields that should pass through even when false
	const booleanFields = [
		'desiredDeliveryDateAsCalendarWeek', 'manualShippingCostApproval',
		'useAlternativeDocumentTitle',
	];
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
	if (fields.preferredWarehouseId) body.preferredWarehouse = { id: fields.preferredWarehouseId };
	if (fields.shippingMethodId) body.shippingMethod = { id: fields.shippingMethodId };

	// Sales: { id: "..." }
	if (fields.salesId) {
		body.sales = { id: fields.salesId };
	}

	// Financials: { currency: "EUR", tax: { taxation: "domestic" } }
	const financials: IDataObject = {};
	if (fields.currency) financials.currency = fields.currency;
	if (fields.taxation) financials.tax = { taxation: fields.taxation };
	if (fields.paymentMethodId) financials.paymentMethod = { id: fields.paymentMethodId };
	if (Object.keys(financials).length > 0) body.financials = financials;

	// Document address (fixedCollection)
	if (fields.documentAddress !== undefined) {
		const fc = fields.documentAddress as IDataObject;
		const addr = fc.address as IDataObject;
		if (addr) body.documentAddress = documentAddress(addr);
	}

	// Deviating ship-to address (fixedCollection)
	if (fields.deviatingShipToAddress !== undefined) {
		const fc = fields.deviatingShipToAddress as IDataObject;
		const addr = fc.address as IDataObject;
		// null clears the ship-to override, which the update schema allows.
		if (addr !== undefined) body.deviatingShipToAddress = documentAddress(addr);
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

	return body;
}

/**
 * Build nested line item body from flat n8n fields.
 */
function buildLineItemBody(fields: IDataObject, isAdd = false): IDataObject {
	const body: IDataObject = {};

	// String pass-through fields
	const stringFields = [
		'countryOfOrigin', 'customerProductNumber', 'deliveryDate',
		'description', 'hsCode', 'internalComment', 'name', 'number', 'taxLegalNotice',
	];
	for (const key of stringFields) {
		if (fields[key] !== undefined && fields[key] !== '') {
			body[key] = fields[key];
		}
	}
	// The field promises "empty to clear", so an empty delivery date on an update sends null.
	if (!isAdd && fields.deliveryDate === '') body.deliveryDate = null;

	// Numeric fields (can be 0, so check undefined only)
	if (fields.discount !== undefined) body.discount = fields.discount;
	if (fields.quantity !== undefined) body.quantity = fields.quantity;
	applyLineItemPosition(body, fields);

	// Boolean fields
	if (fields.deliveryDateAsCalendarWeek !== undefined) {
		body.deliveryDateAsCalendarWeek = fields.deliveryDateAsCalendarWeek;
	}

	// Boolean fields
	applyLineItemHidden(body, fields);

	// Product ref
	if (fields.productId) body.product = { id: fields.productId };

	// Price object: { net: { amount: X, currency: "EUR" } }
	if (isAdd) {
		if (fields.priceAmount !== undefined && fields.priceAmount !== '') {
			// A new line item defaults to EUR when no currency was set.
			body.price = { net: { amount: fields.priceAmount, currency: fields.priceCurrency || 'EUR' } };
		}
	} else {
		// An update sends what was set, so a currency-only change is kept.
		const price = lineItemUpdatePrice(fields);
		if (price) body.price = price;
	}

	return body;
}

export async function handleOffer(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		assertSafeId(customerId, 'customerId');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body = buildOfferBody(additionalFields);
		body.address = { id: customerId };

		return xentralRequest.call(this, 'POST', 'offers', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		return xentralRequest.call(this, 'GET', `offers/${offerId}`, {}, {}, 'v3');
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
		return xentralV3GetAll.call(this, 'offers', query, limit, maxPages);
	}

	if (operation === 'update') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		const body = buildOfferBody(updateFields);
		assertNonEmptyBody(body as IDataObject, 'offer update');
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'delete') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		return xentralRequest.call(this, 'DELETE', `offers/${offerId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
		const quantity = this.getNodeParameter('quantity', itemIndex) as number;
		const lineItemOptions = this.getNodeParameter('lineItemOptions', itemIndex, {}) as IDataObject;

		const body = buildLineItemBody(lineItemOptions, true);
		body.product = { id: productId };
		body.quantity = quantity;

		return xentralRequest.call(this, 'POST', `offers/${offerId}/lineItems`, lineItemAddBody(body as IDataObject), {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		const body = buildLineItemBody(updateFields);
		const sortOnly = sortOnlyLineItemUpdate(body, updateFields);
		if (sortOnly) return sortOnly;
		assertNonEmptyBody(body as IDataObject, 'offer line item update');
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/lineItems/${lineItemId}`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		return xentralRequest.call(this, 'DELETE', `offers/${offerId}/lineItems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'cancel') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/cancel`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'send') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/send`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		const activityMessage = this.getNodeParameter('activityMessage', itemIndex) as string;
		const body: IDataObject = { message: activityMessage };
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/logActivity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/setWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/removeWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
		return xentralFileUpload.call(this, `offers/${offerId}/files`, binaryPropertyName, itemIndex);
	}

	throw new Error(`Unknown offer operation: ${operation}`);
}
