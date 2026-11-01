import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll, xentralFileUpload, assertSafeId, assertNonEmptyBody, applyLineItemPosition, applyLineItemHidden, sortOnlyLineItemUpdate, apiDates } from '../../transport';

export async function handleSalesOrder(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		assertSafeId(customerId, 'customerId');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			address: { id: customerId },
		};

		// Simple string/date fields
		if (additionalFields.bodyIntroduction !== undefined) body.bodyIntroduction = additionalFields.bodyIntroduction;
		if (additionalFields.bodyOutroduction !== undefined) body.bodyOutroduction = additionalFields.bodyOutroduction;
		if (additionalFields.costCenter !== undefined) body.costCenter = additionalFields.costCenter;
		if (additionalFields.deliveryTerms !== undefined) body.deliveryTerms = additionalFields.deliveryTerms;
		if (additionalFields.documentDate !== undefined) body.documentDate = additionalFields.documentDate;
		if (additionalFields.internalComment !== undefined) body.internalComment = additionalFields.internalComment;
		if (additionalFields.internalDesignation !== undefined) body.internalDesignation = additionalFields.internalDesignation;
		if (additionalFields.language !== undefined) body.language = additionalFields.language;
		if (additionalFields.masterReferenceNumber !== undefined) body.masterReferenceNumber = additionalFields.masterReferenceNumber;
		if (additionalFields.vatId !== undefined) body.vatId = additionalFields.vatId;

		// Object-wrapped ID references
		// The saved warehouse field keeps the key it always sent; storage location is a separate field.
		if (additionalFields.commissionConsignmentWarehouseId) {
			body.commissionConsignmentWarehouse = { id: additionalFields.commissionConsignmentWarehouseId };
		}
		if (additionalFields.commissionConsignmentStorageLocationId) {
			body.commissionConsignmentStorageLocation = { id: additionalFields.commissionConsignmentStorageLocationId };
		}
		if (additionalFields.editorId) body.editor = { id: additionalFields.editorId };
		if (additionalFields.preferredWarehouseId) body.preferredWarehouse = { id: additionalFields.preferredWarehouseId };
		if (additionalFields.projectId) body.project = { id: additionalFields.projectId };
		if (additionalFields.salesId) body.sales = { id: additionalFields.salesId };

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
		if (additionalFields.deviatingShipToAddress !== undefined) {
			const addr = (additionalFields.deviatingShipToAddress as IDataObject).address as IDataObject;
			if (addr !== undefined) body.deviatingShipToAddress = addr;
		}
		if (additionalFields.documentAddress !== undefined) {
			const addr = (additionalFields.documentAddress as IDataObject).address as IDataObject;
			if (addr !== undefined) body.documentAddress = addr;
		}

		// Print settings (fixedCollection)
		if (additionalFields.printSettings !== undefined) {
			const ps = (additionalFields.printSettings as IDataObject).settings as IDataObject;
			if (ps !== undefined) body.printSettings = ps;
		}

		return xentralRequest.call(this, 'POST', 'salesOrders', apiDates(body as IDataObject), {}, 'v3');
	}

	if (operation === 'get') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		return xentralRequest.call(this, 'GET', `salesOrders/${salesOrderId}`, {}, {}, 'v3');
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
		return xentralV3GetAll.call(this, 'salesOrders', query, limit, maxPages);
	}

	if (operation === 'update') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		// Simple string/date fields
		if (updateFields.bodyIntroduction !== undefined) body.bodyIntroduction = updateFields.bodyIntroduction;
		if (updateFields.bodyOutroduction !== undefined) body.bodyOutroduction = updateFields.bodyOutroduction;
		if (updateFields.costCenter !== undefined) body.costCenter = updateFields.costCenter;
		if (updateFields.deliveryTerms !== undefined) body.deliveryTerms = updateFields.deliveryTerms;
		if (updateFields.documentDate !== undefined) body.documentDate = updateFields.documentDate;
		if (updateFields.internalComment !== undefined) body.internalComment = updateFields.internalComment;
		if (updateFields.internalDesignation !== undefined) body.internalDesignation = updateFields.internalDesignation;
		if (updateFields.language !== undefined) body.language = updateFields.language;
		if (updateFields.masterReferenceNumber !== undefined) body.masterReferenceNumber = updateFields.masterReferenceNumber;
		if (updateFields.vatId !== undefined) body.vatId = updateFields.vatId;

		// Object-wrapped ID references
		// The saved warehouse field keeps the key it always sent; storage location is a separate field.
		if (updateFields.commissionConsignmentWarehouseId) {
			body.commissionConsignmentWarehouse = { id: updateFields.commissionConsignmentWarehouseId };
		}
		if (updateFields.commissionConsignmentStorageLocationId) {
			body.commissionConsignmentStorageLocation = { id: updateFields.commissionConsignmentStorageLocationId };
		}
		if (updateFields.editorId) body.editor = { id: updateFields.editorId };
		if (updateFields.preferredWarehouseId) body.preferredWarehouse = { id: updateFields.preferredWarehouseId };
		if (updateFields.projectId) body.project = { id: updateFields.projectId };
		if (updateFields.salesId) body.sales = { id: updateFields.salesId };

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
		if (updateFields.deviatingShipToAddress !== undefined) {
			const addr = (updateFields.deviatingShipToAddress as IDataObject).address as IDataObject;
			if (addr !== undefined) body.deviatingShipToAddress = addr;
		}
		if (updateFields.documentAddress !== undefined) {
			const addr = (updateFields.documentAddress as IDataObject).address as IDataObject;
			if (addr !== undefined) body.documentAddress = addr;
		}

		// Print settings (fixedCollection)
		if (updateFields.printSettings !== undefined) {
			const ps = (updateFields.printSettings as IDataObject).settings as IDataObject;
			if (ps !== undefined) body.printSettings = ps;
		}

		assertNonEmptyBody(body, 'sales order update');
		return xentralRequest.call(this, 'PATCH', `salesOrders/${salesOrderId}`, apiDates(body as IDataObject), {}, 'v3');
	}

	if (operation === 'delete') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		return xentralRequest.call(this, 'DELETE', `salesOrders/${salesOrderId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
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
		if (lineItemOptions.discount !== undefined) body.discount = lineItemOptions.discount;
		if (lineItemOptions.externalNumber !== undefined) body.externalNumber = lineItemOptions.externalNumber;
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

		return xentralRequest.call(this, 'POST', `salesOrders/${salesOrderId}/lineItems`, apiDates(body as IDataObject), {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		const updateFields = this.getNodeParameter('lineItemUpdateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.deliveryDate !== undefined) body.deliveryDate = updateFields.deliveryDate;
		if (updateFields.deliveryDateAsCalendarWeek !== undefined) body.deliveryDateAsCalendarWeek = updateFields.deliveryDateAsCalendarWeek;
		if (updateFields.description !== undefined) body.description = updateFields.description;
		if (updateFields.discount !== undefined) body.discount = updateFields.discount;
		if (updateFields.externalNumber !== undefined) body.externalNumber = updateFields.externalNumber;
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
		assertNonEmptyBody(body, 'sales order line item update');
		return xentralRequest.call(this, 'PATCH', `salesOrders/${salesOrderId}/lineItems/${lineItemId}`, apiDates(body as IDataObject), {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		return xentralRequest.call(this, 'DELETE', `salesOrders/${salesOrderId}/lineItems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		return xentralRequest.call(this, 'PATCH', `salesOrders/${salesOrderId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'send') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		return xentralRequest.call(this, 'PATCH', `salesOrders/${salesOrderId}/actions/send`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'cancel') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		return xentralRequest.call(this, 'PATCH', `salesOrders/${salesOrderId}/actions/cancel`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		const activityMessage = this.getNodeParameter('activityMessage', itemIndex) as string;
		const body: IDataObject = { message: activityMessage };
		return xentralRequest.call(this, 'PATCH', `salesOrders/${salesOrderId}/actions/logActivity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		return xentralRequest.call(this, 'PATCH', `salesOrders/${salesOrderId}/actions/setWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		return xentralRequest.call(this, 'PATCH', `salesOrders/${salesOrderId}/actions/removeWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
		return xentralFileUpload.call(this, `salesOrders/${salesOrderId}/files`, binaryPropertyName, itemIndex);
	}

	throw new Error(`Unknown salesOrder operation: ${operation}`);
}
