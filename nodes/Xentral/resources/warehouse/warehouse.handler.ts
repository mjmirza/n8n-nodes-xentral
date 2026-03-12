import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleWarehouse(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('warehouseName', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			name,
			description: additionalFields.description || undefined,
			street: additionalFields.street || undefined,
			zip: additionalFields.zipCode || undefined,
			city: additionalFields.city || undefined,
			country: additionalFields.country || undefined,
			isDefault: additionalFields.isDefault !== undefined ? additionalFields.isDefault : undefined,
		};

		// Clean undefined values
		Object.keys(body).forEach((key) => {
			if (body[key] === undefined) delete body[key];
		});

		return xentralRequest.call(this, 'POST', 'warehouses', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const warehouseId = this.getNodeParameter('warehouseId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `warehouses/${warehouseId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'warehouses', {}, limit);
	}

	if (operation === 'update') {
		const warehouseId = this.getNodeParameter('warehouseId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.warehouseName) body.name = updateFields.warehouseName;
		if (updateFields.description) body.description = updateFields.description;
		if (updateFields.street) body.street = updateFields.street;
		if (updateFields.zipCode) body.zip = updateFields.zipCode;
		if (updateFields.city) body.city = updateFields.city;
		if (updateFields.country) body.country = updateFields.country;
		if (updateFields.isDefault !== undefined) body.isDefault = updateFields.isDefault;

		return xentralRequest.call(this, 'PATCH', `warehouses/${warehouseId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const warehouseId = this.getNodeParameter('warehouseId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `warehouses/${warehouseId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown warehouse operation: ${operation}`);
}
