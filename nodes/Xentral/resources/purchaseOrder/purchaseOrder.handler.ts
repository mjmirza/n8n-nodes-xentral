import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handlePurchaseOrder(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const date = this.getNodeParameter('date', itemIndex) as string;

		const body: IDataObject = {
			supplier: { id: supplierId },
			date,
		};

		if (additionalFields.documentDate !== undefined) body.documentDate = additionalFields.documentDate;
		if (additionalFields.deliveryDate !== undefined) body.deliveryDate = additionalFields.deliveryDate;
		if (additionalFields.internalNote !== undefined) body.internalNote = additionalFields.internalNote;
		if (additionalFields.project !== undefined) body.project = additionalFields.project;

		return xentralRequest.call(this, 'POST', 'purchaseOrders', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `purchaseOrders/${purchaseOrderId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'purchaseOrders', {}, limit);
	}

	if (operation === 'update') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.documentDate !== undefined) body.documentDate = updateFields.documentDate;
		if (updateFields.deliveryDate !== undefined) body.deliveryDate = updateFields.deliveryDate;
		if (updateFields.internalNote !== undefined) body.internalNote = updateFields.internalNote;
		if (updateFields.project !== undefined) body.project = updateFields.project;

		return xentralRequest.call(this, 'PATCH', `purchaseOrders/${purchaseOrderId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `purchaseOrders/${purchaseOrderId}`, {}, {}, 'v1');
	}

	if (operation === 'search') {
		const searchTerm = this.getNodeParameter('searchTerm', itemIndex) as string;
		const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
		return xentralV1PageGetAll.call(this, 'purchaseOrders', {
			'filter[0][key]': 'documentNumber',
			'filter[0][op]': 'contains',
			'filter[0][value]': searchTerm,
		}, limit);
	}

	if (operation === 'cancel') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'POST', `purchaseOrders/${purchaseOrderId}/actions/cancel`, {} as IDataObject, {}, 'v1');
	}

	if (operation === 'release') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		return xentralRequest.call(this, 'POST', `purchaseOrders/${purchaseOrderId}/actions/release`, {} as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown purchaseOrder operation: ${operation}`);
}
