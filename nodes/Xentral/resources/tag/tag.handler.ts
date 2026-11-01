import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, assertNonEmpty, xentralV1PageGetAll } from '../../transport';

// The API wants #RRGGBB. A bare six digit hex value gets the # added.
function tagColor(value: unknown): string {
	const v = String(value).trim();
	return /^[0-9A-Fa-f]{6}$/.test(v) ? `#${v}` : v;
}

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

		if (additionalFields.color !== undefined && additionalFields.color !== '') body.color = tagColor(additionalFields.color);
		if (additionalFields.group !== undefined) body.group = additionalFields.group;

		return xentralRequest.call(this, 'POST', 'tags', body, {}, 'v2');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);

		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'tags', {}, limit, maxPages, 'v2');
	}

	throw new Error(`Unknown tag operation: ${operation}`);
}
