import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, assertSafeId, assertNonEmpty, assertNonEmptyBody } from '../../transport';

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
		// Not paginated in the spec. One request returns the whole list, so Max Pages has no effect.
		const response = await xentralRequest.call(this, 'GET', 'webhooks', {}, {}, 'v1');
		const rows = (Array.isArray(response) ? response : response?.data ?? []) as IDataObject[];
		return limit ? rows.slice(0, limit) : rows;
	}

	if (operation === 'update') {
		const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
		assertSafeId(webhookId, 'webhookId');

		const name = assertNonEmpty(this.getNodeParameter('name', itemIndex) as string, 'Name');
		const url = assertNonEmpty(this.getNodeParameter('url', itemIndex) as string, 'URL');
		const eventsRaw = assertNonEmpty(this.getNodeParameter('events', itemIndex) as string, 'Event IDs');

		const events = parseEventIds(eventsRaw);
		if (events.length === 0) {
			throw new Error('At least one event ID is required when updating events');
		}

		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			name,
			url,
			events: events as unknown as IDataObject[],
		};

		if (updateFields.signatureKey !== undefined) body.signatureKey = updateFields.signatureKey;

		return xentralRequest.call(this, 'PATCH', `webhooks/${webhookId}`, body, {}, 'v1');
	}

	if (operation === 'delete') {
		const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
		assertSafeId(webhookId, 'webhookId');
		return xentralRequest.call(this, 'DELETE', `webhooks/${webhookId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown webhook operation: ${operation}`);
}
