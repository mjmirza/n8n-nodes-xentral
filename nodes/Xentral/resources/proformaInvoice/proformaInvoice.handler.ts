import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll, xentralFileUpload } from '../../transport';

export async function handleProformaInvoice(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		const language = this.getNodeParameter('language', itemIndex, 'de') as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			address: { id: customerId },
			language,
		};

		if (additionalFields.documentDate !== undefined) body.documentDate = additionalFields.documentDate;
		if (additionalFields.deliveryTime !== undefined) body.deliveryTime = additionalFields.deliveryTime;
		if (additionalFields.paymentTerm !== undefined) body.paymentTerm = additionalFields.paymentTerm;
		if (additionalFields.shippingMethod !== undefined) body.shippingMethod = additionalFields.shippingMethod;
		if (additionalFields.shippingCost !== undefined) body.shippingCost = additionalFields.shippingCost;
		if (additionalFields.internalNote !== undefined) body.internalNote = additionalFields.internalNote;
		if (additionalFields.headerText !== undefined) body.headerText = additionalFields.headerText;
		if (additionalFields.footerText !== undefined) body.footerText = additionalFields.footerText;

		return xentralRequest.call(this, 'POST', 'proformainvoices', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `proformainvoices/${proformaInvoiceId}`, {}, {}, 'v3');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const query: IDataObject = {};
		if (filters.status !== undefined) query['filter[status]'] = filters.status;
		if (filters.customerId !== undefined) query['filter[customerId]'] = filters.customerId;
		return xentralV3GetAll.call(this, 'proformainvoices', query, limit);
	}

	if (operation === 'update') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `proformainvoices/${proformaInvoiceId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'delete') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `proformainvoices/${proformaInvoiceId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		const quantity = this.getNodeParameter('quantity', itemIndex) as number;
		const lineItemOptions = this.getNodeParameter('lineItemOptions', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			product: { id: productId },
			quantity,
		};

		if (lineItemOptions.unitPrice !== undefined) body.unitPrice = lineItemOptions.unitPrice;
		if (lineItemOptions.discount !== undefined) body.discount = lineItemOptions.discount;
		if (lineItemOptions.description !== undefined) body.description = lineItemOptions.description;
		if (lineItemOptions.position !== undefined) body.position = lineItemOptions.position;

		return xentralRequest.call(this, 'POST', `proformainvoices/${proformaInvoiceId}/lineItems`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `proformainvoices/${proformaInvoiceId}/lineItems/${lineItemId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `proformainvoices/${proformaInvoiceId}/lineItems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `proformainvoices/${proformaInvoiceId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'cancel') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `proformainvoices/${proformaInvoiceId}/actions/cancel`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'send') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `proformainvoices/${proformaInvoiceId}/actions/send`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		const body = this.getNodeParameter('activityData', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `proformainvoices/${proformaInvoiceId}/actions/log-activity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `proformainvoices/${proformaInvoiceId}/actions/set-write-protection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `proformainvoices/${proformaInvoiceId}/actions/remove-write-protection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
		return xentralFileUpload.call(this, `proformainvoices/${proformaInvoiceId}/files`, binaryPropertyName, itemIndex);
	}

	throw new Error(`Unknown proformaInvoice operation: ${operation}`);
}
