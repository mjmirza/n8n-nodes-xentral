import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleSalesPrice(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		const price = this.getNodeParameter('price', itemIndex) as number;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			productId,
			price,
			currency: additionalFields.currency || undefined,
			customerGroupId: additionalFields.customerGroupId || undefined,
			minQuantity: additionalFields.minQuantity || undefined,
			validFrom: additionalFields.validFrom || undefined,
			validTo: additionalFields.validTo || undefined,
		};

		// Clean undefined
		Object.keys(body).forEach((key) => {
			if (body[key] === undefined) delete body[key];
		});

		return xentralRequest.call(this, 'POST', 'sales-price', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const salesPriceId = this.getNodeParameter('salesPriceId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `sales-price/${salesPriceId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'sales-price', {}, limit);
	}

	if (operation === 'update') {
		const salesPriceId = this.getNodeParameter('salesPriceId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.productId) body.productId = updateFields.productId;
		if (updateFields.price !== undefined) body.price = updateFields.price;
		if (updateFields.currency) body.currency = updateFields.currency;
		if (updateFields.customerGroupId) body.customerGroupId = updateFields.customerGroupId;
		if (updateFields.minQuantity) body.minQuantity = updateFields.minQuantity;
		if (updateFields.validFrom) body.validFrom = updateFields.validFrom;
		if (updateFields.validTo) body.validTo = updateFields.validTo;

		return xentralRequest.call(this, 'PATCH', `sales-price/${salesPriceId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const salesPriceId = this.getNodeParameter('salesPriceId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `sales-price/${salesPriceId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown salesPrice operation: ${operation}`);
}
