import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmpty, assertNonEmptyBody } from '../../transport';

/**
 * Build the purchase price body from a flat field map.
 * Handles object refs (product, supplier) and the price object { amount, currency }.
 */
function buildPurchasePriceBody(fields: IDataObject): IDataObject {
	const body: IDataObject = {};

	// Object refs
	if (fields.productId !== undefined && fields.productId !== '') {
		body.product = { id: fields.productId };
	}
	if (fields.supplierId !== undefined && fields.supplierId !== '') {
		body.supplier = { id: fields.supplierId };
	}

	// Price object: V1 uses flat { amount, currency }
	const priceAmount = fields.priceAmount as number | undefined;
	const priceCurrency = fields.priceCurrency as string | undefined;
	if (priceAmount !== undefined || priceCurrency !== undefined) {
		const price: IDataObject = {};
		if (priceAmount !== undefined) price.amount = priceAmount;
		if (priceCurrency !== undefined) price.currency = priceCurrency;
		// Default currency to EUR if only amount is provided
		if (priceAmount !== undefined && priceCurrency === undefined) {
			price.currency = 'EUR';
		}
		body.price = price;
	}

	// Direct fields
	const directFields = [
		'expiresAt',
		'fromQuantity',
		'isStandardSupplier',
		'packageAmount',
		'supplierDesignation',
		'supplierItemNumber',
		'validFrom',
	];

	for (const key of directFields) {
		if (fields[key] !== undefined && fields[key] !== '') {
			body[key] = fields[key];
		}
	}

	return body;
}

export async function handlePurchasePrice(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
		const fromQuantity = this.getNodeParameter('fromQuantity', itemIndex) as number;
		const priceAmount = this.getNodeParameter('priceAmount', itemIndex) as number;
		const priceCurrency = this.getNodeParameter('priceCurrency', itemIndex, 'EUR') as string;
		const validFrom = assertNonEmpty(this.getNodeParameter('validFrom', itemIndex) as string, 'Valid From');
		const expiresAt = assertNonEmpty(this.getNodeParameter('expiresAt', itemIndex) as string, 'Expires At');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body = buildPurchasePriceBody({
			productId,
			fromQuantity,
			priceAmount,
			priceCurrency,
			validFrom,
			expiresAt,
			...additionalFields,
		});

		return xentralRequest.call(this, 'POST', 'purchasePrices', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const purchasePriceId = this.getNodeParameter('purchasePriceId', itemIndex) as string;
		assertSafeId(purchasePriceId, 'purchasePriceId');
		return xentralRequest.call(this, 'GET', `purchasePrices/${purchasePriceId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'purchasePrices', {}, limit, maxPages);
	}

	if (operation === 'update') {
		const purchasePriceId = this.getNodeParameter('purchasePriceId', itemIndex) as string;
		assertSafeId(purchasePriceId, 'purchasePriceId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body = buildPurchasePriceBody(updateFields);
		assertNonEmptyBody(body, 'purchase price update');
		return xentralRequest.call(this, 'PATCH', `purchasePrices/${purchasePriceId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const purchasePriceId = this.getNodeParameter('purchasePriceId', itemIndex) as string;
		assertSafeId(purchasePriceId, 'purchasePriceId');
		return xentralRequest.call(this, 'DELETE', `purchasePrices/${purchasePriceId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown purchasePrice operation: ${operation}`);
}
