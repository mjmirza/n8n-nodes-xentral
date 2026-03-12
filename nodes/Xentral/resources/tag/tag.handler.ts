import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleTag(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('name', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			name,
			type: additionalFields.type || undefined,
		};

		// Clean undefined
		Object.keys(body).forEach((key) => {
			if (body[key] === undefined) delete body[key];
		});

		return xentralRequest.call(this, 'POST', 'tag', body as IDataObject, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'tag', {}, limit);
	}

	if (operation === 'delete') {
		const tagId = this.getNodeParameter('tagId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', 'tag/batch', { ids: [tagId] } as unknown as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown tag operation: ${operation}`);
}
