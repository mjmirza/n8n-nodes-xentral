import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll } from '../../transport';

export async function handleDeliveryNote(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		const language = this.getNodeParameter('language', itemIndex, 'de') as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			address: { id: customerId },
			language,
		};

		if (additionalFields.documentDate !== undefined) body.documentDate = additionalFields.documentDate;
		if (additionalFields.salesOrderId !== undefined) body.salesOrderId = additionalFields.salesOrderId;
		if (additionalFields.shippingMethod !== undefined) body.shippingMethod = additionalFields.shippingMethod;
		if (additionalFields.trackingNumber !== undefined) body.trackingNumber = additionalFields.trackingNumber;
		if (additionalFields.carrier !== undefined) body.carrier = additionalFields.carrier;
		if (additionalFields.internalNote !== undefined) body.internalNote = additionalFields.internalNote;

		return xentralRequest.call(this, 'POST', 'deliveryNotes', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `deliveryNotes/${deliveryNoteId}`, {}, {}, 'v3');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const query: IDataObject = {};
		if (filters.status !== undefined) query['filter[status]'] = filters.status;
		if (filters.customerId !== undefined) query['filter[customerId]'] = filters.customerId;
		return xentralV3GetAll.call(this, 'deliveryNotes', query, limit);
	}

	if (operation === 'update') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `deliveryNotes/${deliveryNoteId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'delete') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `deliveryNotes/${deliveryNoteId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		const quantity = this.getNodeParameter('quantity', itemIndex) as number;
		const lineItemOptions = this.getNodeParameter('lineItemOptions', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			product: { id: productId },
			quantity,
		};

		if (lineItemOptions.unitPrice !== undefined) body.unitPrice = lineItemOptions.unitPrice;
		if (lineItemOptions.discount !== undefined) body.discount = lineItemOptions.discount;
		if (lineItemOptions.description !== undefined) body.description = lineItemOptions.description;
		if (lineItemOptions.position !== undefined) body.position = lineItemOptions.position;

		return xentralRequest.call(this, 'POST', `deliveryNotes/${deliveryNoteId}/lineItems`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `deliveryNotes/${deliveryNoteId}/lineItems/${lineItemId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `deliveryNotes/${deliveryNoteId}/lineItems/${lineItemId}`, {}, {}, 'v3');
	}

	throw new Error(`Unknown deliveryNote operation: ${operation}`);
}
