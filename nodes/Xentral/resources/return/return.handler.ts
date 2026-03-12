import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1CursorGetAll } from '../../transport';

export async function handleReturn(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex, '') as string;
		const customerId = this.getNodeParameter('customerId', itemIndex, '') as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		if (salesOrderId) body.salesOrderId = salesOrderId;
		if (customerId) body.customerId = customerId;
		if (additionalFields.reason) body.reason = additionalFields.reason;
		if (additionalFields.internalNote) body.internalNote = additionalFields.internalNote;

		return xentralRequest.call(this, 'POST', 'returns', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `returns/${returnId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1CursorGetAll.call(this, 'returns', {}, limit);
	}

	if (operation === 'update') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.reason) body.reason = updateFields.reason;
		if (updateFields.internalNote) body.internalNote = updateFields.internalNote;

		return xentralRequest.call(this, 'PATCH', `returns/${returnId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `returns/${returnId}`, {}, {}, 'v1');
	}

	if (operation === 'release') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		return xentralRequest.call(this, 'POST', `returns/${returnId}/release`, {} as IDataObject, {}, 'v1');
	}

	if (operation === 'getReasons') {
		return xentralRequest.call(this, 'GET', 'returns/reasons', {}, {}, 'v1');
	}

	throw new Error(`Unknown return operation: ${operation}`);
}
