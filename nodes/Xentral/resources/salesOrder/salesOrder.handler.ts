import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1CursorGetAll } from '../../transport';

export async function handleSalesOrder(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			customer: { id: customerId },
		};

		if (additionalFields.documentDate) body.documentDate = additionalFields.documentDate;
		if (additionalFields.deliveryDate) body.deliveryDate = additionalFields.deliveryDate;
		if (additionalFields.paymentMethod) body.paymentMethod = additionalFields.paymentMethod;
		if (additionalFields.shippingMethod) body.shippingMethod = additionalFields.shippingMethod;
		if (additionalFields.internalNote) body.internalNote = additionalFields.internalNote;
		if (additionalFields.externalNote) body.externalNote = additionalFields.externalNote;
		if (additionalFields.project) body.project = additionalFields.project;

		return xentralRequest.call(this, 'POST', 'salesOrders', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `salesOrders/${salesOrderId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1CursorGetAll.call(this, 'salesOrders', {}, limit);
	}

	if (operation === 'update') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `salesOrders/${salesOrderId}`, updateFields as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `salesOrders/${salesOrderId}`, {}, {}, 'v1');
	}

	if (operation === 'search') {
		const searchTerm = this.getNodeParameter('searchTerm', itemIndex) as string;
		const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
		return xentralV1CursorGetAll.call(this, 'salesOrders', { 'filter[name]': searchTerm }, limit);
	}

	if (operation === 'cancel') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'POST', `salesOrders/${salesOrderId}/cancel`, {} as IDataObject, {}, 'v1');
	}

	if (operation === 'dispatch') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'POST', `salesOrders/${salesOrderId}/dispatch`, {} as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown salesOrder operation: ${operation}`);
}
