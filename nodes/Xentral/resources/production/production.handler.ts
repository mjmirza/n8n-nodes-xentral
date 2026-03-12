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

		return xentralRequest.call(this, 'POST', 'productions', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `production/${productionId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'production', {}, limit);
	}

	if (operation === 'delete') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `productions/${productionId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `productions/${productionId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'start') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `productions/${productionId}/actions/start`, {} as IDataObject, {}, 'v3');
	}

	throw new Error(`Unknown production operation: ${operation}`);
}
