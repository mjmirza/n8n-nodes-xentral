import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll, xentralFileUpload, assertSafeId, assertNonEmptyBody, applyLineItemPosition, applyLineItemHidden, sortOnlyLineItemUpdate, documentAddress, lineItemUpdatePrice, lineItemAddBody } from '../../transport';

export async function handleProformaInvoice(
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

		if (additionalFields.bodyIntroduction !== undefined) body.bodyIntroduction = additionalFields.bodyIntroduction;
		if (additionalFields.bodyOutroduction !== undefined) body.bodyOutroduction = additionalFields.bodyOutroduction;
		if (additionalFields.customerOrderNumber !== undefined) body.customerOrderNumber = additionalFields.customerOrderNumber;
		if (additionalFields.deliveryDate !== undefined) body.deliveryDate = additionalFields.deliveryDate;
		if (additionalFields.deliveryTerms !== undefined) body.deliveryTerms = additionalFields.deliveryTerms;
		if (additionalFields.documentDate !== undefined) body.documentDate = additionalFields.documentDate;
		if (additionalFields.internalComment !== undefined) body.internalComment = additionalFields.internalComment;
		if (additionalFields.internalDesignation !== undefined) body.internalDesignation = additionalFields.internalDesignation;
		if (additionalFields.language !== undefined) body.language = additionalFields.language;
		if (additionalFields.useAlternativeDocumentTitle !== undefined) body.useAlternativeDocumentTitle = additionalFields.useAlternativeDocumentTitle;
		if (additionalFields.vatId !== undefined) body.vatId = additionalFields.vatId;

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

		// Financials object (currency)
		if (additionalFields.currency !== undefined) {
			body.financials = { currency: additionalFields.currency };
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

		// Financials: tax.taxation
		if (additionalFields.taxation !== undefined) {
			body.financials = {
				...(body.financials as IDataObject || {}),
				tax: { taxation: additionalFields.taxation },
			};
		}

		// Print settings (fixedCollection)
		if (additionalFields.printSettings !== undefined) {
			const ps = (additionalFields.printSettings as IDataObject).settings as IDataObject;
			if (ps !== undefined) body.printSettings = ps;
		}

		return xentralRequest.call(this, 'POST', 'proformaInvoices', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		assertSafeId(proformaInvoiceId, 'proformaInvoiceId');
		return xentralRequest.call(this, 'GET', `proformaInvoices/${proformaInvoiceId}`, {}, {}, 'v3');
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
		if (filters.createdAfter !== undefined && filters.createdAfter !== '') {
			query[`filter[${filterIndex}][key]`] = 'createdAt';
			query[`filter[${filterIndex}][op]`] = 'greaterThanOrEquals';
			query[`filter[${filterIndex}][value]`] = filters.createdAfter;
			filterIndex++;
		}
		return xentralV3GetAll.call(this, 'proformaInvoices', query, limit, maxPages);
	}

	if (operation === 'update') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		assertSafeId(proformaInvoiceId, 'proformaInvoiceId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		// Simple fields
		const simpleFields = [
			'bodyIntroduction', 'bodyOutroduction', 'customerOrderNumber', 'deliveryDate',
			'deliveryTerms', 'documentDate', 'internalComment', 'internalDesignation',
			'language', 'useAlternativeDocumentTitle', 'vatId',
		];
		for (const field of simpleFields) {
			if (updateFields[field] !== undefined) body[field] = updateFields[field];
		}
		// An empty date is not a date and is left out. An expression that returns null clears it.
		if (body.deliveryDate === '') delete body.deliveryDate;

		// Nested refs
		if (updateFields.editorId !== undefined) {
			assertSafeId(updateFields.editorId as string, 'editorId');
			body.editor = { id: updateFields.editorId };
		}
		if (updateFields.projectId !== undefined) {
			assertSafeId(updateFields.projectId as string, 'projectId');
			body.project = { id: updateFields.projectId };
		}

		// Financials
		if (updateFields.currency !== undefined) {
			body.financials = { currency: updateFields.currency };
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

		// Financials: tax.taxation
		if (updateFields.taxation !== undefined) {
			body.financials = {
				...(body.financials as IDataObject || {}),
				tax: { taxation: updateFields.taxation },
			};
		}

		// Print settings (fixedCollection)
		if (updateFields.printSettings !== undefined) {
			const ps = (updateFields.printSettings as IDataObject).settings as IDataObject;
			if (ps !== undefined) body.printSettings = ps;
		}

		assertNonEmptyBody(body as IDataObject, 'proforma invoice update');

		return xentralRequest.call(this, 'PATCH', `proformaInvoices/${proformaInvoiceId}`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'delete') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		assertSafeId(proformaInvoiceId, 'proformaInvoiceId');
		return xentralRequest.call(this, 'DELETE', `proformaInvoices/${proformaInvoiceId}`, {}, {}, 'v3');
	}

	if (operation === 'addLineItem') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		assertSafeId(proformaInvoiceId, 'proformaInvoiceId');
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
		const quantity = this.getNodeParameter('quantity', itemIndex) as number;
		const lineItemOptions = this.getNodeParameter('lineItemOptions', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			product: { id: productId },
			quantity,
		};

		// Simple line item fields
		const lineSimpleFields = [
			'countryOfOrigin', 'customerProductNumber', 'deliveryDate',
			'deliveryDateAsCalendarWeek', 'description', 'discount', 'hsCode',
			'internalComment', 'name', 'number', 'taxLegalNotice',
		];
		for (const field of lineSimpleFields) {
			if (lineItemOptions[field] !== undefined) body[field] = lineItemOptions[field];
		}

		applyLineItemHidden(body, lineItemOptions);

		// Price object
		if (lineItemOptions.priceAmount !== undefined) {
			body.price = {
				net: {
					amount: lineItemOptions.priceAmount,
					currency: (lineItemOptions.priceCurrency as string) || 'EUR',
				},
			};
		}

		return xentralRequest.call(this, 'POST', `proformaInvoices/${proformaInvoiceId}/lineItems`, lineItemAddBody(body as IDataObject), {}, 'v3');
	}

	if (operation === 'updateLineItem') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		assertSafeId(proformaInvoiceId, 'proformaInvoiceId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		const lineSimpleFields = [
			'deliveryDate', 'deliveryDateAsCalendarWeek', 'description',
			'discount', 'quantity', 'taxLegalNotice',
		];
		for (const field of lineSimpleFields) {
			if (updateFields[field] !== undefined) body[field] = updateFields[field];
		}
		// An empty date is not a date and is left out. An expression that returns null clears it.
		if (body.deliveryDate === '') delete body.deliveryDate;
		applyLineItemPosition(body, updateFields);

		// Product ref
		if (updateFields.productId) body.product = { id: updateFields.productId };
		applyLineItemHidden(body, updateFields);

		// Price object
		const price = lineItemUpdatePrice(updateFields);
		if (price) body.price = price;

		const sortOnly = sortOnlyLineItemUpdate(body, updateFields);
		if (sortOnly) return sortOnly;
		assertNonEmptyBody(body as IDataObject, 'proforma invoice line item update');

		return xentralRequest.call(this, 'PATCH', `proformaInvoices/${proformaInvoiceId}/lineItems/${lineItemId}`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'deleteLineItem') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		assertSafeId(proformaInvoiceId, 'proformaInvoiceId');
		const lineItemId = this.getNodeParameter('lineItemId', itemIndex) as string;
		assertSafeId(lineItemId, 'lineItemId');
		return xentralRequest.call(this, 'DELETE', `proformaInvoices/${proformaInvoiceId}/lineItems/${lineItemId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		assertSafeId(proformaInvoiceId, 'proformaInvoiceId');
		return xentralRequest.call(this, 'PATCH', `proformaInvoices/${proformaInvoiceId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		assertSafeId(proformaInvoiceId, 'proformaInvoiceId');
		const activityMessage = this.getNodeParameter('activityMessage', itemIndex) as string;
		const body: IDataObject = { message: activityMessage };
		return xentralRequest.call(this, 'PATCH', `proformaInvoices/${proformaInvoiceId}/actions/logActivity`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'setWriteProtection') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		assertSafeId(proformaInvoiceId, 'proformaInvoiceId');
		return xentralRequest.call(this, 'PATCH', `proformaInvoices/${proformaInvoiceId}/actions/setWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'removeWriteProtection') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		assertSafeId(proformaInvoiceId, 'proformaInvoiceId');
		return xentralRequest.call(this, 'PATCH', `proformaInvoices/${proformaInvoiceId}/actions/removeWriteProtection`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'attachFile') {
		const proformaInvoiceId = this.getNodeParameter('proformaInvoiceId', itemIndex) as string;
		assertSafeId(proformaInvoiceId, 'proformaInvoiceId');
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
		return xentralFileUpload.call(this, `proformaInvoices/${proformaInvoiceId}/files`, binaryPropertyName, itemIndex);
	}

	throw new Error(`Unknown proformaInvoice operation: ${operation}`);
}
