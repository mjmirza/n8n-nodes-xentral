import type {
	ICredentialTestFunctions,
	ICredentialsDecrypted,
	IExecuteFunctions,
	INodeCredentialTestResult,
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
import { storageLocationOperations } from './resources/storageLocation/storageLocation.operations';
import { proformaInvoiceOperations } from './resources/proformaInvoice/proformaInvoice.operations';
import { liabilityOperations } from './resources/liability/liability.operations';
import { shipmentOperations } from './resources/shipment/shipment.operations';
import { paymentTermsGroupOperations } from './resources/paymentTermsGroup/paymentTermsGroup.operations';
import { goodsReceiptOperations } from './resources/goodsReceipt/goodsReceipt.operations';
import { salesPriceOperations } from './resources/salesPrice/salesPrice.operations';
import { purchasePriceOperations } from './resources/purchasePrice/purchasePrice.operations';
import { deliveryTermsOperations } from './resources/deliveryTerms/deliveryTerms.operations';
import { employeeOperations } from './resources/employee/employee.operations';
import { salesChannelOperations } from './resources/salesChannel/salesChannel.operations';
import { tagOperations } from './resources/tag/tag.operations';

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
import { storageLocationFields } from './resources/storageLocation/storageLocation.fields';
import { proformaInvoiceFields } from './resources/proformaInvoice/proformaInvoice.fields';
import { liabilityFields } from './resources/liability/liability.fields';
import { shipmentFields } from './resources/shipment/shipment.fields';
import { paymentTermsGroupFields } from './resources/paymentTermsGroup/paymentTermsGroup.fields';
import { goodsReceiptFields } from './resources/goodsReceipt/goodsReceipt.fields';
import { salesPriceFields } from './resources/salesPrice/salesPrice.fields';
import { purchasePriceFields } from './resources/purchasePrice/purchasePrice.fields';
import { deliveryTermsFields } from './resources/deliveryTerms/deliveryTerms.fields';
import { employeeFields } from './resources/employee/employee.fields';
import { salesChannelFields } from './resources/salesChannel/salesChannel.fields';
import { tagFields } from './resources/tag/tag.fields';

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
import { handleStorageLocation } from './resources/storageLocation/storageLocation.handler';
import { handleProformaInvoice } from './resources/proformaInvoice/proformaInvoice.handler';
import { handleLiability } from './resources/liability/liability.handler';
import { handleShipment } from './resources/shipment/shipment.handler';
import { handlePaymentTermsGroup } from './resources/paymentTermsGroup/paymentTermsGroup.handler';
import { handleGoodsReceipt } from './resources/goodsReceipt/goodsReceipt.handler';
import { handleSalesPrice } from './resources/salesPrice/salesPrice.handler';
import { handlePurchasePrice } from './resources/purchasePrice/purchasePrice.handler';
import { handleDeliveryTerms } from './resources/deliveryTerms/deliveryTerms.handler';
import { handleEmployee } from './resources/employee/employee.handler';
import { handleSalesChannel } from './resources/salesChannel/salesChannel.handler';
import { handleTag } from './resources/tag/tag.handler';

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
	storageLocation: handleStorageLocation,
	proformaInvoice: handleProformaInvoice,
	liability: handleLiability,
	shipment: handleShipment,
	paymentTermsGroup: handlePaymentTermsGroup,
	goodsReceipt: handleGoodsReceipt,
	salesPrice: handleSalesPrice,
	purchasePrice: handlePurchasePrice,
	deliveryTerms: handleDeliveryTerms,
	employee: handleEmployee,
	salesChannel: handleSalesChannel,
	tag: handleTag,
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
				testedBy: 'xentralApiTest',
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
					{ name: 'Delivery Terms', value: 'deliveryTerms' },
					{ name: 'Employee', value: 'employee' },
					{ name: 'Goods Receipt', value: 'goodsReceipt' },
					{ name: 'Invoice', value: 'invoice' },
					{ name: 'Liability', value: 'liability' },
					{ name: 'Offer', value: 'offer' },
					{ name: 'Payment Method', value: 'paymentMethod' },
					{ name: 'Payment Terms Group', value: 'paymentTermsGroup' },
					{ name: 'Production', value: 'production' },
					{ name: 'Product', value: 'product' },
					{ name: 'Proforma Invoice', value: 'proformaInvoice' },
					{ name: 'Project', value: 'project' },
					{ name: 'Purchase Order', value: 'purchaseOrder' },
					{ name: 'Purchase Price', value: 'purchasePrice' },
					{ name: 'Return', value: 'return' },
					{ name: 'Sales Channel', value: 'salesChannel' },
					{ name: 'Sales Order', value: 'salesOrder' },
					{ name: 'Sales Price', value: 'salesPrice' },
					{ name: 'Shipment', value: 'shipment' },
					{ name: 'Shipping Method', value: 'shippingMethod' },
					{ name: 'Storage Location', value: 'storageLocation' },
					{ name: 'Supplier', value: 'supplier' },
					{ name: 'Tag', value: 'tag' },
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
			...storageLocationOperations,
			...proformaInvoiceOperations,
			...liabilityOperations,
			...shipmentOperations,
			...paymentTermsGroupOperations,
			...goodsReceiptOperations,
			...salesPriceOperations,
			...purchasePriceOperations,
			...deliveryTermsOperations,
			...employeeOperations,
			...salesChannelOperations,
			...tagOperations,
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
			...storageLocationFields,
			...proformaInvoiceFields,
			...liabilityFields,
			...shipmentFields,
			...paymentTermsGroupFields,
			...goodsReceiptFields,
			...salesPriceFields,
			...purchasePriceFields,
			...deliveryTermsFields,
			...employeeFields,
			...salesChannelFields,
			...tagFields,
		],
	};

	methods = {
		credentialTest: {
			async xentralApiTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const { instanceUrl, accessToken } = (credential.data || {}) as {
					instanceUrl: string;
					accessToken: string;
				};

				let url = (instanceUrl || '').trim().replace(/\/+$/, '');
				if (/^http:\/\//i.test(url)) {
					return { status: 'Error', message: 'HTTP is not allowed, use HTTPS' };
				}
				if (!/^https:\/\//i.test(url)) {
					url = 'https://' + url;
				}

				// SSRF protection
				try {
					const parsed = new URL(url);
					const hostname = parsed.hostname.toLowerCase();
					if (
						hostname === 'localhost' ||
						hostname === '0.0.0.0' ||
						hostname === '0' ||
						/^127\./.test(hostname) ||
						/^10\./.test(hostname) ||
						/^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
						/^192\.168\./.test(hostname) ||
						/^169\.254\./.test(hostname) ||
						hostname === '::1' ||
						hostname.startsWith('[')
					) {
						return { status: 'Error', message: 'Connections to internal network addresses are not allowed' };
					}
				} catch {
					return { status: 'Error', message: 'Invalid Xentral instance URL' };
				}

				const token = (accessToken || '').replace(/\s/g, '');
				if (!token) {
					return { status: 'Error', message: 'Access Token is required' };
				}

				try {
					await this.helpers.request({
						method: 'GET',
						url: `${url}/api/v1/customers`,
						headers: {
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						json: true,
					});
					return { status: 'OK', message: 'Connection successful' };
				} catch (error: any) {
					const msg = error.message || 'Unknown error';
					return { status: 'Error', message: `Connection failed: ${msg}` };
				}
			},
		},
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

				if (result == null || (result as unknown) === '' || typeof result !== 'object') {
					returnData.push({ json: { success: true } });
				} else if (Array.isArray(result)) {
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
