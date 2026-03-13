import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmpty, assertNonEmptyBody } from '../../transport';

export async function handlePurchasePrice(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		assertSafeId(supplierId, 'supplierId');
		const validFrom = assertNonEmpty(this.getNodeParameter('validFrom', itemIndex) as string, 'Valid From');
		const expiresAt = assertNonEmpty(this.getNodeParameter('expiresAt', itemIndex) as string, 'Expires At');
		const fromQuantity = this.getNodeParameter('fromQuantity', itemIndex, 1) as number;
		const packageAmount = this.getNodeParameter('packageAmount', itemIndex, 1) as number;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			product: { id: productId },
			supplier: { id: supplierId },
			validFrom,
			expiresAt,
			fromQuantity,
			packageAmount,
		};

		if (additionalFields.amount !== undefined) {
			body.price = { amount: Number(additionalFields.amount), currency: (additionalFields.currency as string) || 'EUR' };
		}
		if (additionalFields.deliveryTime !== undefined) body.deliveryTime = additionalFields.deliveryTime;

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

		const body: IDataObject = {};
		if (updateFields.productId !== undefined) body.product = { id: updateFields.productId };
		if (updateFields.supplierId !== undefined) body.supplier = { id: updateFields.supplierId };
		if (updateFields.fromQuantity !== undefined) body.fromQuantity = updateFields.fromQuantity;
		if (updateFields.packageAmount !== undefined) body.packageAmount = updateFields.packageAmount;
		if (updateFields.price !== undefined) body.price = updateFields.price;
		if (updateFields.currency !== undefined) body.currency = updateFields.currency;
		if (updateFields.deliveryTime !== undefined) body.deliveryTime = updateFields.deliveryTime;

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
