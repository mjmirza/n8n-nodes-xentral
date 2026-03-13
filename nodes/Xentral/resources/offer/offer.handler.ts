import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll, xentralFileUpload, assertSafeId } from '../../transport';

export async function handleOffer(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		assertSafeId(customerId, 'customerId');
		const language = this.getNodeParameter('language', itemIndex, 'de') as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			address: { id: customerId },
			language,
		};

		if (additionalFields.documentDate !== undefined) body.documentDate = additionalFields.documentDate;
		if (additionalFields.deliveryTime !== undefined) body.deliveryTime = additionalFields.deliveryTime;
		if (additionalFields.paymentTerm !== undefined) body.paymentTerm = additionalFields.paymentTerm;
		if (additionalFields.shippingMethod !== undefined) body.shippingMethod = additionalFields.shippingMethod;
		if (additionalFields.internalNote !== undefined) body.internalNote = additionalFields.internalNote;
		if (additionalFields.shippingCost !== undefined) body.shippingCost = additionalFields.shippingCost;
		if (additionalFields.headerText !== undefined) body.headerText = additionalFields.headerText;
		if (additionalFields.footerText !== undefined) body.footerText = additionalFields.footerText;
		if (additionalFields.validityDays !== undefined) body.validityDays = additionalFields.validityDays;
		if (additionalFields.deliveryAddress !== undefined) {
			const addr = (additionalFields.deliveryAddress as IDataObject).address as IDataObject;
			if (addr !== undefined) body.deliveryAddress = addr;
		}

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
			query[`filter[${filterIndex}][key]`] = 'customerId';
			query[`filter[${filterIndex}][op]`] = 'equals';
			query[`filter[${filterIndex}][value]`] = filters.customerId;
			filterIndex++;
		}
		if (filters.createdAfter !== undefined && filters.createdAfter !== '') {
			query[`filter[${filterIndex}][key]`] = 'createdAfter';
			query[`filter[${filterIndex}][op]`] = 'gte';
			query[`filter[${filterIndex}][value]`] = filters.createdAfter;
			filterIndex++;
		}
		return xentralV3GetAll.call(this, 'offers', query, limit, maxPages);
	}

	if (operation === 'update') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}`, updateFields as IDataObject, {}, 'v3');
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

		const body: IDataObject = {
			product: { id: productId },
			quantity,
		};

		if (lineItemOptions.unitPrice !== undefined) body.unitPrice = lineItemOptions.unitPrice;
		if (lineItemOptions.discount !== undefined) body.discount = lineItemOptions.discount;
		if (lineItemOptions.description !== undefined) body.description = lineItemOptions.description;
		if (lineItemOptions.position !== undefined) body.position = lineItemOptions.position;

		return xentralRequest.call(this, 'POST', `offers/${offerId}/lineItems`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/lineItems/${lineItemId}`, updateFields as IDataObject, {}, 'v3');
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
		const body = this.getNodeParameter('activityData', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/log-activity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/set-write-protection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		return xentralRequest.call(this, 'PATCH', `offers/${offerId}/actions/remove-write-protection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const offerId = this.getNodeParameter('offerId', itemIndex) as string;
		assertSafeId(offerId, 'offerId');
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
		return xentralFileUpload.call(this, `offers/${offerId}/files`, binaryPropertyName, itemIndex);
	}

	throw new Error(`Unknown offer operation: ${operation}`);
}
