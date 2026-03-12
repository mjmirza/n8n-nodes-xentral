import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleWebhook(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const url = this.getNodeParameter('url', itemIndex) as string;
		const event = this.getNodeParameter('event', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			url,
			event,
			active: additionalFields.active !== undefined ? additionalFields.active : true,
		};

		return xentralRequest.call(this, 'POST', 'webhooks', body, {}, 'v1');
	}

	if (operation === 'get') {
		const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `webhooks/${webhookId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'webhooks', {}, limit);
	}

	if (operation === 'update') {
		const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		if (updateFields.url) body.url = updateFields.url;
		if (updateFields.event) body.event = updateFields.event;
		if (updateFields.active !== undefined) body.active = updateFields.active;

		return xentralRequest.call(this, 'PATCH', `webhooks/${webhookId}`, body, {}, 'v1');
	}

	if (operation === 'delete') {
		const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `webhooks/${webhookId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown webhook operation: ${operation}`);
}
