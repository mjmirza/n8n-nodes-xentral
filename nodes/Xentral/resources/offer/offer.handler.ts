import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll } from '../../transport';

export async function handleOffer(
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
		if (additionalFields.deliveryTime) body.deliveryTime = additionalFields.deliveryTime;
		if (additionalFields.paymentTerm) body.paymentTerm = additionalFields.paymentTerm;
		if (additionalFields.shippingMethod) body.shippingMethod = additionalFields.shippingMethod;
		if (additionalFields.internalNote) body.internalNote = additionalFields.internalNote;
		if (additionalFields.headerText) body.headerText = additionalFields.headerText;
		if (additionalFields.footerText) body.footerText = additionalFields.footerText;

		return xentralRequest.call(this, 'POST', 'offers', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `offers/${offerId}`, {}, {}, 'v3');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const query: IDataObject = {};
		if (filters.status) query['filter[status]'] = filters.status;
		if (filters.customerId) query['filter[customerId]'] = filters.customerId;
		return xentralV3GetAll.call(this, 'offers', query, limit);
	}

	if (operation === 'update') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'delete') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `offers/${offerId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
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

		return xentralRequest.call(this, 'POST', `offers/${offerId}/lineitems`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'getLineItems') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `offers/${offerId}/lineitems`, {}, {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/lineitems/${lineItemId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `offers/${offerId}/lineitems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'cancel') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/cancel`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'send') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/send`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		const body = this.getNodeParameter('activityData', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/logactivity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/setwriteprotection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/removewriteprotection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		const body = this.getNodeParameter('fileData', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'POST', `offers/${offerId}/files`, body as IDataObject, {}, 'v3');
	}

	throw new Error(`Unknown offer operation: ${operation}`);
}
