import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId } from '../../transport';

export async function handleShipment(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const type = this.getNodeParameter('shipmentType', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = { type };

		if (additionalFields.salesOrderId !== undefined) body.salesOrderId = additionalFields.salesOrderId;
		if (additionalFields.carrier !== undefined) body.carrier = additionalFields.carrier;
		if (additionalFields.trackingNumber !== undefined) body.trackingNumber = additionalFields.trackingNumber;
		if (additionalFields.weight !== undefined) body.weight = additionalFields.weight;

		return xentralRequest.call(this, 'POST', 'shipments', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const shipmentId = this.getNodeParameter('shipmentId', itemIndex) as string;
		assertSafeId(shipmentId, 'shipmentId');
		return xentralRequest.call(this, 'GET', `shipments/${shipmentId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'shipments', {}, limit, maxPages);
	}

	throw new Error(`Unknown shipment operation: ${operation}`);
}
