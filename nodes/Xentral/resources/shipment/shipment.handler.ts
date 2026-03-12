import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleShipment(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const salesOrderId = this.getNodeParameter('salesOrderId', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			salesOrderId,
		};

		if (additionalFields.carrier) body.carrier = additionalFields.carrier;
		if (additionalFields.trackingNumber) body.trackingNumber = additionalFields.trackingNumber;
		if (additionalFields.weight) body.weight = additionalFields.weight;
		if (additionalFields.deliveryNoteId) body.deliveryNoteId = additionalFields.deliveryNoteId;

		return xentralRequest.call(this, 'POST', 'shipment', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const shipmentId = this.getNodeParameter('shipmentId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `shipment/${shipmentId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'delivery', {}, limit);
	}

	throw new Error(`Unknown shipment operation: ${operation}`);
}
