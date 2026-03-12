import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleProduct(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('productName', itemIndex) as string;
		const articleNumber = this.getNodeParameter('articleNumber', itemIndex, '') as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			name,
			number: articleNumber || undefined,
			description: additionalFields.description || undefined,
			ean: additionalFields.ean || undefined,
			unit: additionalFields.unit || undefined,
			manufacturerName: additionalFields.manufacturer || undefined,
		};

		// Clean undefined
		Object.keys(body).forEach((key) => {
			if (body[key] === undefined) delete body[key];
		});

		return xentralRequest.call(this, 'POST', 'products', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `products/${productId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'products', {}, limit);
	}

	if (operation === 'update') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.productName) body.name = updateFields.productName;
		if (updateFields.articleNumber) body.number = updateFields.articleNumber;
		if (updateFields.description) body.description = updateFields.description;
		if (updateFields.ean) body.ean = updateFields.ean;
		if (updateFields.unit) body.unit = updateFields.unit;
		if (updateFields.manufacturer) body.manufacturerName = updateFields.manufacturer;

		return xentralRequest.call(this, 'PATCH', `products/${productId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `products/${productId}`, {}, {}, 'v1');
	}

	if (operation === 'search') {
		const searchTerm = this.getNodeParameter('searchTerm', itemIndex) as string;
		const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
		return xentralV1PageGetAll.call(this, 'products', { 'filter[name]': searchTerm }, limit);
	}

	if (operation === 'getStock') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `products/${productId}/stock`, {}, {}, 'v1');
	}

	throw new Error(`Unknown product operation: ${operation}`);
}
