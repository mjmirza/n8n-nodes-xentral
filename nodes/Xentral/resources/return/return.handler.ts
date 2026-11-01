import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll, xentralFileUpload, assertSafeId, assertNonEmptyBody, applyLineItemPosition, applyLineItemHidden, sortOnlyLineItemUpdate, documentAddress, lineItemAddBody } from '../../transport';

// Xentral takes returnReason as { id } or null. Saved values may be an id, a number, JSON or "null".
function returnReasonRef(value: unknown): IDataObject | null {
	let v: unknown = value;
	if (typeof v === 'string') {
		const text = v.trim();
		try {
			v = JSON.parse(text);
		} catch {
			v = text;
		}
	}
	if (v === null || v === 'null') return null;
	if (v && typeof v === 'object' && 'id' in (v as IDataObject)) return { id: String((v as IDataObject).id) };
	return { id: String(v) };
}

export async function handleReturn(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		assertSafeId(customerId, 'customerId');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			address: { id: customerId },
		};

		// Simple fields
		const simpleFields = [
			'bodyIntroduction', 'bodyOutroduction', 'customerOrderNumber',
			'deliveryTerms', 'documentDate', 'internalComment', 'internalDesignation',
			'language', 'progress', 'vatId',
		];
		for (const field of simpleFields) {
			if (additionalFields[field] !== undefined) body[field] = additionalFields[field];
		}
		// The node option keeps its saved name, Xentral expects isReturnOrderToSupplier.
		if (additionalFields.isSupplierReturnOrder !== undefined) {
			body.isReturnOrderToSupplier = additionalFields.isSupplierReturnOrder;
		}

		// Nested object refs
		if (additionalFields.editorId !== undefined) {
			assertSafeId(additionalFields.editorId as string, 'editorId');
			body.editor = { id: additionalFields.editorId };
		}
		if (additionalFields.projectId !== undefined) {
			assertSafeId(additionalFields.projectId as string, 'projectId');
			body.project = { id: additionalFields.projectId };
		}
		if (additionalFields.salesOrderId !== undefined) {
			assertSafeId(additionalFields.salesOrderId as string, 'salesOrderId');
			body.salesOrder = { id: additionalFields.salesOrderId };
		}
		if (additionalFields.replacementSalesOrderId !== undefined) {
			assertSafeId(additionalFields.replacementSalesOrderId as string, 'replacementSalesOrderId');
			body.replacementSalesOrder = { id: additionalFields.replacementSalesOrderId };
		}
		if (additionalFields.creditNoteId !== undefined && (additionalFields.creditNoteId as string) !== '') {
			assertSafeId(additionalFields.creditNoteId as string, 'creditNoteId');
			body.creditNote = { id: additionalFields.creditNoteId };
		}
		if (additionalFields.deliveryNoteId !== undefined && (additionalFields.deliveryNoteId as string) !== '') {
			assertSafeId(additionalFields.deliveryNoteId as string, 'deliveryNoteId');
			body.deliveryNote = { id: additionalFields.deliveryNoteId };
		}

		// Document address (fixedCollection)
		if (additionalFields.documentAddress !== undefined) {
			const addr = (additionalFields.documentAddress as IDataObject).address as IDataObject;
			if (addr !== undefined) body.documentAddress = documentAddress(addr);
		}

		// Tags (comma-separated string to array)
		if (additionalFields.tags !== undefined && (additionalFields.tags as string) !== '') {
			body.tags = (additionalFields.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean).map(t => ({ title: t }));
		}

		// Sales ref
		if (additionalFields.salesId !== undefined) {
			assertSafeId(additionalFields.salesId as string, 'salesId');
			body.sales = { id: additionalFields.salesId };
		}

		// Print settings (fixedCollection)
		if (additionalFields.printSettings !== undefined) {
			const ps = (additionalFields.printSettings as IDataObject).settings as IDataObject;
			if (ps !== undefined) body.printSettings = ps;
		}

		return xentralRequest.call(this, 'POST', 'returnOrders', body as IDataObject, {}, 'v3');
	}

	if (operation === 'createFromDeliveryNote') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		const lineItemsJson = this.getNodeParameter('lineItemsJson', itemIndex) as string | object[];

		let lineItems: object[];
		if (typeof lineItemsJson === 'string') {
			try {
				lineItems = JSON.parse(lineItemsJson) as object[];
			} catch {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON in lineItems. Please provide a valid JSON array.');
			}
		} else {
			lineItems = lineItemsJson;
		}

		const body: IDataObject = {
			deliveryNote: { id: deliveryNoteId },
			lineItems,
		};

		return xentralRequest.call(this, 'POST', 'returnOrders/actions/createFromDeliveryNote', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		return xentralRequest.call(this, 'GET', `returnOrders/${returnId}`, {}, {}, 'v3');
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
			query[`filter[${filterIndex}][key]`] = 'address.id';
			query[`filter[${filterIndex}][op]`] = 'equals';
			query[`filter[${filterIndex}][value]`] = filters.customerId;
			filterIndex++;
		}
		return xentralV3GetAll.call(this, 'returnOrders', query, limit, maxPages);
	}

	if (operation === 'update') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		// Simple fields
		const simpleFields = [
			'bodyIntroduction', 'bodyOutroduction', 'customerOrderNumber',
			'deliveryTerms', 'documentDate', 'internalComment', 'internalDesignation',
			'language', 'progress', 'useAlternativeDocumentTitle', 'vatId',
		];
		for (const field of simpleFields) {
			if (updateFields[field] !== undefined) body[field] = updateFields[field];
		}
		if (updateFields.isSupplierReturnOrder !== undefined) {
			body.isReturnOrderToSupplier = updateFields.isSupplierReturnOrder;
		}

		// Nested refs
		if (updateFields.editorId !== undefined) {
			assertSafeId(updateFields.editorId as string, 'editorId');
			body.editor = { id: updateFields.editorId };
		}
		if (updateFields.projectId !== undefined) {
			assertSafeId(updateFields.projectId as string, 'projectId');
			body.project = { id: updateFields.projectId };
		}
		if (updateFields.salesOrderId !== undefined) {
			assertSafeId(updateFields.salesOrderId as string, 'salesOrderId');
			body.salesOrder = { id: updateFields.salesOrderId };
		}
		if (updateFields.replacementSalesOrderId !== undefined) {
			assertSafeId(updateFields.replacementSalesOrderId as string, 'replacementSalesOrderId');
			body.replacementSalesOrder = { id: updateFields.replacementSalesOrderId };
		}
		if (updateFields.creditNoteId !== undefined && (updateFields.creditNoteId as string) !== '') {
			assertSafeId(updateFields.creditNoteId as string, 'creditNoteId');
			body.creditNote = { id: updateFields.creditNoteId };
		}
		if (updateFields.deliveryNoteId !== undefined && (updateFields.deliveryNoteId as string) !== '') {
			assertSafeId(updateFields.deliveryNoteId as string, 'deliveryNoteId');
			body.deliveryNote = { id: updateFields.deliveryNoteId };
		}

		// Document address
		if (updateFields.documentAddress !== undefined) {
			const addr = (updateFields.documentAddress as IDataObject).address as IDataObject;
			if (addr !== undefined) body.documentAddress = documentAddress(addr);
		}

		// Tags
		if (updateFields.tags !== undefined && (updateFields.tags as string) !== '') {
			body.tags = (updateFields.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean).map(t => ({ title: t }));
		}

		// Sales ref
		if (updateFields.salesId !== undefined) {
			assertSafeId(updateFields.salesId as string, 'salesId');
			body.sales = { id: updateFields.salesId };
		}

		// Print settings (fixedCollection)
		if (updateFields.printSettings !== undefined) {
			const ps = (updateFields.printSettings as IDataObject).settings as IDataObject;
			if (ps !== undefined) body.printSettings = ps;
		}

		assertNonEmptyBody(body as IDataObject, 'return order update');

		return xentralRequest.call(this, 'PATCH', `returnOrders/${returnId}`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'delete') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		return xentralRequest.call(this, 'DELETE', `returnOrders/${returnId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
		const quantity = this.getNodeParameter('quantity', itemIndex) as number;
		const lineItemOptions = this.getNodeParameter('lineItemOptions', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			product: { id: productId },
			quantity,
		};

		const lineSimpleFields = [
			'countryOfOrigin', 'customerProductNumber', 'deliveryDate',
			'deliveryDateAsCalendarWeek', 'description', 'hsCode',
			'internalComment', 'name', 'number',
		];
		for (const field of lineSimpleFields) {
			if (lineItemOptions[field] !== undefined) body[field] = lineItemOptions[field];
		}
		applyLineItemHidden(body, lineItemOptions);

		// returnReason as object or null
		if (lineItemOptions.returnReason !== undefined && (lineItemOptions.returnReason as string) !== '') {
			body.returnReason = returnReasonRef(lineItemOptions.returnReason);
		}

		return xentralRequest.call(this, 'POST', `returnOrders/${returnId}/lineItems`, lineItemAddBody(body as IDataObject), {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		const lineSimpleFields = [
			'deliveryDate', 'deliveryDateAsCalendarWeek', 'description',
			'name', 'quantity',
		];
		for (const field of lineSimpleFields) {
			if (updateFields[field] !== undefined) body[field] = updateFields[field];
		}
		applyLineItemPosition(body, updateFields);
		applyLineItemHidden(body, updateFields);

		// Product ref
		if (updateFields.productId !== undefined) {
			assertSafeId(updateFields.productId as string, 'productId');
			body.product = { id: updateFields.productId };
		}

		if (updateFields.returnReason !== undefined && (updateFields.returnReason as string) !== '') {
			body.returnReason = returnReasonRef(updateFields.returnReason);
		}

		const sortOnly = sortOnlyLineItemUpdate(body, updateFields);
		if (sortOnly) return sortOnly;
		assertNonEmptyBody(body as IDataObject, 'return order line item update');

		return xentralRequest.call(this, 'PATCH', `returnOrders/${returnId}/lineItems/${lineItemId}`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		return xentralRequest.call(this, 'DELETE', `returnOrders/${returnId}/lineItems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		return xentralRequest.call(this, 'PATCH', `returnOrders/${returnId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'cancel') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		return xentralRequest.call(this, 'PATCH', `returnOrders/${returnId}/actions/cancel`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'send') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		return xentralRequest.call(this, 'PATCH', `returnOrders/${returnId}/actions/send`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		const activityMessage = this.getNodeParameter('activityMessage', itemIndex) as string;
		const body: IDataObject = { message: activityMessage };
		return xentralRequest.call(this, 'PATCH', `returnOrders/${returnId}/actions/logActivity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		return xentralRequest.call(this, 'PATCH', `returnOrders/${returnId}/actions/setWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		return xentralRequest.call(this, 'PATCH', `returnOrders/${returnId}/actions/removeWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
		return xentralFileUpload.call(this, `returnOrders/${returnId}/files`, binaryPropertyName, itemIndex);
	}

	throw new Error(`Unknown return operation: ${operation}`);
}
