import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV3GetAll, xentralFileUpload, assertSafeId } from '../../transport';

export async function handleProduction(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const produceProductId = this.getNodeParameter('produceProductId', itemIndex) as string;
		assertSafeId(produceProductId, 'produceProductId');
		const produceQuantity = this.getNodeParameter('produceQuantity', itemIndex) as number;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			produceProduct: { id: produceProductId },
			produceQuantity,
		};

		// Simple fields
		const simpleFields = [
			'bodyText', 'createSerialNumbers', 'documentDate', 'functionTest',
			'internalComment', 'internalDesignation', 'materialReservation',
			'materialRetrieval', 'productionEndDate', 'productionStartDate',
			'recordSubSerialNumbers', 'resolveMultiLevelBOM',
			'stockProvisioningDate', 'stockRetrievalDate',
		];
		for (const field of simpleFields) {
			if (additionalFields[field] !== undefined) body[field] = additionalFields[field];
		}

		// Nested object refs
		if (additionalFields.addressId !== undefined) {
			assertSafeId(additionalFields.addressId as string, 'addressId');
			body.address = { id: additionalFields.addressId };
		}
		if (additionalFields.preferredWarehouseId !== undefined) {
			assertSafeId(additionalFields.preferredWarehouseId as string, 'preferredWarehouseId');
			body.preferredWarehouse = { id: additionalFields.preferredWarehouseId };
		}
		if (additionalFields.projectId !== undefined) {
			assertSafeId(additionalFields.projectId as string, 'projectId');
			body.project = { id: additionalFields.projectId };
		}
		if (additionalFields.salesOrderId !== undefined) {
			assertSafeId(additionalFields.salesOrderId as string, 'salesOrderId');
			body.salesOrder = { id: additionalFields.salesOrderId };
		}

		// Tags (comma-separated string to array)
		if (additionalFields.tags !== undefined && (additionalFields.tags as string) !== '') {
			body.tags = (additionalFields.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean).map(t => ({ title: t }));
		}

		// Print settings (fixedCollection)
		if (additionalFields.printSettings !== undefined) {
			const ps = (additionalFields.printSettings as IDataObject).settings as IDataObject;
			if (ps !== undefined) body.printSettings = ps;
		}

		return xentralRequest.call(this, 'POST', 'productions', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		assertSafeId(productionId, 'productionId');
		return xentralRequest.call(this, 'GET', `productions/${productionId}`, {}, {}, 'v3');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV3GetAll.call(this, 'productions', {}, limit, maxPages);
	}

	if (operation === 'attachFile') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		assertSafeId(productionId, 'productionId');
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
		return xentralFileUpload.call(this, `productions/${productionId}/files`, binaryPropertyName, itemIndex);
	}

	if (operation === 'delete') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		assertSafeId(productionId, 'productionId');
		return xentralRequest.call(this, 'DELETE', `productions/${productionId}`, {}, {}, 'v3');
	}

	if (operation === 'release') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		assertSafeId(productionId, 'productionId');
		return xentralRequest.call(this, 'PATCH', `productions/${productionId}/actions/release`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'start') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		assertSafeId(productionId, 'productionId');
		return xentralRequest.call(this, 'PATCH', `productions/${productionId}/actions/start`, {} as IDataObject, {}, 'v3');
	}

	if (operation === 'logActivity') {
		const productionId = this.getNodeParameter('productionId', itemIndex) as string;
		assertSafeId(productionId, 'productionId');
		const activityMessage = this.getNodeParameter('activityMessage', itemIndex) as string;
		const body: IDataObject = { message: activityMessage };
		return xentralRequest.call(this, 'PATCH', `productions/${productionId}/actions/logActivity`, body as IDataObject, {}, 'v3');
	}

	throw new Error(`Unknown production operation: ${operation}`);
}
