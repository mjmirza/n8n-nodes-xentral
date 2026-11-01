import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmptyBody } from '../../transport';
import { toApiDate } from '../purchasePrice/purchasePrice.handler';

/**
 * Build the sales price body from a flat field map.
 * Handles object refs (product, customer, customerGroup) and the price object.
 */
function buildSalesPriceBody(fields: IDataObject, isCreate = false): IDataObject {
	const body: IDataObject = {};

	// Product ref (only used on create, not in update fields)
	if (fields.productId !== undefined && fields.productId !== '') {
		body.product = { id: fields.productId };
	}

	// Customer ref (nullable)
	if (fields.customerId !== undefined) {
		body.customer = fields.customerId !== '' ? { id: fields.customerId } : null;
	}

	// Customer group ref (nullable)
	if (fields.customerGroupId !== undefined) {
		body.customerGroup = fields.customerGroupId !== '' ? { id: fields.customerGroupId } : null;
	}

	// Price object: { amount, currency }
	const priceAmount = fields.priceAmount as number | undefined;
	const priceCurrency = fields.priceCurrency as string | undefined;
	if (priceAmount !== undefined || priceCurrency !== undefined) {
		const price: IDataObject = {};
		if (priceAmount !== undefined) price.amount = priceAmount;
		if (priceCurrency !== undefined) price.currency = priceCurrency;
		// If only amount is given, default currency to EUR
		if (priceAmount !== undefined && priceCurrency === undefined && isCreate) {
			price.currency = 'EUR';
		}
		body.price = price;
	}

	// Direct fields
	const directFields = [
		'amount',
		'customerProductNumber',
		'expiresAt',
		'hideInBulkPriceListing',
		'isNotCalculatedFromExchangeTable',
		'packageAmount',
		'remark',
		'validFrom',
	];

	for (const key of directFields) {
		if (fields[key] !== undefined && fields[key] !== '') {
			body[key] = key === 'validFrom' || key === 'expiresAt' ? toApiDate(String(fields[key])) : fields[key];
		}
	}

	return body;
}

export async function handleSalesPrice(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body = buildSalesPriceBody({ productId, ...additionalFields }, true);
		return xentralRequest.call(this, 'POST', 'salesPrices', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const salesPriceId = this.getNodeParameter('salesPriceId', itemIndex) as string;
		assertSafeId(salesPriceId, 'salesPriceId');
		return xentralRequest.call(this, 'GET', `salesPrices/${salesPriceId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'salesPrices', {}, limit, maxPages);
	}

	if (operation === 'update') {
		const salesPriceId = this.getNodeParameter('salesPriceId', itemIndex) as string;
		assertSafeId(salesPriceId, 'salesPriceId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body = buildSalesPriceBody(updateFields);
		assertNonEmptyBody(body, 'sales price update');
		return xentralRequest.call(this, 'PATCH', `salesPrices/${salesPriceId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const salesPriceId = this.getNodeParameter('salesPriceId', itemIndex) as string;
		assertSafeId(salesPriceId, 'salesPriceId');
		return xentralRequest.call(this, 'DELETE', `salesPrices/${salesPriceId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown salesPrice operation: ${operation}`);
}
