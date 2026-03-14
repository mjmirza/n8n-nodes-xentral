import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmpty, assertNonEmptyBody } from '../../transport';

/**
 * Convert a comma-separated string of event IDs into the array-of-objects
 * format required by the Xentral webhook API: [{id: "com.xentral.salesOrder.created.v1"}, ...]
 */
function parseEventIds(eventsRaw: string): IDataObject[] {
	return eventsRaw
		.split(',')
		.map((e) => e.trim())
		.filter((e) => e.length > 0)
		.map((id) => ({ id }));
}

export async function handleWebhook(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = assertNonEmpty(this.getNodeParameter('name', itemIndex) as string, 'Name');
		const url = assertNonEmpty(this.getNodeParameter('url', itemIndex) as string, 'URL');
		const signatureKey = assertNonEmpty(this.getNodeParameter('signatureKey', itemIndex) as string, 'Signature Key');
		const eventsRaw = assertNonEmpty(this.getNodeParameter('events', itemIndex) as string, 'Event IDs');

		const events = parseEventIds(eventsRaw);
		if (events.length === 0) {
			throw new Error('At least one event ID is required');
		}

		const body: IDataObject = {
			name,
			url,
			signatureKey,
			events: events as unknown as IDataObject[],
		};

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

		if (updateFields.name !== undefined) body.name = updateFields.name;
		if (updateFields.url !== undefined) body.url = updateFields.url;
		if (updateFields.signatureKey !== undefined) body.signatureKey = updateFields.signatureKey;

		if (updateFields.events !== undefined) {
			const events = parseEventIds(updateFields.events as string);
			if (events.length === 0) {
				throw new Error('At least one event ID is required when updating events');
			}
			body.events = events as unknown as IDataObject[];
		}

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
