import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll } from '../../transport';

export async function handleCreditNote(
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

		if (additionalFields.documentDate) body.documentDate = additionalFields.documentDate;
		if (additionalFields.reason) body.reason = additionalFields.reason;
		if (additionalFields.headerText) body.headerText = additionalFields.headerText;
		if (additionalFields.footerText) body.footerText = additionalFields.footerText;
		if (additionalFields.internalNote) body.internalNote = additionalFields.internalNote;

		return xentralRequest.call(this, 'POST', 'creditNotes', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `creditNotes/${creditNoteId}`, {}, {}, 'v3');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const query: IDataObject = {};
		if (filters.status) query['filter[status]'] = filters.status;
		if (filters.customerId) query['filter[customerId]'] = filters.customerId;
		return xentralV3GetAll.call(this, 'creditNotes', query, limit);
	}

	if (operation === 'update') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `creditNotes/${creditNoteId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'delete') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `creditNotes/${creditNoteId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		const quantity = this.getNodeParameter('quantity', itemIndex) as number;
		const lineItemOptions = this.getNodeParameter('lineItemOptions', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			product: { id: productId },
			quantity,
		};

		if (lineItemOptions.unitPrice) body.unitPrice = lineItemOptions.unitPrice;
		if (lineItemOptions.discount) body.discount = lineItemOptions.discount;
		if (lineItemOptions.description) body.description = lineItemOptions.description;
		if (lineItemOptions.position) body.position = lineItemOptions.position;

		return xentralRequest.call(this, 'POST', `creditNotes/${creditNoteId}/lineitems`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'getLineItems') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `creditNotes/${creditNoteId}/lineitems`, {}, {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `creditNotes/${creditNoteId}/lineitems/${lineItemId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `creditNotes/${creditNoteId}/lineitems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `creditNotes/${creditNoteId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'cancel') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `creditNotes/${creditNoteId}/actions/cancel`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'send') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `creditNotes/${creditNoteId}/actions/send`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		const body = this.getNodeParameter('activityData', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `creditNotes/${creditNoteId}/actions/logactivity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `creditNotes/${creditNoteId}/actions/setwriteprotection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		return xentralRequest.call(this, 'PATCH', `creditNotes/${creditNoteId}/actions/removewriteprotection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		const body = this.getNodeParameter('fileData', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'POST', `creditNotes/${creditNoteId}/files`, body as IDataObject, {}, 'v3');
	}

	throw new Error(`Unknown creditNote operation: ${operation}`);
}
