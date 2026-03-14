import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmpty, assertNonEmptyBody } from '../../transport';

function buildShippingMethodBody(fields: IDataObject, name?: string): IDataObject {
	const body: IDataObject = {};

	if (name !== undefined) body.name = name;
	if (fields.name !== undefined) body.name = fields.name;
	if (fields.isActive !== undefined) body.isActive = fields.isActive;

	// Build carrier object from flat fields
	const hasCarrierFields = fields.carrierId !== undefined && fields.carrierId !== ''
		|| fields.carrierCredentials !== undefined && fields.carrierCredentials !== ''
		|| fields.carrierExtraField1 !== undefined && fields.carrierExtraField1 !== ''
		|| fields.carrierExtraField2 !== undefined && fields.carrierExtraField2 !== ''
		|| fields.carrierProductId !== undefined && fields.carrierProductId !== ''
		|| fields.carrierServiceUrl !== undefined && fields.carrierServiceUrl !== ''
		|| fields.carrierShipmentType !== undefined && fields.carrierShipmentType !== '';
	if (hasCarrierFields) {
		const carrier: IDataObject = {};
		if (fields.carrierId !== undefined && fields.carrierId !== '') {
			carrier.id = fields.carrierId;
		}
		if (fields.carrierCredentials !== undefined && fields.carrierCredentials !== '') {
			carrier.credentials = fields.carrierCredentials;
		}
		if (fields.carrierExtraField1 !== undefined && fields.carrierExtraField1 !== ''
			|| fields.carrierExtraField2 !== undefined && fields.carrierExtraField2 !== '') {
			const extra: IDataObject = {};
			if (fields.carrierExtraField1 !== undefined && fields.carrierExtraField1 !== '') {
				extra.field1 = fields.carrierExtraField1;
			}
			if (fields.carrierExtraField2 !== undefined && fields.carrierExtraField2 !== '') {
				extra.field2 = fields.carrierExtraField2;
			}
			carrier.extra = extra;
		}
		if (fields.carrierProductId !== undefined && fields.carrierProductId !== '') {
			carrier.product = { id: fields.carrierProductId };
		}
		if (fields.carrierServiceUrl !== undefined && fields.carrierServiceUrl !== '') {
			carrier.serviceUrl = fields.carrierServiceUrl;
		}
		if (fields.carrierShipmentType !== undefined && fields.carrierShipmentType !== '') {
			carrier.shipmentType = fields.carrierShipmentType;
		}
		body.carrier = carrier;
	}

	// JSON fields passed through directly
	if (fields.parcel !== undefined) {
		if (typeof fields.parcel === 'string') {
			try {
				body.parcel = JSON.parse(fields.parcel as string);
			} catch {
				throw new Error('Invalid JSON in parcel. Please provide valid JSON.');
			}
		} else {
			body.parcel = fields.parcel;
		}
	}
	if (fields.printers !== undefined) {
		if (typeof fields.printers === 'string') {
			try {
				body.printers = JSON.parse(fields.printers as string);
			} catch {
				throw new Error('Invalid JSON in printers. Please provide valid JSON.');
			}
		} else {
			body.printers = fields.printers;
		}
	}
	if (fields.sender !== undefined) {
		if (typeof fields.sender === 'string') {
			try {
				body.sender = JSON.parse(fields.sender as string);
			} catch {
				throw new Error('Invalid JSON in sender. Please provide valid JSON.');
			}
		} else {
			body.sender = fields.sender;
		}
	}

	// Project object ref (nullable)
	if (fields.projectId !== undefined) {
		body.project = fields.projectId ? { id: fields.projectId } : null;
	}

	return body;
}

export async function handleShippingMethod(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = assertNonEmpty(this.getNodeParameter('name', itemIndex) as string, 'Name');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
		const body = buildShippingMethodBody(additionalFields, name);
		return xentralRequest.call(this, 'POST', 'shippingMethods', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const shippingMethodId = this.getNodeParameter('shippingMethodId', itemIndex) as string;
		assertSafeId(shippingMethodId, 'shippingMethodId');
		return xentralRequest.call(this, 'GET', `shippingMethods/${shippingMethodId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'shippingMethods', {}, limit, maxPages);
	}

	if (operation === 'update') {
		const shippingMethodId = this.getNodeParameter('shippingMethodId', itemIndex) as string;
		assertSafeId(shippingMethodId, 'shippingMethodId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;
		const body = buildShippingMethodBody(updateFields);

		assertNonEmptyBody(body, 'shipping method update');
		// Note: shippingMethod update uses PUT, not PATCH
		return xentralRequest.call(this, 'PUT', `shippingMethods/${shippingMethodId}`, body as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown shippingMethod operation: ${operation}`);
}
