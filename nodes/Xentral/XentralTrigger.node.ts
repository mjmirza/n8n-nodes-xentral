import { randomBytes } from 'crypto';

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
import { resolveSigningKey, verifyXentralSignature } from './trigger.signature';

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
					{ name: 'Analytics Document Extraction - Applied', value: 'analyticsDocumentExtraction.applied' },
					{ name: 'Analytics Document Extraction - Canceled', value: 'analyticsDocumentExtraction.canceled' },
					{ name: 'Autoshipment - Dispatched', value: 'autoshipment.dispatched' },
					{ name: 'Collective Bill - Created', value: 'collectiveBill.created' },
					{ name: 'Credit Note - Archived', value: 'creditNote.archived' },
					{ name: 'Credit Note - Canceled', value: 'creditNote.canceled' },
					{ name: 'Credit Note - Created (Unverified)', value: 'creditNote.created' },
					{ name: 'Credit Note - Deleted', value: 'creditNote.deleted' },
					{ name: 'Credit Note - Protocol Created', value: 'creditNote.protocolCreated' },
					{ name: 'Credit Note - Released', value: 'creditNote.released' },
					{ name: 'Credit Note - Sent', value: 'creditNote.sent' },
					{ name: 'Credit Note - Updated (Unverified)', value: 'creditNote.updated' },
					{ name: 'Customer - Created', value: 'customer.created' },
					{ name: 'Customer - Deleted', value: 'customer.deleted' },
					{ name: 'Customer - Updated', value: 'customer.updated' },
					{ name: 'DATEV - Exported', value: 'datev.exported' },
					{ name: 'Delivery Note - Archived', value: 'deliveryNote.archived' },
					{ name: 'Delivery Note - Canceled', value: 'deliveryNote.canceled' },
					{ name: 'Delivery Note - Created', value: 'deliveryNote.created' },
					{ name: 'Delivery Note - Deleted', value: 'deliveryNote.deleted' },
					{ name: 'Delivery Note - Protocol Created', value: 'deliveryNote.protocolCreated' },
					{ name: 'Delivery Note - Released', value: 'deliveryNote.released' },
					{ name: 'Delivery Note - Sent', value: 'deliveryNote.sent' },
					{ name: 'Delivery Note - Updated', value: 'deliveryNote.updated' },
					{ name: 'Dispatch Center - Order Processed', value: 'dispatchCenter.orderProcessed' },
					{ name: 'Dropshipping Supplier - Order Created', value: 'dropshippingSupplier.orderCreated' },
					{ name: 'Dropshipping Warehouse - Order Created', value: 'dropshippingWarehouse.orderCreated' },
					{ name: 'Dunning - Started', value: 'dunning.started' },
					{ name: 'Exporter - Executed', value: 'exporter.executed' },
					{ name: 'Extended Order Proposal - Executed', value: 'extendedOrderProposal.executed' },
					{ name: 'Goods Receipt - Completed', value: 'goodsReceipt.completed' },
					{ name: 'Goods Receipt - Created', value: 'goodsReceipt.created' },
					{ name: 'Goods Receipt - Deleted', value: 'goodsReceipt.deleted' },
					{ name: 'Goods Receipt - Updated', value: 'goodsReceipt.updated' },
					{ name: 'Importer - Executed', value: 'importer.executed' },
					{ name: 'Incoming Payments - Live Import', value: 'incomingPayments.liveImport' },
					{ name: 'Invoice - Archived', value: 'invoice.archived' },
					{ name: 'Invoice - Canceled', value: 'invoice.canceled' },
					{ name: 'Invoice - Created (Unverified)', value: 'invoice.created' },
					{ name: 'Invoice - Deleted', value: 'invoice.deleted' },
					{ name: 'Invoice - Protocol Created', value: 'invoice.protocolCreated' },
					{ name: 'Invoice - Released', value: 'invoice.released' },
					{ name: 'Invoice - Sent (Unverified)', value: 'invoice.sent' },
					{ name: 'Invoice - Updated (Unverified)', value: 'invoice.updated' },
					{ name: 'Liability - Canceled', value: 'liability.canceled' },
					{ name: 'Liability - Created', value: 'liability.created' },
					{ name: 'Liability - Deleted', value: 'liability.deleted' },
					{ name: 'Liability - Protocol Created', value: 'liability.protocolCreated' },
					{ name: 'Liability - Released', value: 'liability.released' },
					{ name: 'Liability - Updated', value: 'liability.updated' },
					{ name: 'Offer - Archived', value: 'offer.archived' },
					{ name: 'Offer - Canceled', value: 'offer.canceled' },
					{ name: 'Offer - Created', value: 'offer.created' },
					{ name: 'Offer - Deleted', value: 'offer.deleted' },
					{ name: 'Offer - Protocol Created', value: 'offer.protocolCreated' },
					{ name: 'Offer - Released', value: 'offer.released' },
					{ name: 'Offer - Sent', value: 'offer.sent' },
					{ name: 'Offer - Updated', value: 'offer.updated' },
					{ name: 'Order - Fetched', value: 'order.fetched' },
					{ name: 'Order Proposal - Executed', value: 'orderProposal.executed' },
					{ name: 'Outgoing Payment - Created', value: 'outgoingPayment.created' },
					{ name: 'Outgoing Payment - Executed', value: 'outgoingPayment.executed' },
					{ name: 'Payment List - Imported', value: 'paymentList.imported' },
					{ name: 'Picklist - Created', value: 'picklist.created' },
					{ name: 'Picklist - Generated', value: 'picklist.generated' },
					{ name: 'POS - Card Payment Captured', value: 'pos.cardPaymentCaptured' },
					{ name: 'POS - Order Created', value: 'pos.orderCreated' },
					{ name: 'POS - Transaction Created', value: 'pos.transactionCreated' },
					{ name: 'Product - Created', value: 'product.created' },
					{ name: 'Product - Deleted', value: 'product.deleted' },
					{ name: 'Product - Exported', value: 'product.exported' },
					{ name: 'Product - Imported', value: 'product.imported' },
					{ name: 'Product - Properties Created', value: 'product.propertiesCreated' },
					{ name: 'Product - Properties Deleted', value: 'product.propertiesDeleted' },
					{ name: 'Product - Properties Updated', value: 'product.propertiesUpdated' },
					{ name: 'Product - Pseudo Stock Updated', value: 'product.pseudoStockUpdated' },
					{ name: 'Product - Sync Started', value: 'product.syncStarted' },
					{ name: 'Product - Tags Replaced', value: 'product.tagsReplaced' },
					{ name: 'Product - Updated', value: 'product.updated' },
					{ name: 'Product - Variant Created', value: 'product.variantCreated' },
					{ name: 'Product Category - Created', value: 'productCategory.created' },
					{ name: 'Product Category - Deleted', value: 'productCategory.deleted' },
					{ name: 'Product Category - Updated', value: 'productCategory.updated' },
					{ name: 'Product Cross Selling - Created', value: 'productCrossSelling.created' },
					{ name: 'Product Cross Selling - Deleted', value: 'productCrossSelling.deleted' },
					{ name: 'Product Cross Selling - Updated', value: 'productCrossSelling.updated' },
					{ name: 'Product Media - Created', value: 'productMedia.Created' },
					{ name: 'Product Media - Deleted', value: 'productMedia.deleted' },
					{ name: 'Product Media - Updated', value: 'productMedia.updated' },
					{ name: 'Product Parts List Position - Created', value: 'productPartsListPosition.created' },
					{ name: 'Product Parts List Position - Deleted', value: 'productPartsListPosition.deleted' },
					{ name: 'Product Parts List Position - Updated', value: 'productPartsListPosition.updated' },
					{ name: 'Production - Canceled', value: 'production.canceled' },
					{ name: 'Production - Completed', value: 'production.completed' },
					{ name: 'Production - Created', value: 'production.created' },
					{ name: 'Production - Deleted', value: 'production.deleted' },
					{ name: 'Production - Protocol Created', value: 'production.protocolCreated' },
					{ name: 'Production - Released', value: 'production.released' },
					{ name: 'Production - Sent', value: 'production.sent' },
					{ name: 'Production - Started', value: 'production.started' },
					{ name: 'Production - Updated', value: 'production.updated' },
					{ name: 'Proforma Invoice - Archived', value: 'proformaInvoice.archived' },
					{ name: 'Proforma Invoice - Canceled', value: 'proformaInvoice.canceled' },
					{ name: 'Proforma Invoice - Created', value: 'proformaInvoice.created' },
					{ name: 'Proforma Invoice - Deleted', value: 'proformaInvoice.deleted' },
					{ name: 'Proforma Invoice - Protocol Created', value: 'proformaInvoice.protocolCreated' },
					{ name: 'Proforma Invoice - Released', value: 'proformaInvoice.released' },
					{ name: 'Proforma Invoice - Sent', value: 'proformaInvoice.sent' },
					{ name: 'Proforma Invoice - Updated', value: 'proformaInvoice.updated' },
					{ name: 'Project - Created', value: 'project.created' },
					{ name: 'Purchase Order - Archived', value: 'purchaseOrder.archived' },
					{ name: 'Purchase Order - Canceled', value: 'purchaseOrder.canceled' },
					{ name: 'Purchase Order - Created', value: 'purchaseOrder.created' },
					{ name: 'Purchase Order - Deleted', value: 'purchaseOrder.deleted' },
					{ name: 'Purchase Order - Goods Received', value: 'purchaseOrder.goodsReceived' },
					{ name: 'Purchase Order - Protocol Created', value: 'purchaseOrder.protocolCreated' },
					{ name: 'Purchase Order - Released', value: 'purchaseOrder.released' },
					{ name: 'Purchase Order - Sent', value: 'purchaseOrder.sent' },
					{ name: 'Purchase Order - Updated', value: 'purchaseOrder.updated' },
					{ name: 'Purchase Price - Created', value: 'purchasePrice.created' },
					{ name: 'Purchase Price - Deleted', value: 'purchasePrice.deleted' },
					{ name: 'Purchase Price - Updated', value: 'purchasePrice.updated' },
					{ name: 'Report - Exported', value: 'report.exported' },
					{ name: 'Report - Viewed', value: 'report.viewed' },
					{ name: 'Reservation - Changed', value: 'reservation.changed' },
					{ name: 'Return - Archived', value: 'return.archived' },
					{ name: 'Return - Canceled', value: 'return.canceled' },
					{ name: 'Return - Created', value: 'return.created' },
					{ name: 'Return - Deleted', value: 'return.deleted' },
					{ name: 'Return - Goods Received', value: 'return.goodsReceived' },
					{ name: 'Return - Protocol Created', value: 'return.protocolCreated' },
					{ name: 'Return - Released', value: 'return.released' },
					{ name: 'Return - Sent', value: 'return.sent' },
					{ name: 'Return - Updated', value: 'return.updated' },
					{ name: 'Sales Order - Archived', value: 'salesOrder.archived' },
					{ name: 'Sales Order - Created', value: 'salesOrder.created' },
					{ name: 'Sales Order - Deleted', value: 'salesOrder.deleted' },
					{ name: 'Sales Order - Dispatched', value: 'salesOrder.dispatched' },
					{ name: 'Sales Order - Imported', value: 'salesOrder.imported' },
					{ name: 'Sales Order - Protocol Created', value: 'salesOrder.protocolCreated' },
					{ name: 'Sales Order - Released', value: 'salesOrder.released' },
					{ name: 'Sales Order - Sent', value: 'salesOrder.sent' },
					{ name: 'Sales Order - Updated', value: 'salesOrder.updated' },
					{ name: 'Sales Order Position - Created', value: 'salesOrderPosition.created' },
					{ name: 'Sales Order Position - Deleted', value: 'salesOrderPosition.deleted' },
					{ name: 'Sales Order Position - Delivered', value: 'salesOrderPosition.delivered' },
					{ name: 'Sales Order Position - Updated', value: 'salesOrderPosition.updated' },
					{ name: 'Sales Order Reservation - Confirmed', value: 'salesOrderReservation.confirmed' },
					{ name: 'Sales Order Reservation - Created', value: 'salesOrderReservation.created' },
					{ name: 'Sales Order Reservation - Deleted', value: 'salesOrderReservation.deleted' },
					{ name: 'Sales Order Reservation - Updated', value: 'salesOrderReservation.updated' },
					{ name: 'Sales Price - Created', value: 'salesPrice.created' },
					{ name: 'Sales Price - Deleted', value: 'salesPrice.deleted' },
					{ name: 'Sales Price - Updated', value: 'salesPrice.updated' },
					{ name: 'Shipment - Created', value: 'shipment.created' },
					{ name: 'Shipment - Label Created', value: 'shipment.labelCreated' },
					{ name: 'Stock - Synchronized', value: 'stock.synchronized' },
					{ name: 'Storage Item - Movement', value: 'storageItem.movement' },
					{ name: 'Ticket - Received', value: 'ticket.received' },
					{ name: 'Ticket - Reply Sent', value: 'ticket.replySent' },
					{ name: 'Transfer - Job Error', value: 'transfer.jobError' },
					{ name: 'Transfer - Job Successful', value: 'transfer.jobSuccessful' },
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
							// Adopt it only when the stored key was issued for this exact webhook id. A key saved for an
							// older or different registration would make every delivery fail, so replace the webhook instead.
							const storedKey = typeof webhookData.signatureKey === 'string' ? webhookData.signatureKey : '';
							const ownsWebhook =
								storedKey.length >= 20 &&
								webhookData.webhookId !== undefined &&
								webhookData.webhookId !== null &&
								String(webhookData.webhookId) === String(webhook.id);
							if (!ownsWebhook) {
								try {
									assertSafeId(String(webhook.id), 'webhookId');
									await xentralRequest.call(this, 'DELETE', `webhooks/${webhook.id}`, {}, {}, 'v1');
								} catch (error) {
									this.logger.warn(`Xentral: could not remove a webhook without a known signing key. ${(error as Error).message}`);
								}
								delete webhookData.webhookId;
								delete webhookData.signatureKey;
								return false;
							}
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

		// RENAME_OK: verification moved into verifyXentralSignature (same names inside), not renamed.
		const webhookData = this.getWorkflowStaticData('node');
		const signatureKey = resolveSigningKey(this.getNodeParameter('signatureKey', '') as string, webhookData);
		const xentralSignature = (headers['xentral-signature'] as string) || '';
		const xentralTimestamp = (headers['xentral-request-timestamp'] as string) || '';
		const rawBody = req.rawBody?.toString() || JSON.stringify(body);
		const verdict = verifyXentralSignature(signatureKey, rawBody, xentralSignature, xentralTimestamp, Date.now());
		if (verdict !== 'ok') {
			// Fail closed. An unverifiable delivery never starts the workflow.
			this.getResponseObject().status(401).send('Unauthorized');
			return { noWebhookResponse: true };
		}

		return {
			workflowData: [this.helpers.returnJsonArray(body)],
		};
	}
}
