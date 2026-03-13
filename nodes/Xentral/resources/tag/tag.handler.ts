import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest } from '../../transport';

export async function handleTag(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const tagName = this.getNodeParameter('tagName', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const tagType = this.getNodeParameter('tagType', itemIndex, 'article') as string;

		const body: IDataObject = {
			title: tagName,
			type: tagType,
		};

		if (additionalFields.description !== undefined) body.description = additionalFields.description;

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
