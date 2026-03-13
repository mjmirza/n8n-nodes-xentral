import { createHmac, timingSafeEqual } from 'crypto';

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

export class XentralTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Xentral Trigger',
		name: 'xentralTrigger',
		icon: 'file:xentral.svg',
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
					{ name: 'Sales Order - Created', value: 'salesOrder.created' },
					{ name: 'Sales Order - Updated', value: 'salesOrder.updated' },
					{ name: 'Sales Order - Deleted', value: 'salesOrder.deleted' },
					{ name: 'Sales Order - Sent', value: 'salesOrder.sent' },
					{ name: 'Sales Order - Imported', value: 'salesOrder.imported' },
					{ name: 'Sales Order - Released', value: 'salesOrder.released' },
					{ name: 'Sales Order - Dispatched', value: 'salesOrder.dispatched' },
					{ name: 'Sales Order - Archived', value: 'salesOrder.archived' },
					{ name: 'Sales Order - Protocol Created', value: 'salesOrder.protocolCreated' },
					// Sales Order Position events
					{ name: 'Sales Order Position - Created', value: 'salesOrderPosition.created' },
					{ name: 'Sales Order Position - Updated', value: 'salesOrderPosition.updated' },
					{ name: 'Sales Order Position - Deleted', value: 'salesOrderPosition.deleted' },
					{ name: 'Sales Order Position - Delivered', value: 'salesOrderPosition.delivered' },
					// Product events
					{ name: 'Product - Created', value: 'product.created' },
					{ name: 'Product - Updated', value: 'product.updated' },
					{ name: 'Product - Deleted', value: 'product.deleted' },
					{ name: 'Product - Properties Created', value: 'product.propertiesCreated' },
					{ name: 'Product - Properties Updated', value: 'product.propertiesUpdated' },
					{ name: 'Product - Properties Deleted', value: 'product.propertiesDeleted' },
					{ name: 'Product - Tags Replaced', value: 'product.tagsReplaced' },
					{ name: 'Product - Variant Created', value: 'product.variantCreated' },
					{ name: 'Product - Sync Started', value: 'product.syncStarted' },
					// Product Category events
					{ name: 'Product Category - Created', value: 'productCategory.created' },
					{ name: 'Product Category - Updated', value: 'productCategory.updated' },
					{ name: 'Product Category - Deleted', value: 'productCategory.deleted' },
					// Price events
					{ name: 'Sales Price - Created', value: 'salesPrice.created' },
					{ name: 'Sales Price - Updated', value: 'salesPrice.updated' },
					{ name: 'Sales Price - Deleted', value: 'salesPrice.deleted' },
					{ name: 'Purchase Price - Created', value: 'purchasePrice.created' },
					{ name: 'Purchase Price - Updated', value: 'purchasePrice.updated' },
					{ name: 'Purchase Price - Deleted', value: 'purchasePrice.deleted' },
					// Customer events
					{ name: 'Customer - Created', value: 'customer.created' },
					{ name: 'Customer - Updated', value: 'customer.updated' },
					{ name: 'Customer - Deleted', value: 'customer.deleted' },
					// Purchase Order events
					{ name: 'Purchase Order - Created', value: 'purchaseOrder.created' },
					{ name: 'Purchase Order - Updated', value: 'purchaseOrder.updated' },
					{ name: 'Purchase Order - Sent', value: 'purchaseOrder.sent' },
					{ name: 'Purchase Order - Released', value: 'purchaseOrder.released' },
					{ name: 'Purchase Order - Canceled', value: 'purchaseOrder.canceled' },
					{ name: 'Purchase Order - Archived', value: 'purchaseOrder.archived' },
					{ name: 'Purchase Order - Deleted', value: 'purchaseOrder.deleted' },
					{ name: 'Purchase Order - Protocol Created', value: 'purchaseOrder.protocolCreated' },
					// Return events
					{ name: 'Return - Created', value: 'return.created' },
					{ name: 'Return - Updated', value: 'return.updated' },
					{ name: 'Return - Released', value: 'return.released' },
					{ name: 'Return - Sent', value: 'return.sent' },
					{ name: 'Return - Archived', value: 'return.archived' },
					{ name: 'Return - Canceled', value: 'return.canceled' },
					// Delivery Note events
					{ name: 'Delivery Note - Created', value: 'deliveryNote.created' },
					{ name: 'Delivery Note - Updated', value: 'deliveryNote.updated' },
					{ name: 'Delivery Note - Released', value: 'deliveryNote.released' },
					{ name: 'Delivery Note - Sent', value: 'deliveryNote.sent' },
					{ name: 'Delivery Note - Archived', value: 'deliveryNote.archived' },
					// Invoice events (unconfirmed - may need verification)
					{ name: 'Invoice - Created', value: 'invoice.created' },
					{ name: 'Invoice - Updated', value: 'invoice.updated' },
					{ name: 'Invoice - Sent', value: 'invoice.sent' },
					// Credit Note events (unconfirmed - may need verification)
					{ name: 'Credit Note - Created', value: 'creditNote.created' },
					{ name: 'Credit Note - Updated', value: 'creditNote.updated' },
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
				description: 'Secret key for HMAC-SHA256 signature verification of incoming webhooks. If set, only verified payloads are accepted. Leave empty to auto-generate (Xentral will assign one).',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;

				try {
					const response = await xentralRequest.call(this, 'GET', 'webhooks', {}, {}, 'v1');
					const webhooks = (response.data as IDataObject[]) || [];

					for (const webhook of webhooks) {
						if (webhook.url === webhookUrl && webhook.event === event) {
							const webhookData = this.getWorkflowStaticData('node');
							webhookData.webhookId = webhook.id;
							return true;
						}
					}
				} catch (error: any) {
					// Webhook listing may fail, treat as not existing
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const signatureKey = this.getNodeParameter('signatureKey', '') as string;

				const body: IDataObject = {
					url: webhookUrl,
					event,
					active: true,
				};
				if (signatureKey) {
					body.signatureKey = signatureKey;
				}

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
					} catch (error: any) {
						// Log but don't fail - webhook may have been already deleted on Xentral side
						console.warn(`[Xentral] Failed to delete webhook ${webhookId}: ${error.message || 'unknown error'}`);
					}
				}

				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const headers = this.getHeaderData() as IDataObject;

		// Get signatureKey from static data (stored during webhook creation)
		const staticData = this.getWorkflowStaticData('node') as IDataObject;
		const signatureKey = (staticData.signatureKey as string) || '';

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
