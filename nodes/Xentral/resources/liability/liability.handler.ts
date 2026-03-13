import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId } from '../../transport';

export async function handleLiability(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		assertSafeId(supplierId, 'supplierId');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			supplier: { id: supplierId },
		};

		if (additionalFields.grossAmount !== undefined) body.grossAmount = additionalFields.grossAmount;
		if (additionalFields.dueDate !== undefined) body.dueDate = additionalFields.dueDate;
		if (additionalFields.description !== undefined) body.description = additionalFields.description;
		if (additionalFields.documentDate !== undefined) body.documentDate = additionalFields.documentDate;

		return xentralRequest.call(this, 'POST', 'liabilities', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const liabilityId = this.getNodeParameter('liabilityId', itemIndex) as string;
		assertSafeId(liabilityId, 'liabilityId');
		return xentralRequest.call(this, 'GET', `liabilities/${liabilityId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'liabilities', {}, limit, maxPages);
	}

	if (operation === 'release') {
		const liabilityId = this.getNodeParameter('liabilityId', itemIndex) as string;
		assertSafeId(liabilityId, 'liabilityId');
		return xentralRequest.call(this, 'POST', `liabilities/${liabilityId}/actions/release`, {} as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown liability operation: ${operation}`);
}
