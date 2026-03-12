import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1CursorGetAll } from '../../transport';

export async function handlePurchaseOrder(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			supplier: { id: supplierId },
		};

		if (additionalFields.documentDate) body.documentDate = additionalFields.documentDate;
		if (additionalFields.deliveryDate) body.deliveryDate = additionalFields.deliveryDate;
		if (additionalFields.internalNote) body.internalNote = additionalFields.internalNote;
		if (additionalFields.project) body.project = additionalFields.project;

		return xentralRequest.call(this, 'POST', 'purchaseOrders', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `purchaseOrders/${purchaseOrderId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1CursorGetAll.call(this, 'purchaseOrders', {}, limit);
	}

	if (operation === 'update') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.documentDate) body.documentDate = updateFields.documentDate;
		if (updateFields.deliveryDate) body.deliveryDate = updateFields.deliveryDate;
		if (updateFields.internalNote) body.internalNote = updateFields.internalNote;
		if (updateFields.project) body.project = updateFields.project;

		return xentralRequest.call(this, 'PATCH', `purchaseOrders/${purchaseOrderId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `purchaseOrders/${purchaseOrderId}`, {}, {}, 'v1');
	}

	if (operation === 'search') {
		const searchTerm = this.getNodeParameter('searchTerm', itemIndex) as string;
		const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
		return xentralV1CursorGetAll.call(this, 'purchaseOrders', { 'filter[name]': searchTerm }, limit);
	}

	if (operation === 'cancel') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `purchaseOrders/${purchaseOrderId}/cancel`, {} as IDataObject, {}, 'v1');
	}

	if (operation === 'release') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `purchaseOrders/${purchaseOrderId}/release`, {} as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown purchaseOrder operation: ${operation}`);
}
