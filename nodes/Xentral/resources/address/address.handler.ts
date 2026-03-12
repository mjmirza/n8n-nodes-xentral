import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleAddress(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const customerId = this.getNodeParameter('customerId', itemIndex, '') as string;
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
			company: additionalFields.company || undefined,
			firstName: additionalFields.firstName || undefined,
			lastName: additionalFields.lastName || undefined,
			state: additionalFields.state || undefined,
		};

		if (customerId) {
			body.customerId = customerId;
		}

		// Clean undefined values
		Object.keys(body).forEach((key) => {
			if (body[key] === undefined) delete body[key];
		});

		return xentralRequest.call(this, 'POST', 'customer-address', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const addressId = this.getNodeParameter('addressId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `customer-address/${addressId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const query: IDataObject = {};
		const customerId = this.getNodeParameter('customerId', itemIndex, '') as string;
		if (customerId) {
			query['filter[customerId]'] = customerId;
		}
		return xentralV1PageGetAll.call(this, 'customer-address', query, limit);
	}

	if (operation === 'update') {
		const addressId = this.getNodeParameter('addressId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.addressType) body.type = updateFields.addressType;
		if (updateFields.company) body.company = updateFields.company;
		if (updateFields.firstName) body.firstName = updateFields.firstName;
		if (updateFields.lastName) body.lastName = updateFields.lastName;
		if (updateFields.street) body.street = updateFields.street;
		if (updateFields.zipCode) body.zip = updateFields.zipCode;
		if (updateFields.city) body.city = updateFields.city;
		if (updateFields.state) body.state = updateFields.state;
		if (updateFields.country) body.country = updateFields.country;

		return xentralRequest.call(this, 'PATCH', `customer-address/${addressId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const addressId = this.getNodeParameter('addressId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `customer-address/${addressId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown address operation: ${operation}`);
}
