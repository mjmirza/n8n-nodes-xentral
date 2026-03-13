import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, assertSafeId, assertNonEmptyBody } from '../../transport';

export async function handleAddress(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		const type = this.getNodeParameter('addressType', itemIndex) as string;
		const street = this.getNodeParameter('street', itemIndex) as string;
		const zip = this.getNodeParameter('zipCode', itemIndex) as string;
		const city = this.getNodeParameter('city', itemIndex) as string;
		const country = this.getNodeParameter('country', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			type,
			street,
			zip,
			city,
			country,
		};

		if (additionalFields.company !== undefined) body.company = additionalFields.company;
		if (additionalFields.firstName !== undefined) body.firstName = additionalFields.firstName;
		if (additionalFields.lastName !== undefined) body.lastName = additionalFields.lastName;
		if (additionalFields.state !== undefined) body.state = additionalFields.state;
		if (additionalFields.name !== undefined) body.name = additionalFields.name;
		if (additionalFields.addressSupplement !== undefined) body.addressSupplement = additionalFields.addressSupplement;
		if (additionalFields.department !== undefined) body.department = additionalFields.department;
		if (additionalFields.subDepartment !== undefined) body.subDepartment = additionalFields.subDepartment;

		assertSafeId(customerId, 'customerId');
		return xentralRequest.call(this, 'POST', `customers/${customerId}/addresses`, body as IDataObject, {}, 'v2');
	}

	if (operation === 'getAll') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		assertSafeId(customerId, 'customerId');
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const response = await xentralRequest.call(this, 'GET', `customers/${customerId}/addresses`, {}, {}, 'v2');
		const items = (response.data || []) as IDataObject[];
		return limit ? items.slice(0, limit) : items;
	}

	if (operation === 'update') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		assertSafeId(customerId, 'customerId');
		const addressId = this.getNodeParameter('addressId', itemIndex) as string;
		assertSafeId(addressId, 'addressId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.addressType !== undefined) body.type = updateFields.addressType;
		if (updateFields.company !== undefined) body.company = updateFields.company;
		if (updateFields.firstName !== undefined) body.firstName = updateFields.firstName;
		if (updateFields.lastName !== undefined) body.lastName = updateFields.lastName;
		if (updateFields.street !== undefined) body.street = updateFields.street;
		if (updateFields.zipCode !== undefined) body.zip = updateFields.zipCode;
		if (updateFields.city !== undefined) body.city = updateFields.city;
		if (updateFields.state !== undefined) body.state = updateFields.state;
		if (updateFields.country !== undefined) body.country = updateFields.country;
		if (updateFields.name !== undefined) body.name = updateFields.name;
		if (updateFields.addressSupplement !== undefined) body.addressSupplement = updateFields.addressSupplement;

		assertNonEmptyBody(body, 'address update');
		return xentralRequest.call(this, 'PATCH', `customers/${customerId}/addresses/${addressId}`, body as IDataObject, {}, 'v2');
	}

	if (operation === 'delete') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		assertSafeId(customerId, 'customerId');
		const addressId = this.getNodeParameter('addressId', itemIndex) as string;
		assertSafeId(addressId, 'addressId');
		return xentralRequest.call(this, 'DELETE', `customers/${customerId}/addresses/${addressId}`, {}, {}, 'v2');
	}

	throw new Error(`Unknown address operation: ${operation}`);
}
