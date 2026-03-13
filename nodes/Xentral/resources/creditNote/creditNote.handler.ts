import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll, xentralFileUpload, assertSafeId } from '../../transport';

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

		if (additionalFields.documentDate !== undefined) body.documentDate = additionalFields.documentDate;
		if (additionalFields.reason !== undefined) body.reason = additionalFields.reason;
		if (additionalFields.headerText !== undefined) body.headerText = additionalFields.headerText;
		if (additionalFields.footerText !== undefined) body.footerText = additionalFields.footerText;
		if (additionalFields.internalNote !== undefined) body.internalNote = additionalFields.internalNote;

		return xentralRequest.call(this, 'POST', 'creditnotes', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		return xentralRequest.call(this, 'GET', `creditnotes/${creditNoteId}`, {}, {}, 'v3');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;
		const query: IDataObject = {};
		let filterIndex = 0;
		if (filters.status !== undefined && filters.status !== '') {
			query[`filter[${filterIndex}][key]`] = 'status';
			query[`filter[${filterIndex}][op]`] = 'equals';
			query[`filter[${filterIndex}][value]`] = filters.status;
			filterIndex++;
		}
		if (filters.customerId !== undefined && filters.customerId !== '') {
			query[`filter[${filterIndex}][key]`] = 'customerId';
			query[`filter[${filterIndex}][op]`] = 'equals';
			query[`filter[${filterIndex}][value]`] = filters.customerId;
			filterIndex++;
		}
		return xentralV3GetAll.call(this, 'creditnotes', query, limit, maxPages);
	}

	if (operation === 'update') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `creditnotes/${creditNoteId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'delete') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		return xentralRequest.call(this, 'DELETE', `creditnotes/${creditNoteId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
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

		return xentralRequest.call(this, 'POST', `creditnotes/${creditNoteId}/lineItems`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `creditnotes/${creditNoteId}/lineItems/${lineItemId}`, updateFields as IDataObject, {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		return xentralRequest.call(this, 'DELETE', `creditnotes/${creditNoteId}/lineItems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		return xentralRequest.call(this, 'PATCH', `creditnotes/${creditNoteId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'cancel') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		return xentralRequest.call(this, 'PATCH', `creditnotes/${creditNoteId}/actions/cancel`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'send') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		return xentralRequest.call(this, 'PATCH', `creditnotes/${creditNoteId}/actions/send`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		const body = this.getNodeParameter('activityData', itemIndex, {}) as IDataObject;
		return xentralRequest.call(this, 'PATCH', `creditnotes/${creditNoteId}/actions/log-activity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		return xentralRequest.call(this, 'PATCH', `creditnotes/${creditNoteId}/actions/set-write-protection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		return xentralRequest.call(this, 'PATCH', `creditnotes/${creditNoteId}/actions/remove-write-protection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const creditNoteId = this.getNodeParameter('creditNoteId', itemIndex) as string;
		assertSafeId(creditNoteId, 'creditNoteId');
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
		return xentralFileUpload.call(this, `creditnotes/${creditNoteId}/files`, binaryPropertyName, itemIndex);
	}

	throw new Error(`Unknown creditNote operation: ${operation}`);
}
