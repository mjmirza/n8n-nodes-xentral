import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, assertNonEmpty } from '../../transport';

export async function handleTag(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const title = assertNonEmpty(this.getNodeParameter('title', itemIndex) as string, 'Title');
		const type = assertNonEmpty(this.getNodeParameter('type', itemIndex) as string, 'Type');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			title,
			type,
		};

		if (additionalFields.color !== undefined) body.color = additionalFields.color;
		if (additionalFields.group !== undefined) body.group = additionalFields.group;

		return xentralRequest.call(this, 'POST', 'tags', body, {}, 'v2');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);

		const response = await xentralRequest.call(this, 'GET', 'tags', {}, {}, 'v2');
		const items = (Array.isArray(response) ? response : (response as IDataObject).data || []) as IDataObject[];
		return limit ? items.slice(0, limit) : items;
	}

	throw new Error(`Unknown tag operation: ${operation}`);
}
