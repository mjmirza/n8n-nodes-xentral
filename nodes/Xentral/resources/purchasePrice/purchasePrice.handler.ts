import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handlePurchasePrice(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		const price = this.getNodeParameter('price', itemIndex) as number;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			productId,
			supplierId,
			price,
			currency: additionalFields.currency || undefined,
			minQuantity: additionalFields.minQuantity || undefined,
			deliveryTime: additionalFields.deliveryTime || undefined,
		};

		// Clean undefined
		Object.keys(body).forEach((key) => {
			if (body[key] === undefined) delete body[key];
		});

		return xentralRequest.call(this, 'POST', 'purchase-price-v2', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const purchasePriceId = this.getNodeParameter('purchasePriceId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `purchase-price/${purchasePriceId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'purchase-price-v2', {}, limit);
	}

	if (operation === 'update') {
		const purchasePriceId = this.getNodeParameter('purchasePriceId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.productId) body.productId = updateFields.productId;
		if (updateFields.supplierId) body.supplierId = updateFields.supplierId;
		if (updateFields.price !== undefined) body.price = updateFields.price;
		if (updateFields.currency) body.currency = updateFields.currency;
		if (updateFields.minQuantity) body.minQuantity = updateFields.minQuantity;
		if (updateFields.deliveryTime) body.deliveryTime = updateFields.deliveryTime;

		return xentralRequest.call(this, 'PATCH', `purchase-price-v2/${purchasePriceId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const purchasePriceId = this.getNodeParameter('purchasePriceId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `purchase-price/${purchasePriceId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown purchasePrice operation: ${operation}`);
}
