import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleStorageLocation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('storageLocationName', itemIndex) as string;
		const warehouseId = this.getNodeParameter('warehouseId', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			name,
			warehouseId,
		};

		if (additionalFields.description) body.description = additionalFields.description;
		if (additionalFields.aisle) body.aisle = additionalFields.aisle;
		if (additionalFields.shelf) body.shelf = additionalFields.shelf;
		if (additionalFields.level) body.level = additionalFields.level;

		return xentralRequest.call(this, 'POST', 'storage-location', body as IDataObject, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'storage-location', {}, limit);
	}

	if (operation === 'update') {
		const storageLocationId = this.getNodeParameter('storageLocationId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.storageLocationName) body.name = updateFields.storageLocationName;
		if (updateFields.warehouseId) body.warehouseId = updateFields.warehouseId;
		if (updateFields.description) body.description = updateFields.description;
		if (updateFields.aisle) body.aisle = updateFields.aisle;
		if (updateFields.shelf) body.shelf = updateFields.shelf;
		if (updateFields.level) body.level = updateFields.level;

		return xentralRequest.call(this, 'PATCH', `storage-location/${storageLocationId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const storageLocationId = this.getNodeParameter('storageLocationId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `storage-location/${storageLocationId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown storageLocation operation: ${operation}`);
}
