import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmptyBody } from '../../transport';

export async function handleWebhook(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const url = this.getNodeParameter('url', itemIndex) as string;
		const events = this.getNodeParameter('events', itemIndex) as string[];
		const signatureKey = this.getNodeParameter('signatureKey', itemIndex, '') as string;

		const body: IDataObject = {
			url,
			events,
		};

		if (signatureKey) body.signatureKey = signatureKey;

		return xentralRequest.call(this, 'POST', 'webhooks', body, {}, 'v1');
	}

	if (operation === 'get') {
		const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
		assertSafeId(webhookId, 'webhookId');
		return xentralRequest.call(this, 'GET', `webhooks/${webhookId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'webhooks', {}, limit, maxPages);
	}

	if (operation === 'update') {
		const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
		assertSafeId(webhookId, 'webhookId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		if (updateFields.url !== undefined) body.url = updateFields.url;
		if (updateFields.events !== undefined) body.events = updateFields.events;
		if (updateFields.signatureKey !== undefined) body.signatureKey = updateFields.signatureKey;

		assertNonEmptyBody(body, 'webhook update');
		return xentralRequest.call(this, 'PATCH', `webhooks/${webhookId}`, body, {}, 'v1');
	}

	if (operation === 'delete') {
		const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
		assertSafeId(webhookId, 'webhookId');
		return xentralRequest.call(this, 'DELETE', `webhooks/${webhookId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown webhook operation: ${operation}`);
}
