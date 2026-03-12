import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleLiability(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		const amount = this.getNodeParameter('amount', itemIndex) as number;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			supplierId,
			amount,
		};

		if (additionalFields.dueDate) body.dueDate = additionalFields.dueDate;
		if (additionalFields.description) body.description = additionalFields.description;
		if (additionalFields.documentDate) body.documentDate = additionalFields.documentDate;

		return xentralRequest.call(this, 'POST', 'liability', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const liabilityId = this.getNodeParameter('liabilityId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `liability/${liabilityId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'liability', {}, limit);
	}

	if (operation === 'release') {
		const liabilityId = this.getNodeParameter('liabilityId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `liability/${liabilityId}/release`, {} as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown liability operation: ${operation}`);
}
