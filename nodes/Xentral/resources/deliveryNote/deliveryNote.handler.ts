import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll, xentralFileUpload, assertSafeId, assertNonEmptyBody, applyLineItemPosition, applyLineItemHidden, sortOnlyLineItemUpdate, apiDates, documentAddress, lineItemAddBody } from '../../transport';

export async function handleDeliveryNote(
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
		if (additionalFields.commissionConsignmentWarehouseId || additionalFields.commissionConsignmentWarehouseId === null) {
			body.commissionConsignmentWarehouse = { id: additionalFields.commissionConsignmentWarehouseId };
		}
		if (additionalFields.editorId || additionalFields.editorId === null) body.editor = { id: additionalFields.editorId };
		if (additionalFields.orderPickingId || additionalFields.orderPickingId === null) body.orderPicking = { id: additionalFields.orderPickingId };
		if (additionalFields.preferredWarehouseId || additionalFields.preferredWarehouseId === null) body.preferredWarehouse = { id: additionalFields.preferredWarehouseId };
		if (additionalFields.projectId || additionalFields.projectId === null) body.project = { id: additionalFields.projectId };
		if (additionalFields.salesId || additionalFields.salesId === null) body.sales = { id: additionalFields.salesId };
		if (additionalFields.salesOrderId || additionalFields.salesOrderId === null) body.salesOrder = { id: additionalFields.salesOrderId };

		// Tags
		if (additionalFields.tags !== undefined && (additionalFields.tags as string).trim() !== '') {
			body.tags = (additionalFields.tags as string).split(',').map((t: string) => t.trim()).filter((t: string) => t !== '').map((t: string) => ({ title: t }));
		}

		// Fixed collections (address objects)
		if (additionalFields.documentAddress !== undefined) {
			const addr = (additionalFields.documentAddress as IDataObject).address as IDataObject;
			if (addr !== undefined) body.documentAddress = documentAddress(addr);
		}

		// Print settings (fixedCollection)
		if (additionalFields.printSettings !== undefined) {
			const ps = (additionalFields.printSettings as IDataObject).settings as IDataObject;
			if (ps !== undefined) body.printSettings = ps;
		}

		return xentralRequest.call(this, 'POST', 'deliveryNotes', apiDates(body as IDataObject), {}, 'v3');
	}

	if (operation === 'get') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		return xentralRequest.call(this, 'GET', `deliveryNotes/${deliveryNoteId}`, {}, {}, 'v3');
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
		return xentralV3GetAll.call(this, 'deliveryNotes', query, limit, maxPages);
	}

	if (operation === 'update') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
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
		if (updateFields.commissionConsignmentWarehouseId || updateFields.commissionConsignmentWarehouseId === null) {
			body.commissionConsignmentWarehouse = { id: updateFields.commissionConsignmentWarehouseId };
		}
		if (updateFields.editorId || updateFields.editorId === null) body.editor = { id: updateFields.editorId };
		if (updateFields.orderPickingId || updateFields.orderPickingId === null) body.orderPicking = { id: updateFields.orderPickingId };
		if (updateFields.preferredWarehouseId || updateFields.preferredWarehouseId === null) body.preferredWarehouse = { id: updateFields.preferredWarehouseId };
		if (updateFields.projectId || updateFields.projectId === null) body.project = { id: updateFields.projectId };
		if (updateFields.salesId || updateFields.salesId === null) body.sales = { id: updateFields.salesId };
		if (updateFields.salesOrderId || updateFields.salesOrderId === null) body.salesOrder = { id: updateFields.salesOrderId };

		// Tags
		if (updateFields.tags !== undefined && (updateFields.tags as string).trim() !== '') {
			body.tags = (updateFields.tags as string).split(',').map((t: string) => t.trim()).filter((t: string) => t !== '').map((t: string) => ({ title: t }));
		}

		// Fixed collections (address objects)
		if (updateFields.documentAddress !== undefined) {
			const addr = (updateFields.documentAddress as IDataObject).address as IDataObject;
			if (addr !== undefined) body.documentAddress = documentAddress(addr);
		}

		// Print settings (fixedCollection)
		if (updateFields.printSettings !== undefined) {
			const ps = (updateFields.printSettings as IDataObject).settings as IDataObject;
			if (ps !== undefined) body.printSettings = ps;
		}

		assertNonEmptyBody(body, 'delivery note update');
		return xentralRequest.call(this, 'PATCH', `deliveryNotes/${deliveryNoteId}`, apiDates(body as IDataObject), {}, 'v3');
	}

	if (operation === 'delete') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		return xentralRequest.call(this, 'DELETE', `deliveryNotes/${deliveryNoteId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
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
		if (lineItemOptions.deliveredQuantity !== undefined) body.deliveredQuantity = lineItemOptions.deliveredQuantity;
		if (lineItemOptions.deliveryDate !== undefined) body.deliveryDate = lineItemOptions.deliveryDate;
		if (lineItemOptions.deliveryDateAsCalendarWeek !== undefined) body.deliveryDateAsCalendarWeek = lineItemOptions.deliveryDateAsCalendarWeek;
		if (lineItemOptions.description !== undefined) body.description = lineItemOptions.description;
		if (lineItemOptions.hsCode !== undefined) body.hsCode = lineItemOptions.hsCode;
		if (lineItemOptions.internalComment !== undefined) body.internalComment = lineItemOptions.internalComment;
		if (lineItemOptions.name !== undefined) body.name = lineItemOptions.name;
		if (lineItemOptions.number !== undefined) body.number = lineItemOptions.number;
		applyLineItemHidden(body, lineItemOptions);

		return xentralRequest.call(this, 'POST', `deliveryNotes/${deliveryNoteId}/lineItems`, apiDates(lineItemAddBody(body as IDataObject)), {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		const updateFields = this.getNodeParameter('lineItemUpdateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.deliveredQuantity !== undefined) body.deliveredQuantity = updateFields.deliveredQuantity;
		if (updateFields.deliveryDate !== undefined) body.deliveryDate = updateFields.deliveryDate;
		if (updateFields.deliveryDateAsCalendarWeek !== undefined) body.deliveryDateAsCalendarWeek = updateFields.deliveryDateAsCalendarWeek;
		if (updateFields.description !== undefined) body.description = updateFields.description;
		if (updateFields.name !== undefined) body.name = updateFields.name;
		if (updateFields.quantity !== undefined) body.quantity = updateFields.quantity;
		applyLineItemPosition(body, updateFields);
		applyLineItemHidden(body, updateFields);
		if (updateFields.productId) body.product = { id: updateFields.productId };

		const sortOnly = sortOnlyLineItemUpdate(body, updateFields);
		if (sortOnly) return sortOnly;
		assertNonEmptyBody(body, 'delivery note line item update');
		return xentralRequest.call(this, 'PATCH', `deliveryNotes/${deliveryNoteId}/lineItems/${lineItemId}`, apiDates(body as IDataObject), {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		return xentralRequest.call(this, 'DELETE', `deliveryNotes/${deliveryNoteId}/lineItems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		return xentralRequest.call(this, 'PATCH', `deliveryNotes/${deliveryNoteId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'send') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		return xentralRequest.call(this, 'PATCH', `deliveryNotes/${deliveryNoteId}/actions/send`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'cancel') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		return xentralRequest.call(this, 'PATCH', `deliveryNotes/${deliveryNoteId}/actions/cancel`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		const activityMessage = this.getNodeParameter('activityMessage', itemIndex) as string;
		const body: IDataObject = { message: activityMessage };
		return xentralRequest.call(this, 'PATCH', `deliveryNotes/${deliveryNoteId}/actions/logActivity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		return xentralRequest.call(this, 'PATCH', `deliveryNotes/${deliveryNoteId}/actions/setWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		return xentralRequest.call(this, 'PATCH', `deliveryNotes/${deliveryNoteId}/actions/removeWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
		return xentralFileUpload.call(this, `deliveryNotes/${deliveryNoteId}/files`, binaryPropertyName, itemIndex);
	}

	throw new Error(`Unknown deliveryNote operation: ${operation}`);
}
