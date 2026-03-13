import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleProduct(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('productName', itemIndex) as string;
		const project = this.getNodeParameter('project', itemIndex) as string;
		const articleNumber = this.getNodeParameter('articleNumber', itemIndex, '') as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			name,
			project: { id: project },
			number: articleNumber !== undefined ? articleNumber : undefined,
			description: additionalFields.description !== undefined ? additionalFields.description : undefined,
			ean: additionalFields.ean !== undefined ? additionalFields.ean : undefined,
			unit: additionalFields.unit !== undefined ? additionalFields.unit : undefined,
			manufacturerName: additionalFields.manufacturer !== undefined ? additionalFields.manufacturer : undefined,
			categoryId: additionalFields.categoryId !== undefined ? additionalFields.categoryId : undefined,
			priceNet: additionalFields.priceNet !== undefined ? additionalFields.priceNet : undefined,
			taxRate: additionalFields.taxRate !== undefined ? additionalFields.taxRate : undefined,
			weight: additionalFields.weight !== undefined ? additionalFields.weight : undefined,
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
		if (updateFields.productName !== undefined) body.name = updateFields.productName;
		if (updateFields.articleNumber !== undefined) body.number = updateFields.articleNumber;
		if (updateFields.description !== undefined) body.description = updateFields.description;
		if (updateFields.ean !== undefined) body.ean = updateFields.ean;
		if (updateFields.unit !== undefined) body.unit = updateFields.unit;
		if (updateFields.manufacturer !== undefined) body.manufacturerName = updateFields.manufacturer;
		if (updateFields.priceNet !== undefined) body.priceNet = updateFields.priceNet;

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

	throw new Error(`Unknown product operation: ${operation}`);
}
