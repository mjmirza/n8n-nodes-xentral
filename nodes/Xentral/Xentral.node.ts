import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

// --- Resource imports: operations ---
import { customerOperations } from './resources/customer/customer.operations';
import { productOperations } from './resources/product/product.operations';
import { offerOperations } from './resources/offer/offer.operations';
import { salesOrderOperations } from './resources/salesOrder/salesOrder.operations';
import { invoiceOperations } from './resources/invoice/invoice.operations';
import { creditNoteOperations } from './resources/creditNote/creditNote.operations';
import { deliveryNoteOperations } from './resources/deliveryNote/deliveryNote.operations';
import { purchaseOrderOperations } from './resources/purchaseOrder/purchaseOrder.operations';
import { returnOperations } from './resources/return/return.operations';
import { productionOperations } from './resources/production/production.operations';
import { supplierOperations } from './resources/supplier/supplier.operations';
import { warehouseOperations } from './resources/warehouse/warehouse.operations';
import { addressOperations } from './resources/address/address.operations';
import { contactOperations } from './resources/contact/contact.operations';
import { projectOperations } from './resources/project/project.operations';
import { paymentMethodOperations } from './resources/paymentMethod/paymentMethod.operations';
import { shippingMethodOperations } from './resources/shippingMethod/shippingMethod.operations';
import { webhookOperations } from './resources/webhook/webhook.operations';

// --- Resource imports: fields ---
import { customerFields } from './resources/customer/customer.fields';
import { productFields } from './resources/product/product.fields';
import { offerFields } from './resources/offer/offer.fields';
import { salesOrderFields } from './resources/salesOrder/salesOrder.fields';
import { invoiceFields } from './resources/invoice/invoice.fields';
import { creditNoteFields } from './resources/creditNote/creditNote.fields';
import { deliveryNoteFields } from './resources/deliveryNote/deliveryNote.fields';
import { purchaseOrderFields } from './resources/purchaseOrder/purchaseOrder.fields';
import { returnFields } from './resources/return/return.fields';
import { productionFields } from './resources/production/production.fields';
import { supplierFields } from './resources/supplier/supplier.fields';
import { warehouseFields } from './resources/warehouse/warehouse.fields';
import { addressFields } from './resources/address/address.fields';
import { contactFields } from './resources/contact/contact.fields';
import { projectFields } from './resources/project/project.fields';
import { paymentMethodFields } from './resources/paymentMethod/paymentMethod.fields';
import { shippingMethodFields } from './resources/shippingMethod/shippingMethod.fields';
import { webhookFields } from './resources/webhook/webhook.fields';

// --- Resource imports: handlers ---
import { handleCustomer } from './resources/customer/customer.handler';
import { handleProduct } from './resources/product/product.handler';
import { handleOffer } from './resources/offer/offer.handler';
import { handleSalesOrder } from './resources/salesOrder/salesOrder.handler';
import { handleInvoice } from './resources/invoice/invoice.handler';
import { handleCreditNote } from './resources/creditNote/creditNote.handler';
import { handleDeliveryNote } from './resources/deliveryNote/deliveryNote.handler';
import { handlePurchaseOrder } from './resources/purchaseOrder/purchaseOrder.handler';
import { handleReturn } from './resources/return/return.handler';
import { handleProduction } from './resources/production/production.handler';
import { handleSupplier } from './resources/supplier/supplier.handler';
import { handleWarehouse } from './resources/warehouse/warehouse.handler';
import { handleAddress } from './resources/address/address.handler';
import { handleContact } from './resources/contact/contact.handler';
import { handleProject } from './resources/project/project.handler';
import { handlePaymentMethod } from './resources/paymentMethod/paymentMethod.handler';
import { handleShippingMethod } from './resources/shippingMethod/shippingMethod.handler';
import { handleWebhook } from './resources/webhook/webhook.handler';

const resourceHandlers: Record<string, (this: IExecuteFunctions, op: string, i: number) => Promise<IDataObject | IDataObject[]>> = {
	customer: handleCustomer,
	product: handleProduct,
	offer: handleOffer,
	salesOrder: handleSalesOrder,
	invoice: handleInvoice,
	creditNote: handleCreditNote,
	deliveryNote: handleDeliveryNote,
	purchaseOrder: handlePurchaseOrder,
	return: handleReturn,
	production: handleProduction,
	supplier: handleSupplier,
	warehouse: handleWarehouse,
	address: handleAddress,
	contact: handleContact,
	project: handleProject,
	paymentMethod: handlePaymentMethod,
	shippingMethod: handleShippingMethod,
	webhook: handleWebhook,
};

export class Xentral implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Xentral',
		name: 'xentral',
		icon: 'file:xentral.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Xentral ERP API',
		defaults: {
			name: 'Xentral',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'xentralApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Address', value: 'address' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'Credit Note', value: 'creditNote' },
					{ name: 'Customer', value: 'customer' },
					{ name: 'Delivery Note', value: 'deliveryNote' },
					{ name: 'Invoice', value: 'invoice' },
					{ name: 'Offer', value: 'offer' },
					{ name: 'Payment Method', value: 'paymentMethod' },
					{ name: 'Production', value: 'production' },
					{ name: 'Product', value: 'product' },
					{ name: 'Project', value: 'project' },
					{ name: 'Purchase Order', value: 'purchaseOrder' },
					{ name: 'Return', value: 'return' },
					{ name: 'Sales Order', value: 'salesOrder' },
					{ name: 'Shipping Method', value: 'shippingMethod' },
					{ name: 'Supplier', value: 'supplier' },
					{ name: 'Warehouse', value: 'warehouse' },
					{ name: 'Webhook', value: 'webhook' },
				],
				default: 'customer',
			},
			// Operations
			...addressOperations,
			...contactOperations,
			...creditNoteOperations,
			...customerOperations,
			...deliveryNoteOperations,
			...invoiceOperations,
			...offerOperations,
			...paymentMethodOperations,
			...productionOperations,
			...productOperations,
			...projectOperations,
			...purchaseOrderOperations,
			...returnOperations,
			...salesOrderOperations,
			...shippingMethodOperations,
			...supplierOperations,
			...warehouseOperations,
			...webhookOperations,
			// Fields
			...addressFields,
			...contactFields,
			...creditNoteFields,
			...customerFields,
			...deliveryNoteFields,
			...invoiceFields,
			...offerFields,
			...paymentMethodFields,
			...productionFields,
			...productFields,
			...projectFields,
			...purchaseOrderFields,
			...returnFields,
			...salesOrderFields,
			...shippingMethodFields,
			...supplierFields,
			...warehouseFields,
			...webhookFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		const handler = resourceHandlers[resource];
		if (!handler) {
			throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
		}

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const result = await handler.call(this, operation, i);

				if (Array.isArray(result)) {
					returnData.push(...result.map((item) => ({ json: item })));
				} else {
					const data = result.data !== undefined ? result.data : result;
					if (Array.isArray(data)) {
						returnData.push(...(data as IDataObject[]).map((item: IDataObject) => ({ json: item })));
					} else {
						returnData.push({ json: data as IDataObject });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
