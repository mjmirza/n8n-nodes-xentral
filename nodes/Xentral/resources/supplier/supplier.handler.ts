import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmptyBody } from '../../transport';

export async function handleSupplier(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') {
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		assertSafeId(supplierId, 'supplierId');
		return xentralRequest.call(this, 'GET', `suppliers/${supplierId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'suppliers', {}, limit, maxPages);
	}

	if (operation === 'update') {
		// V1 Supplier Update: only supports tags
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		assertSafeId(supplierId, 'supplierId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		// tags: comma-separated string to array
		if (updateFields.tags !== undefined) {
			const tagsStr = (updateFields.tags as string).trim();
			if (tagsStr) {
				body.tags = tagsStr.split(',').map((t: string) => ({ name: t.trim() }));
			} else {
				body.tags = [];
			}
		}

		assertNonEmptyBody(body, 'supplier update');
		return xentralRequest.call(this, 'PATCH', `suppliers/${supplierId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'search') {
		const searchTerm = (this.getNodeParameter('searchTerm', itemIndex) as string).trim();
		if (!searchTerm) {
			return [];
		}
		const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex, 50) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'suppliers', {
			'filter[0][key]': 'name',
			'filter[0][op]': 'contains',
			'filter[0][value]': searchTerm,
		}, limit, maxPages);
	}

	throw new Error(`Unknown supplier operation: ${operation}`);
}
