import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleSalesOrder(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const customerName = this.getNodeParameter('customerName', itemIndex) as string;
		const project = this.getNodeParameter('project', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			customer: { name: customerName },
			project: { id: project },
		};

		if (additionalFields.customerId !== undefined) {
			body.customer = { id: additionalFields.customerId, name: customerName };
		}
		if (additionalFields.documentDate !== undefined) body.documentDate = additionalFields.documentDate;
		if (additionalFields.deliveryDate !== undefined) body.deliveryDate = additionalFields.deliveryDate;
		if (additionalFields.paymentMethod !== undefined) body.paymentMethod = additionalFields.paymentMethod;
		if (additionalFields.shippingMethod !== undefined) body.shippingMethod = additionalFields.shippingMethod;
		if (additionalFields.internalNote !== undefined) body.internalNote = additionalFields.internalNote;
		if (additionalFields.externalNote !== undefined) body.externalNote = additionalFields.externalNote;

		return xentralRequest.call(this, 'POST', 'salesOrders', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `salesOrders/${salesOrderId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'salesOrders', {}, limit);
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
		return xentralV1PageGetAll.call(this, 'salesOrders', { 'filter[name]': searchTerm }, limit);
	}

	if (operation === 'cancel') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'POST', `salesOrders/${salesOrderId}/actions/cancel`, {} as IDataObject, {}, 'v1');
	}

	if (operation === 'dispatch') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'POST', `salesOrders/${salesOrderId}/actions/dispatch`, {} as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown salesOrder operation: ${operation}`);
}
