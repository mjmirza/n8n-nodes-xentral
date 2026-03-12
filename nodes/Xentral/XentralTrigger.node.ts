import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { xentralRequest } from './transport';

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
					{ name: 'Sales Order - Released', value: 'salesOrder.released' },
					{ name: 'Sales Order - Dispatched', value: 'salesOrder.dispatched' },
					{ name: 'Sales Order - Archived', value: 'salesOrder.archived' },
					{ name: 'Sales Order - Imported', value: 'salesOrder.imported' },
					// Product events
					{ name: 'Product - Created', value: 'product.created' },
					{ name: 'Product - Updated', value: 'product.updated' },
					{ name: 'Product - Deleted', value: 'product.deleted' },
					// Customer events
					{ name: 'Customer - Created', value: 'customer.created' },
					{ name: 'Customer - Updated', value: 'customer.updated' },
					{ name: 'Customer - Deleted', value: 'customer.deleted' },
					// Purchase Order events
					{ name: 'Purchase Order - Created', value: 'purchaseOrder.created' },
					{ name: 'Purchase Order - Updated', value: 'purchaseOrder.updated' },
					{ name: 'Purchase Order - Released', value: 'purchaseOrder.released' },
					{ name: 'Purchase Order - Canceled', value: 'purchaseOrder.canceled' },
					// Return events
					{ name: 'Return - Created', value: 'return.created' },
					{ name: 'Return - Updated', value: 'return.updated' },
					{ name: 'Return - Released', value: 'return.released' },
					// Delivery Note events
					{ name: 'Delivery Note - Created', value: 'deliveryNote.created' },
					{ name: 'Delivery Note - Updated', value: 'deliveryNote.updated' },
					{ name: 'Delivery Note - Released', value: 'deliveryNote.released' },
					// Price events
					{ name: 'Sales Price - Updated', value: 'salesPrice.updated' },
					{ name: 'Purchase Price - Updated', value: 'purchasePrice.updated' },
				],
				description: 'The Xentral event to listen for',
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
				} catch {
					// Webhook listing may fail, treat as not existing
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;

				const body: IDataObject = {
					url: webhookUrl,
					event,
					active: true,
				};

				try {
					const response = await xentralRequest.call(this, 'POST', 'webhooks', body, {}, 'v1');
					const webhookData = this.getWorkflowStaticData('node');
					webhookData.webhookId = (response.data as IDataObject)?.id || response.id;
					return true;
				} catch {
					return false;
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookId = webhookData.webhookId as string;

				if (webhookId) {
					try {
						await xentralRequest.call(this, 'DELETE', `webhooks/${webhookId}`, {}, {}, 'v1');
					} catch {
						// Ignore deletion errors
					}
				}

				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData() as IDataObject;

		return {
			workflowData: [
				this.helpers.returnJsonArray(body),
			],
		};
	}
}
