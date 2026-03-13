import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleSalesPrice(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
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
		return xentralRequest.call(this, 'GET', `salesPrices/${salesPriceId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'salesPrices', {}, limit);
	}

	if (operation === 'update') {
		const salesPriceId = this.getNodeParameter('salesPriceId', itemIndex) as string;
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

		return xentralRequest.call(this, 'PATCH', `salesPrices/${salesPriceId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const salesPriceId = this.getNodeParameter('salesPriceId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `salesPrices/${salesPriceId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown salesPrice operation: ${operation}`);
}
