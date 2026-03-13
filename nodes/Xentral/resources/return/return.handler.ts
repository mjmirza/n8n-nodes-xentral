import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId } from '../../transport';

export async function handleReturn(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex, '') as string;
		const customerId = this.getNodeParameter('customerId', itemIndex, '') as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		if (salesOrderId) {
			assertSafeId(salesOrderId, 'salesOrderId');
			body.salesOrder = { id: salesOrderId };
		}
		if (customerId) {
			assertSafeId(customerId, 'customerId');
			body.customer = { id: customerId };
		}
		if (additionalFields.reason !== undefined) body.reason = additionalFields.reason;
		if (additionalFields.internalNote !== undefined) body.internalNote = additionalFields.internalNote;

		return xentralRequest.call(this, 'POST', 'returns', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		return xentralRequest.call(this, 'GET', `returns/${returnId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'returns', {}, limit, maxPages);
	}

	if (operation === 'delete') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		return xentralRequest.call(this, 'DELETE', `returns/${returnId}`, {}, {}, 'v1');
	}

	if (operation === 'release') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		return xentralRequest.call(this, 'POST', `returns/${returnId}/actions/release`, {} as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown return operation: ${operation}`);
}
