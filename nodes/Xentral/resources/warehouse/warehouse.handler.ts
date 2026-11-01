import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmpty, assertNonEmptyBody } from '../../transport';

export async function handleWarehouse(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const designation = assertNonEmpty(this.getNodeParameter('designation', itemIndex) as string, 'Designation');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			designation,
		};

		// Address object ref: spec expects { id: "..." }
		if (additionalFields.addressId !== undefined && additionalFields.addressId !== '') {
			body.address = { id: additionalFields.addressId };
		}

		// Project object ref
		if (additionalFields.projectId || additionalFields.projectId === null) {
			body.project = { id: additionalFields.projectId };
		}

		return xentralRequest.call(this, 'POST', 'warehouses', body as IDataObject, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'warehouses', {}, limit, maxPages);
	}

	if (operation === 'update') {
		const warehouseId = this.getNodeParameter('warehouseId', itemIndex) as string;
		assertSafeId(warehouseId, 'warehouseId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.designation !== undefined) body.designation = updateFields.designation;

		// Address object ref: spec expects { id: "..." }
		if (updateFields.addressId !== undefined && updateFields.addressId !== '') {
			body.address = { id: updateFields.addressId };
		}

		// Project object ref
		if (updateFields.projectId || updateFields.projectId === null) {
			body.project = { id: updateFields.projectId };
		}

		assertNonEmptyBody(body, 'warehouse update');
		return xentralRequest.call(this, 'PATCH', `warehouses/${warehouseId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const warehouseId = this.getNodeParameter('warehouseId', itemIndex) as string;
		assertSafeId(warehouseId, 'warehouseId');
		return xentralRequest.call(this, 'DELETE', `warehouses/${warehouseId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown warehouse operation: ${operation}`);
}
