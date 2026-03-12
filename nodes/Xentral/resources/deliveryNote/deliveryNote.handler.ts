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

		if (additionalFields.documentDate) body.documentDate = additionalFields.documentDate;
		if (additionalFields.salesOrderId) body.salesOrderId = additionalFields.salesOrderId;
		if (additionalFields.shippingMethod) body.shippingMethod = additionalFields.shippingMethod;
		if (additionalFields.trackingNumber) body.trackingNumber = additionalFields.trackingNumber;
		if (additionalFields.carrier) body.carrier = additionalFields.carrier;
		if (additionalFields.internalNote) body.internalNote = additionalFields.internalNote;

		return xentralRequest.call(this, 'POST', 'deliverynotes', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `deliverynotes/${deliveryNoteId}`, {}, {}, 'v3');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const query: IDataObject = {};
		if (filters.status) query['filter[status]'] = filters.status;
		if (filters.customerId) query['filter[customerId]'] = filters.customerId;
		return xentralV3GetAll.call(this, 'deliverynotes', query, limit);
	}

	if (operation === 'update') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `deliverynotes/${deliveryNoteId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'delete') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `deliverynotes/${deliveryNoteId}`, {}, {}, 'v3');
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

		if (lineItemOptions.unitPrice) body.unitPrice = lineItemOptions.unitPrice;
		if (lineItemOptions.discount) body.discount = lineItemOptions.discount;
		if (lineItemOptions.description) body.description = lineItemOptions.description;
		if (lineItemOptions.position) body.position = lineItemOptions.position;

		return xentralRequest.call(this, 'POST', `deliverynotes/${deliveryNoteId}/lineitems`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'getLineItems') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `deliverynotes/${deliveryNoteId}/lineitems`, {}, {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `deliverynotes/${deliveryNoteId}/lineitems/${lineItemId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `deliverynotes/${deliveryNoteId}/lineitems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `deliverynotes/${deliveryNoteId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'cancel') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `deliverynotes/${deliveryNoteId}/actions/cancel`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'send') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `deliverynotes/${deliveryNoteId}/actions/send`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		const body = this.getNodeParameter('activityData', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `deliverynotes/${deliveryNoteId}/actions/logactivity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `deliverynotes/${deliveryNoteId}/actions/setwriteprotection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `deliverynotes/${deliveryNoteId}/actions/removewriteprotection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		const body = this.getNodeParameter('fileData', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'POST', `deliverynotes/${deliveryNoteId}/files`, body as IDataObject, {}, 'v3');
	}

	throw new Error(`Unknown deliveryNote operation: ${operation}`);
}
