import { createHmac, timingSafeEqual, randomBytes } from 'crypto';

import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { xentralRequest, assertSafeId } from './transport';

/**
 * Convert a short event name (e.g. "salesOrder.created") to the full
 * Xentral webhook event ID format: "com.xentral.salesOrder.created.v1"
 */
function toEventId(shortName: string): string {
	if (shortName.startsWith('com.xentral.')) return shortName;
	return `com.xentral.${shortName}.v1`;
}

/**
 * Generate a random signature key (32 alphanumeric characters).
 * The Xentral API requires signatureKey with minLength 20.
 */
function generateSignatureKey(): string {
	return randomBytes(24).toString('base64url').slice(0, 32);
}

export class XentralTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Xentral Trigger',
		name: 'xentralTrigger',
		icon: { light: 'file:xentral.svg', dark: 'file:xentral.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when a Xentral event occurs',
		defaults: {
			name: 'Xentral Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'xentralApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'salesOrder.created',
				options: [
					// Sales Order events
					{ name: 'Credit Note - Created (Unverified)', value: 'creditNote.created' },
					{ name: 'Credit Note - Updated (Unverified)', value: 'creditNote.updated' },
					{ name: 'Customer - Created', value: 'customer.created' },
					{ name: 'Customer - Deleted', value: 'customer.deleted' },
					{ name: 'Customer - Updated', value: 'customer.updated' },
					{ name: 'Delivery Note - Archived', value: 'deliveryNote.archived' },
					{ name: 'Delivery Note - Created', value: 'deliveryNote.created' },
					{ name: 'Delivery Note - Released', value: 'deliveryNote.released' },
					{ name: 'Delivery Note - Sent', value: 'deliveryNote.sent' },
					// Sales Order Position events
					{ name: 'Delivery Note - Updated', value: 'deliveryNote.updated' },
					{ name: 'Goods Receipt - Completed', value: 'goodsReceipt.completed' },
					{ name: 'Goods Receipt - Created', value: 'goodsReceipt.created' },
					{ name: 'Goods Receipt - Deleted', value: 'goodsReceipt.deleted' },
					// Product events
					{ name: 'Goods Receipt - Updated', value: 'goodsReceipt.updated' },
					{ name: 'Invoice - Created (Unverified)', value: 'invoice.created' },
					{ name: 'Invoice - Sent (Unverified)', value: 'invoice.sent' },
					{ name: 'Invoice - Updated (Unverified)', value: 'invoice.updated' },
					{ name: 'Product - Created', value: 'product.created' },
					{ name: 'Product - Deleted', value: 'product.deleted' },
					{ name: 'Product - Properties Created', value: 'product.propertiesCreated' },
					{ name: 'Product - Properties Deleted', value: 'product.propertiesDeleted' },
					{ name: 'Product - Properties Updated', value: 'product.propertiesUpdated' },
					// Product Category events
					{ name: 'Product - Sync Started', value: 'product.syncStarted' },
					{ name: 'Product - Tags Replaced', value: 'product.tagsReplaced' },
					{ name: 'Product - Updated', value: 'product.updated' },
					// Price events
					{ name: 'Product - Variant Created', value: 'product.variantCreated' },
					{ name: 'Product Category - Created', value: 'productCategory.created' },
					{ name: 'Product Category - Deleted', value: 'productCategory.deleted' },
					{ name: 'Product Category - Updated', value: 'productCategory.updated' },
					{ name: 'Production - Canceled', value: 'production.canceled' },
					{ name: 'Production - Completed', value: 'production.completed' },
					// Customer events
					{ name: 'Production - Created', value: 'production.created' },
					{ name: 'Production - Deleted', value: 'production.deleted' },
					{ name: 'Production - Released', value: 'production.released' },
					// Purchase Order events
					{ name: 'Production - Started', value: 'production.started' },
					{ name: 'Production - Updated', value: 'production.updated' },
					{ name: 'Purchase Order - Archived', value: 'purchaseOrder.archived' },
					{ name: 'Purchase Order - Canceled', value: 'purchaseOrder.canceled' },
					{ name: 'Purchase Order - Created', value: 'purchaseOrder.created' },
					{ name: 'Purchase Order - Deleted', value: 'purchaseOrder.deleted' },
					{ name: 'Purchase Order - Protocol Created', value: 'purchaseOrder.protocolCreated' },
					{ name: 'Purchase Order - Released', value: 'purchaseOrder.released' },
					// Return events
					{ name: 'Purchase Order - Sent', value: 'purchaseOrder.sent' },
					{ name: 'Purchase Order - Updated', value: 'purchaseOrder.updated' },
					{ name: 'Purchase Price - Created', value: 'purchasePrice.created' },
					{ name: 'Purchase Price - Deleted', value: 'purchasePrice.deleted' },
					{ name: 'Purchase Price - Updated', value: 'purchasePrice.updated' },
					{ name: 'Return - Archived', value: 'return.archived' },
					// Delivery Note events
					{ name: 'Return - Canceled', value: 'return.canceled' },
					{ name: 'Return - Created', value: 'return.created' },
					{ name: 'Return - Released', value: 'return.released' },
					{ name: 'Return - Sent', value: 'return.sent' },
					{ name: 'Return - Updated', value: 'return.updated' },
					// Invoice events (unverified - may not be supported by all Xentral instances)
					{ name: 'Sales Order - Archived', value: 'salesOrder.archived' },
					{ name: 'Sales Order - Created', value: 'salesOrder.created' },
					{ name: 'Sales Order - Deleted', value: 'salesOrder.deleted' },
					// Credit Note events (unverified - may not be supported by all Xentral instances)
					{ name: 'Sales Order - Dispatched', value: 'salesOrder.dispatched' },
					{ name: 'Sales Order - Imported', value: 'salesOrder.imported' },
					// Goods Receipt events (added 2026-03-18 — Xentral API update)
					{ name: 'Sales Order - Protocol Created', value: 'salesOrder.protocolCreated' },
					{ name: 'Sales Order - Released', value: 'salesOrder.released' },
					{ name: 'Sales Order - Sent', value: 'salesOrder.sent' },
					{ name: 'Sales Order - Updated', value: 'salesOrder.updated' },
					// Production events (added 2026-03-18 — Xentral API update)
					{ name: 'Sales Order Position - Created', value: 'salesOrderPosition.created' },
					{ name: 'Sales Order Position - Deleted', value: 'salesOrderPosition.deleted' },
					{ name: 'Sales Order Position - Delivered', value: 'salesOrderPosition.delivered' },
					{ name: 'Sales Order Position - Updated', value: 'salesOrderPosition.updated' },
					{ name: 'Sales Order Reservation - Confirmed', value: 'salesOrderReservation.confirmed' },
					{ name: 'Sales Order Reservation - Created', value: 'salesOrderReservation.created' },
					{ name: 'Sales Order Reservation - Deleted', value: 'salesOrderReservation.deleted' },
					// Customer Order Reservation events (added 2026-03-18 — Xentral API update)
					{ name: 'Sales Order Reservation - Updated', value: 'salesOrderReservation.updated' },
					{ name: 'Sales Price - Created', value: 'salesPrice.created' },
					{ name: 'Sales Price - Deleted', value: 'salesPrice.deleted' },
					{ name: 'Sales Price - Updated', value: 'salesPrice.updated' },
				],
				description: 'The Xentral event to listen for',
			},
			{
				displayName: 'Signature Key',
				name: 'signatureKey',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Secret key (min 20 chars) for HMAC-SHA256 signature verification of incoming webhooks. Leave empty to auto-generate a random key.',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const eventId = toEventId(event);

				try {
					const response = await xentralRequest.call(this, 'GET', 'webhooks', {}, {}, 'v1');
					const webhooks = (response.data as IDataObject[]) || [];

					for (const webhook of webhooks) {
						if (webhook.url !== webhookUrl) continue;
						// Check if the webhook's events array contains our event
						const events = (webhook.events as IDataObject[]) || [];
						const hasEvent = events.some((e) => e.id === eventId);
						if (hasEvent) {
							const webhookData = this.getWorkflowStaticData('node');
							webhookData.webhookId = webhook.id;
							return true;
						}
					}
				} catch (error) {
					// Listing can fail (missing scope, transient error). Treat as not existing so n8n creates it.
					this.logger.warn(`Xentral: could not list webhooks, a new one will be created. ${(error as Error).message}`);
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const eventId = toEventId(event);
				let signatureKey = (this.getNodeParameter('signatureKey', '') as string) || '';

				// API requires signatureKey (minLength 20) - auto-generate if not provided
				if (!signatureKey || signatureKey.length < 20) {
					signatureKey = generateSignatureKey();
				}

				const body: IDataObject = {
					name: `n8n-${event}`,
					url: webhookUrl,
					signatureKey,
					events: [{ id: eventId }],
				};

				const response = await xentralRequest.call(this, 'POST', 'webhooks', body, {}, 'v1');
				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = (response.data as IDataObject)?.id || response.id;
				webhookData.signatureKey = signatureKey;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookId = webhookData.webhookId as string;

				if (webhookId) {
					try {
						assertSafeId(webhookId, 'webhookId');
						await xentralRequest.call(this, 'DELETE', `webhooks/${webhookId}`, {}, {}, 'v1');
					} catch (error) {
						// The webhook may already be gone on the Xentral side, so deactivation must not fail.
						this.logger.warn(
							`Xentral: failed to delete webhook ${webhookId}. ${(error as Error).message || 'unknown error'}`,
						);
					}
				}

				delete webhookData.webhookId;
				delete webhookData.signatureKey;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const headers = this.getHeaderData() as IDataObject;

		// Read signatureKey from node parameters first, fall back to staticData (auto-generated keys)
		let signatureKey = (this.getNodeParameter('signatureKey', '') as string) || '';
		if (!signatureKey) {
			const webhookData = this.getWorkflowStaticData('node');
			signatureKey = (webhookData.signatureKey as string) || '';
		}

		if (signatureKey) {
			const xentralSignature = (headers['xentral-signature'] as string) || '';
			const xentralTimestamp = (headers['xentral-request-timestamp'] as string) || '';

			if (!xentralSignature || !xentralTimestamp) {
				return { workflowData: [] };
			}

			const rawBody = req.rawBody?.toString() || JSON.stringify(body);
			const message = rawBody + xentralTimestamp;
			const expected = createHmac('sha256', signatureKey)
				.update(message)
				.digest('hex');

			try {
				const sigBuffer = Buffer.from(xentralSignature, 'hex');
				const expectedBuffer = Buffer.from(expected, 'hex');
				if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
					return { workflowData: [] };
				}
			} catch {
				return { workflowData: [] };
			}
		}

		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
