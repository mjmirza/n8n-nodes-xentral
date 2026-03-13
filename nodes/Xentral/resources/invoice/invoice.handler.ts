import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll } from '../../transport';

export async function handleInvoice(
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
		if (additionalFields.dueDate !== undefined) body.dueDate = additionalFields.dueDate;
		if (additionalFields.paymentTerm !== undefined) body.paymentTerm = additionalFields.paymentTerm;
		if (additionalFields.headerText !== undefined) body.headerText = additionalFields.headerText;
		if (additionalFields.footerText !== undefined) body.footerText = additionalFields.footerText;
		if (additionalFields.internalNote !== undefined) body.internalNote = additionalFields.internalNote;

		return xentralRequest.call(this, 'POST', 'invoices', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `invoices/${invoiceId}`, {}, {}, 'v3');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const query: IDataObject = {};
		if (filters.status !== undefined) query['filter[status]'] = filters.status;
		if (filters.customerId !== undefined) query['filter[customerId]'] = filters.customerId;
		if (filters.createdAfter !== undefined) query['filter[createdAfter]'] = filters.createdAfter;
		return xentralV3GetAll.call(this, 'invoices', query, limit);
	}

	if (operation === 'update') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `invoices/${invoiceId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'delete') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `invoices/${invoiceId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
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

		return xentralRequest.call(this, 'POST', `invoices/${invoiceId}/lineItems`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `invoices/${invoiceId}/lineItems/${lineItemId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `invoices/${invoiceId}/lineItems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const invoiceId = this.getNodeParameter('invoiceId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `invoices/${invoiceId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	throw new Error(`Unknown invoice operation: ${operation}`);
}
