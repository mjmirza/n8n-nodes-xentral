import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleProduction(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		const quantity = this.getNodeParameter('quantity', itemIndex) as number;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			productId,
			quantity,
		};

		if (additionalFields.startDate) body.startDate = additionalFields.startDate;
		if (additionalFields.endDate) body.endDate = additionalFields.endDate;
		if (additionalFields.warehouse) body.warehouse = additionalFields.warehouse;
		if (additionalFields.internalNote) body.internalNote = additionalFields.internalNote;
		if (additionalFields.status) body.status = additionalFields.status;

		return xentralRequest.call(this, 'POST', 'productions', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `productions/${productionId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'productions', {}, limit);
	}

	if (operation === 'update') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.quantity) body.quantity = updateFields.quantity;
		if (updateFields.startDate) body.startDate = updateFields.startDate;
		if (updateFields.endDate) body.endDate = updateFields.endDate;
		if (updateFields.warehouse) body.warehouse = updateFields.warehouse;
		if (updateFields.internalNote) body.internalNote = updateFields.internalNote;
		if (updateFields.status) body.status = updateFields.status;

		return xentralRequest.call(this, 'PATCH', `productions/${productionId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `productions/${productionId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown production operation: ${operation}`);
}
