import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, assertSafeId } from '../../transport';

export async function handleShipment(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const deliveryNoteId = this.getNodeParameter('deliveryNoteId', itemIndex) as string;
		assertSafeId(deliveryNoteId, 'deliveryNoteId');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			deliveryNote: { id: deliveryNoteId },
			type: 'deliveryNote',
		};

		// Direct fields
		const directFields = [
			'parcelCount',
			'sendTrackingMail',
			'sentAt',
			'trackingLink',
			'trackingNumber',
			'updateDeliveryNoteShippingMethod',
			'weight',
		];

		for (const key of directFields) {
			if (additionalFields[key] !== undefined && additionalFields[key] !== '') {
				body[key] = additionalFields[key];
			}
		}

		// Shipping method ref (nullable)
		if (additionalFields.shippingMethodId !== undefined) {
			body.shippingMethod = additionalFields.shippingMethodId !== ''
				? { id: additionalFields.shippingMethodId }
				: null;
		}

		return xentralRequest.call(this, 'POST', 'shipments', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const shipmentId = this.getNodeParameter('shipmentId', itemIndex) as string;
		assertSafeId(shipmentId, 'shipmentId');
		return xentralRequest.call(this, 'GET', `shipments/${shipmentId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown shipment operation: ${operation}`);
}
