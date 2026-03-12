import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleProductCategory(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('name', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			name,
			description: additionalFields.description || undefined,
			parentId: additionalFields.parentId || undefined,
		};

		// Clean undefined
		Object.keys(body).forEach((key) => {
			if (body[key] === undefined) delete body[key];
		});

		return xentralRequest.call(this, 'POST', 'product-category', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const productCategoryId = this.getNodeParameter('productCategoryId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `product-category/${productCategoryId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'product-category', {}, limit);
	}

	if (operation === 'update') {
		const productCategoryId = this.getNodeParameter('productCategoryId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.name) body.name = updateFields.name;
		if (updateFields.description) body.description = updateFields.description;
		if (updateFields.parentId) body.parentId = updateFields.parentId;

		return xentralRequest.call(this, 'PATCH', `product-category/${productCategoryId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const productCategoryId = this.getNodeParameter('productCategoryId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `product-category/${productCategoryId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown productCategory operation: ${operation}`);
}
