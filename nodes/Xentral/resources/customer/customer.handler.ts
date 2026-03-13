import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1CursorGetAll } from '../../transport';

export async function handleCustomer(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const type = this.getNodeParameter('customerType', itemIndex, 'company') as string;
		const name = this.getNodeParameter('companyName', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			type,
			general: {
				name,
				honorific: additionalFields.honorific !== undefined ? additionalFields.honorific : undefined,
				email: additionalFields.email !== undefined ? additionalFields.email : undefined,
				phone: additionalFields.phone !== undefined ? additionalFields.phone : undefined,
				fax: additionalFields.fax !== undefined ? additionalFields.fax : undefined,
				mobile: additionalFields.mobile !== undefined ? additionalFields.mobile : undefined,
				vatNumber: additionalFields.vatId !== undefined ? additionalFields.vatId : undefined,
				address: {
					street: additionalFields.street !== undefined ? additionalFields.street : undefined,
					zip: additionalFields.zipCode !== undefined ? additionalFields.zipCode : undefined,
					city: additionalFields.city !== undefined ? additionalFields.city : undefined,
					state: additionalFields.state !== undefined ? additionalFields.state : undefined,
					country: additionalFields.country !== undefined ? additionalFields.country : undefined,
				},
			},
		};

		// Clean undefined values
		const general = body.general as IDataObject;
		Object.keys(general).forEach((key) => {
			if (general[key] === undefined) delete general[key];
		});
		const address = (general.address as IDataObject) || {};
		Object.keys(address).forEach((key) => {
			if (address[key] === undefined) delete address[key];
		});
		if (Object.keys(address).length === 0) delete general.address;

		if (additionalFields.firstName !== undefined) general.firstName = additionalFields.firstName;
		if (additionalFields.lastName !== undefined) general.lastName = additionalFields.lastName;
		if (additionalFields.customerNumber !== undefined) body.customerNumber = additionalFields.customerNumber;
		if (additionalFields.paymentMethod !== undefined) body.paymentMethod = additionalFields.paymentMethod;
		if (additionalFields.language !== undefined) body.language = additionalFields.language;

		return xentralRequest.call(this, 'POST', 'customers', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `customers/${customerId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1CursorGetAll.call(this, 'customers', {}, limit);
	}

	if (operation === 'update') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		const general: IDataObject = {};
		const address: IDataObject = {};

		if (updateFields.companyName !== undefined) general.name = updateFields.companyName;
		if (updateFields.email !== undefined) general.email = updateFields.email;
		if (updateFields.phone !== undefined) general.phone = updateFields.phone;
		if (updateFields.fax !== undefined) general.fax = updateFields.fax;
		if (updateFields.mobile !== undefined) general.mobile = updateFields.mobile;
		if (updateFields.firstName !== undefined) general.firstName = updateFields.firstName;
		if (updateFields.lastName !== undefined) general.lastName = updateFields.lastName;
		if (updateFields.honorific !== undefined) general.honorific = updateFields.honorific;
		if (updateFields.vatId !== undefined) general.vatNumber = updateFields.vatId;
		if (updateFields.street !== undefined) address.street = updateFields.street;
		if (updateFields.zipCode !== undefined) address.zip = updateFields.zipCode;
		if (updateFields.city !== undefined) address.city = updateFields.city;
		if (updateFields.state !== undefined) address.state = updateFields.state;
		if (updateFields.country !== undefined) address.country = updateFields.country;

		if (Object.keys(address).length > 0) general.address = address;
		if (Object.keys(general).length > 0) body.general = general;
		if (updateFields.customerType !== undefined) body.type = updateFields.customerType;

		return xentralRequest.call(this, 'PATCH', `customers/${customerId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `customers/${customerId}`, {}, {}, 'v1');
	}

	if (operation === 'search') {
		const searchTerm = this.getNodeParameter('searchTerm', itemIndex) as string;
		const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
		return xentralV1CursorGetAll.call(this, 'customers', {
			'filter[0][key]': 'name',
			'filter[0][op]': 'contains',
			'filter[0][value]': searchTerm,
		}, limit);
	}

	throw new Error(`Unknown customer operation: ${operation}`);
}
