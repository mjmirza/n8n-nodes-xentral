import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmpty, assertNonEmptyBody } from '../../transport';

// All flat fields that map directly to the V2 addresses API
const ADDRESS_DIRECT_FIELDS = [
	'addressSupplement',
	'department',
	'salutation',
	'state',
	'subDepartment',
	'type',
] as const;

// Fields that belong in the contactDetails object
const CONTACT_DETAIL_FIELDS = ['email', 'phone', 'gln'] as const;

export async function handleAddress(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const customerId = this.getNodeParameter('customerId', itemIndex) as string;
	assertSafeId(customerId, 'customerId');
	const basePath = `customers/${customerId}/addresses`;

	if (operation === 'create') {
		const name = assertNonEmpty(this.getNodeParameter('name', itemIndex) as string, 'Name');
		const street = assertNonEmpty(this.getNodeParameter('street', itemIndex) as string, 'Street');
		const city = assertNonEmpty(this.getNodeParameter('city', itemIndex) as string, 'City');
		const zip = assertNonEmpty(this.getNodeParameter('zip', itemIndex) as string, 'ZIP Code');
		const country = assertNonEmpty(this.getNodeParameter('country', itemIndex) as string, 'Country');
		const type = assertNonEmpty(this.getNodeParameter('type', itemIndex) as string, 'Address Type');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			name,
			street,
			city,
			zip,
			country,
			type,
		};

		for (const field of ADDRESS_DIRECT_FIELDS) {
			if (additionalFields[field] !== undefined) {
				body[field] = additionalFields[field];
			}
		}

		// Build contactDetails object from flat fields
		const contactDetails: IDataObject = {};
		for (const field of CONTACT_DETAIL_FIELDS) {
			if (additionalFields[field] !== undefined) {
				contactDetails[field] = additionalFields[field];
			}
		}
		if (Object.keys(contactDetails).length > 0) {
			body.contactDetails = contactDetails;
		}

		// Build deliveryDetails object from fixedCollection
		const deliveryDetailsCollection = additionalFields.deliveryDetails as IDataObject | undefined;
		if (deliveryDetailsCollection?.deliveryDetailsValues) {
			const vals = deliveryDetailsCollection.deliveryDetailsValues as IDataObject;
			const deliveryDetails: IDataObject = {};
			if (vals.defaultDeliveryAddress !== undefined) deliveryDetails.defaultDeliveryAddress = vals.defaultDeliveryAddress;
			if (vals.termsOfDelivery !== undefined && vals.termsOfDelivery !== '') deliveryDetails.termsOfDelivery = vals.termsOfDelivery;
			if (vals.vatId !== undefined && vals.vatId !== '') deliveryDetails.vatId = vals.vatId;
			if (vals.taxType !== undefined && vals.taxType !== '') deliveryDetails.taxType = vals.taxType;
			if (vals.internalComment !== undefined && vals.internalComment !== '') deliveryDetails.internalComment = vals.internalComment;
			if (vals.note !== undefined && vals.note !== '') deliveryDetails.note = vals.note;
			if (Object.keys(deliveryDetails).length > 0) {
				body.deliveryDetails = deliveryDetails;
			}
		}

		return xentralRequest.call(this, 'POST', basePath, body as IDataObject, {}, 'v2');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, basePath, {}, limit, maxPages, 'v2');
	}

	if (operation === 'update') {
		const addressId = this.getNodeParameter('addressId', itemIndex) as string;
		assertSafeId(addressId, 'addressId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		// Core fields on update
		if (updateFields.name !== undefined) body.name = updateFields.name;
		if (updateFields.street !== undefined) body.street = updateFields.street;
		if (updateFields.city !== undefined) body.city = updateFields.city;
		if (updateFields.zip !== undefined) body.zip = updateFields.zip;
		if (updateFields.country !== undefined) body.country = updateFields.country;

		for (const field of ADDRESS_DIRECT_FIELDS) {
			if (updateFields[field] !== undefined) {
				body[field] = updateFields[field];
			}
		}

		// Build contactDetails object from flat fields
		const contactDetails: IDataObject = {};
		for (const field of CONTACT_DETAIL_FIELDS) {
			if (updateFields[field] !== undefined) {
				contactDetails[field] = updateFields[field];
			}
		}
		if (Object.keys(contactDetails).length > 0) {
			body.contactDetails = contactDetails;
		}

		// Build deliveryDetails object from fixedCollection
		const deliveryDetailsCollection = updateFields.deliveryDetails as IDataObject | undefined;
		if (deliveryDetailsCollection?.deliveryDetailsValues) {
			const vals = deliveryDetailsCollection.deliveryDetailsValues as IDataObject;
			const deliveryDetails: IDataObject = {};
			if (vals.defaultDeliveryAddress !== undefined) deliveryDetails.defaultDeliveryAddress = vals.defaultDeliveryAddress;
			if (vals.termsOfDelivery !== undefined && vals.termsOfDelivery !== '') deliveryDetails.termsOfDelivery = vals.termsOfDelivery;
			if (vals.vatId !== undefined && vals.vatId !== '') deliveryDetails.vatId = vals.vatId;
			if (vals.taxType !== undefined && vals.taxType !== '') deliveryDetails.taxType = vals.taxType;
			if (vals.internalComment !== undefined && vals.internalComment !== '') deliveryDetails.internalComment = vals.internalComment;
			if (vals.note !== undefined && vals.note !== '') deliveryDetails.note = vals.note;
			if (Object.keys(deliveryDetails).length > 0) {
				body.deliveryDetails = deliveryDetails;
			}
		}

		assertNonEmptyBody(body, 'address update');
		return xentralRequest.call(this, 'PATCH', `${basePath}/${addressId}`, body as IDataObject, {}, 'v2');
	}

	if (operation === 'delete') {
		const addressId = this.getNodeParameter('addressId', itemIndex) as string;
		assertSafeId(addressId, 'addressId');
		return xentralRequest.call(this, 'DELETE', `${basePath}/${addressId}`, {}, {}, 'v2');
	}

	throw new Error(`Unknown address operation: ${operation}`);
}
