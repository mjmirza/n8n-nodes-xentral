import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmptyBody } from '../../transport';

export async function handleSalesPrice(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
		const amount = this.getNodeParameter('amount', itemIndex) as number;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const currency = (additionalFields.currency as string) || 'EUR';

		const body: IDataObject = {
			product: { id: productId },
			amount: 1,
			price: { amount: String(amount), currency },
		};

		if (additionalFields.customerGroupId !== undefined) body.customerGroupId = additionalFields.customerGroupId;
		if (additionalFields.minQuantity !== undefined) body.minQuantity = additionalFields.minQuantity;
		if (additionalFields.validFrom !== undefined) body.validFrom = additionalFields.validFrom;
		if (additionalFields.validTo !== undefined) body.validTo = additionalFields.validTo;

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

		const body: IDataObject = {};
		if (updateFields.productId !== undefined) body.product = { id: updateFields.productId };
		if (updateFields.amount !== undefined) {
			const currency = (updateFields.currency as string) || 'EUR';
			body.price = { amount: String(updateFields.amount), currency };
		} else if (updateFields.currency !== undefined) {
			body.price = { currency: updateFields.currency };
		}
		if (updateFields.customerGroupId !== undefined) body.customerGroupId = updateFields.customerGroupId;
		if (updateFields.minQuantity !== undefined) body.minQuantity = updateFields.minQuantity;
		if (updateFields.validFrom !== undefined) body.validFrom = updateFields.validFrom;
		if (updateFields.validTo !== undefined) body.validTo = updateFields.validTo;

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
