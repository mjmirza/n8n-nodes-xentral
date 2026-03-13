import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId } from '../../transport';

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
		assertSafeId(salesOrderId, 'salesOrderId');
		return xentralRequest.call(this, 'GET', `salesOrders/${salesOrderId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'salesOrders', {}, limit, maxPages);
	}

	if (operation === 'update') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `salesOrders/${salesOrderId}`, updateFields as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		return xentralRequest.call(this, 'DELETE', `salesOrders/${salesOrderId}`, {}, {}, 'v1');
	}

	if (operation === 'search') {
		const searchTerm = (this.getNodeParameter('searchTerm', itemIndex) as string).trim();
		if (!searchTerm) {
			return [];
		}
		const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex, 50) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'salesOrders', {
			'filter[0][key]': 'documentNumber',
			'filter[0][op]': 'contains',
			'filter[0][value]': searchTerm,
		}, limit, maxPages);
	}

	if (operation === 'cancel') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		return xentralRequest.call(this, 'POST', `salesOrders/${salesOrderId}/actions/cancel`, {} as IDataObject, {}, 'v1');
	}

	if (operation === 'dispatch') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		assertSafeId(salesOrderId, 'salesOrderId');
		return xentralRequest.call(this, 'POST', `salesOrders/${salesOrderId}/actions/dispatch`, {} as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown salesOrder operation: ${operation}`);
}
