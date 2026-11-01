import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll, xentralFileUpload, assertSafeId, assertNonEmptyBody, applyLineItemPosition, applyLineItemHidden, sortOnlyLineItemUpdate, apiDates } from '../../transport';

export async function handlePurchaseOrder(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		assertSafeId(supplierId, 'supplierId');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			address: { id: supplierId },
		};

		// Simple string/date fields
		if (additionalFields.bodyIntroduction !== undefined) body.bodyIntroduction = additionalFields.bodyIntroduction;
		if (additionalFields.bodyOutroduction !== undefined) body.bodyOutroduction = additionalFields.bodyOutroduction;
		if (additionalFields.confirmationType !== undefined) body.confirmationType = additionalFields.confirmationType || null;
		if (additionalFields.confirmedDeliveryDate !== undefined) body.confirmedDeliveryDate = additionalFields.confirmedDeliveryDate || null;
		if (additionalFields.costCenter !== undefined) body.costCenter = additionalFields.costCenter;
		if (additionalFields.deliveryTerms !== undefined) body.deliveryTerms = additionalFields.deliveryTerms;
		if (additionalFields.desiredDeliveryDate !== undefined) body.desiredDeliveryDate = additionalFields.desiredDeliveryDate || null;
		if (additionalFields.documentDate !== undefined) body.documentDate = additionalFields.documentDate;
		if (additionalFields.internalComment !== undefined) body.internalComment = additionalFields.internalComment;
		if (additionalFields.internalDesignation !== undefined) body.internalDesignation = additionalFields.internalDesignation;
		if (additionalFields.language !== undefined) body.language = additionalFields.language;
		if (additionalFields.useAlternativeDocumentTitle !== undefined) body.useAlternativeDocumentTitle = additionalFields.useAlternativeDocumentTitle;
		if (additionalFields.vatId !== undefined) body.vatId = additionalFields.vatId;

		// Object-wrapped ID references
		if (additionalFields.editorId) body.editor = { id: additionalFields.editorId };
		if (additionalFields.projectId) body.project = { id: additionalFields.projectId };

		// Financials
		const financials: IDataObject = {};
		if (additionalFields.currency !== undefined) financials.currency = additionalFields.currency;
		if (additionalFields.taxation !== undefined) financials.tax = { taxation: additionalFields.taxation };
		if (Object.keys(financials).length > 0) body.financials = financials;

		// Tags
		if (additionalFields.tags !== undefined && (additionalFields.tags as string).trim() !== '') {
			body.tags = (additionalFields.tags as string).split(',').map((t: string) => t.trim()).filter((t: string) => t !== '').map((t: string) => ({ title: t }));
		}

		// Fixed collections (address objects)
		if (additionalFields.documentAddress !== undefined) {
			const addr = (additionalFields.documentAddress as IDataObject).address as IDataObject;
			if (addr !== undefined) body.documentAddress = addr;
		}

		// Print settings (fixedCollection)
		if (additionalFields.printSettings !== undefined) {
			const ps = (additionalFields.printSettings as IDataObject).settings as IDataObject;
			if (ps !== undefined) body.printSettings = ps;
		}

		return xentralRequest.call(this, 'POST', 'purchaseOrders', apiDates(body as IDataObject), {}, 'v3');
	}

	if (operation === 'get') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		return xentralRequest.call(this, 'GET', `purchaseOrders/${purchaseOrderId}`, {}, {}, 'v3');
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
		if (filters.createdAfter !== undefined && filters.createdAfter !== '') {
			query[`filter[${filterIndex}][key]`] = 'createdAt';
			query[`filter[${filterIndex}][op]`] = 'greaterThanOrEquals';
			query[`filter[${filterIndex}][value]`] = filters.createdAfter;
			filterIndex++;
		}
		return xentralV3GetAll.call(this, 'purchaseOrders', query, limit, maxPages);
	}

	if (operation === 'update') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		// Simple string/date fields
		if (updateFields.bodyIntroduction !== undefined) body.bodyIntroduction = updateFields.bodyIntroduction;
		if (updateFields.bodyOutroduction !== undefined) body.bodyOutroduction = updateFields.bodyOutroduction;
		if (updateFields.confirmationType !== undefined) body.confirmationType = updateFields.confirmationType || null;
		if (updateFields.confirmedDeliveryDate !== undefined) body.confirmedDeliveryDate = updateFields.confirmedDeliveryDate || null;
		if (updateFields.costCenter !== undefined) body.costCenter = updateFields.costCenter;
		if (updateFields.deliveryTerms !== undefined) body.deliveryTerms = updateFields.deliveryTerms;
		if (updateFields.desiredDeliveryDate !== undefined) body.desiredDeliveryDate = updateFields.desiredDeliveryDate || null;
		if (updateFields.documentDate !== undefined) body.documentDate = updateFields.documentDate;
		if (updateFields.internalComment !== undefined) body.internalComment = updateFields.internalComment;
		if (updateFields.internalDesignation !== undefined) body.internalDesignation = updateFields.internalDesignation;
		if (updateFields.language !== undefined) body.language = updateFields.language;
		if (updateFields.useAlternativeDocumentTitle !== undefined) body.useAlternativeDocumentTitle = updateFields.useAlternativeDocumentTitle;
		if (updateFields.vatId !== undefined) body.vatId = updateFields.vatId;

		// Object-wrapped ID references
		if (updateFields.editorId) body.editor = { id: updateFields.editorId };
		if (updateFields.projectId) body.project = { id: updateFields.projectId };

		// Financials
		const financials: IDataObject = {};
		if (updateFields.currency !== undefined) financials.currency = updateFields.currency;
		if (updateFields.taxation !== undefined) financials.tax = { taxation: updateFields.taxation };
		if (Object.keys(financials).length > 0) body.financials = financials;

		// Tags
		if (updateFields.tags !== undefined && (updateFields.tags as string).trim() !== '') {
			body.tags = (updateFields.tags as string).split(',').map((t: string) => t.trim()).filter((t: string) => t !== '').map((t: string) => ({ title: t }));
		}

		// Fixed collections (address objects)
		if (updateFields.documentAddress !== undefined) {
			const addr = (updateFields.documentAddress as IDataObject).address as IDataObject;
			if (addr !== undefined) body.documentAddress = addr;
		}

		// Print settings (fixedCollection)
		if (updateFields.printSettings !== undefined) {
			const ps = (updateFields.printSettings as IDataObject).settings as IDataObject;
			if (ps !== undefined) body.printSettings = ps;
		}

		assertNonEmptyBody(body, 'purchase order update');
		return xentralRequest.call(this, 'PATCH', `purchaseOrders/${purchaseOrderId}`, apiDates(body as IDataObject), {}, 'v3');
	}

	if (operation === 'delete') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		return xentralRequest.call(this, 'DELETE', `purchaseOrders/${purchaseOrderId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
		const quantity = this.getNodeParameter('quantity', itemIndex) as number;
		const lineItemOptions = this.getNodeParameter('lineItemOptions', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			product: { id: productId },
			quantity,
		};

		if (lineItemOptions.countryOfOrigin !== undefined) body.countryOfOrigin = lineItemOptions.countryOfOrigin;
		if (lineItemOptions.customerProductNumber !== undefined) body.customerProductNumber = lineItemOptions.customerProductNumber;
		if (lineItemOptions.deliveryDate !== undefined) body.deliveryDate = lineItemOptions.deliveryDate;
		if (lineItemOptions.deliveryDateAsCalendarWeek !== undefined) body.deliveryDateAsCalendarWeek = lineItemOptions.deliveryDateAsCalendarWeek;
		if (lineItemOptions.description !== undefined) body.description = lineItemOptions.description;
		if (lineItemOptions.hsCode !== undefined) body.hsCode = lineItemOptions.hsCode;
		if (lineItemOptions.internalComment !== undefined) body.internalComment = lineItemOptions.internalComment;
		if (lineItemOptions.name !== undefined) body.name = lineItemOptions.name;
		if (lineItemOptions.number !== undefined) body.number = lineItemOptions.number;
		if (lineItemOptions.taxLegalNotice !== undefined) body.taxLegalNotice = lineItemOptions.taxLegalNotice;
		applyLineItemHidden(body, lineItemOptions);

		// Price structure
		if (lineItemOptions.priceAmount !== undefined) {
			const currency = (lineItemOptions.priceCurrency as string) || 'EUR';
			body.price = { net: { amount: lineItemOptions.priceAmount, currency } };
		}

		return xentralRequest.call(this, 'POST', `purchaseOrders/${purchaseOrderId}/lineItems`, apiDates(body as IDataObject), {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		const updateFields = this.getNodeParameter('lineItemUpdateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.deliveryDate !== undefined) body.deliveryDate = updateFields.deliveryDate;
		if (updateFields.deliveryDateAsCalendarWeek !== undefined) body.deliveryDateAsCalendarWeek = updateFields.deliveryDateAsCalendarWeek;
		if (updateFields.description !== undefined) body.description = updateFields.description;
		if (updateFields.name !== undefined) body.name = updateFields.name;
		if (updateFields.quantity !== undefined) body.quantity = updateFields.quantity;
		applyLineItemPosition(body, updateFields);
		if (updateFields.taxLegalNotice !== undefined) body.taxLegalNotice = updateFields.taxLegalNotice;
		applyLineItemHidden(body, updateFields);
		if (updateFields.productId) body.product = { id: updateFields.productId };

		// Price structure
		if (updateFields.priceAmount !== undefined) {
			// An update only changes the currency when it was set.
			const net: IDataObject = { amount: updateFields.priceAmount };
			if (updateFields.priceCurrency) net.currency = updateFields.priceCurrency;
			body.price = { net };
		}

		const sortOnly = sortOnlyLineItemUpdate(body, updateFields);
		if (sortOnly) return sortOnly;
		assertNonEmptyBody(body, 'purchase order line item update');
		return xentralRequest.call(this, 'PATCH', `purchaseOrders/${purchaseOrderId}/lineItems/${lineItemId}`, apiDates(body as IDataObject), {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		return xentralRequest.call(this, 'DELETE', `purchaseOrders/${purchaseOrderId}/lineItems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		return xentralRequest.call(this, 'PATCH', `purchaseOrders/${purchaseOrderId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'send') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		return xentralRequest.call(this, 'PATCH', `purchaseOrders/${purchaseOrderId}/actions/send`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'cancel') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		return xentralRequest.call(this, 'PATCH', `purchaseOrders/${purchaseOrderId}/actions/cancel`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		const activityMessage = this.getNodeParameter('activityMessage', itemIndex) as string;
		const body: IDataObject = { message: activityMessage };
		return xentralRequest.call(this, 'PATCH', `purchaseOrders/${purchaseOrderId}/actions/logActivity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		return xentralRequest.call(this, 'PATCH', `purchaseOrders/${purchaseOrderId}/actions/setWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		return xentralRequest.call(this, 'PATCH', `purchaseOrders/${purchaseOrderId}/actions/removeWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
		return xentralFileUpload.call(this, `purchaseOrders/${purchaseOrderId}/files`, binaryPropertyName, itemIndex);
	}

	throw new Error(`Unknown purchaseOrder operation: ${operation}`);
}
