import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmptyBody } from '../../transport';

function buildStorageLocationBody(fields: IDataObject): IDataObject {
	const body: IDataObject = {};

	if (fields.abcCategory !== undefined) body.abcCategory = fields.abcCategory;
	if (fields.allowsProductionAccess !== undefined) body.allowsProductionAccess = fields.allowsProductionAccess;
	if (fields.designation !== undefined) body.designation = fields.designation;
	if (fields.isConsumptionLocation !== undefined) body.isConsumptionLocation = fields.isConsumptionLocation;
	if (fields.isPosLocation !== undefined) body.isPosLocation = fields.isPosLocation;
	if (fields.isReplenishmentLocation !== undefined) body.isReplenishmentLocation = fields.isReplenishmentLocation;
	if (fields.isRestrictedLocation !== undefined) body.isRestrictedLocation = fields.isRestrictedLocation;
	if (fields.locationType !== undefined) body.locationType = fields.locationType;
	if (fields.sort !== undefined) body.sort = fields.sort;

	// Build dimensions object from flat fields
	const dimensions: IDataObject = {};
	if (fields.dimensionHeight !== undefined) dimensions.height = fields.dimensionHeight;
	if (fields.dimensionLength !== undefined) dimensions.length = fields.dimensionLength;
	if (fields.dimensionWidth !== undefined) dimensions.width = fields.dimensionWidth;
	if (Object.keys(dimensions).length > 0) {
		body.dimensions = dimensions;
	}

	// Build address object
	if (fields.addressId !== undefined && fields.addressId !== '') {
		body.address = { id: fields.addressId };
	}

	return body;
}

export async function handleStorageLocation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const warehouseId = this.getNodeParameter('warehouseId', itemIndex) as string;
	assertSafeId(warehouseId, 'warehouseId');
	const basePath = `warehouses/${warehouseId}/storageLocations`;

	if (operation === 'create') {
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
		const body = buildStorageLocationBody(additionalFields);
		return xentralRequest.call(this, 'POST', basePath, body as IDataObject, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, basePath, {}, limit, maxPages);
	}

	if (operation === 'update') {
		const storageLocationId = this.getNodeParameter('storageLocationId', itemIndex) as string;
		assertSafeId(storageLocationId, 'storageLocationId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		const body = buildStorageLocationBody(updateFields);

		assertNonEmptyBody(body, 'storage location update');
		return xentralRequest.call(this, 'PATCH', `${basePath}/${storageLocationId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const storageLocationId = this.getNodeParameter('storageLocationId', itemIndex) as string;
		assertSafeId(storageLocationId, 'storageLocationId');
		return xentralRequest.call(this, 'DELETE', `${basePath}/${storageLocationId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown storageLocation operation: ${operation}`);
}
