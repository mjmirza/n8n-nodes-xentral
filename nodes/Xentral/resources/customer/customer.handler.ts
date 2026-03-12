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
				honorific: additionalFields.honorific || undefined,
				email: additionalFields.email || undefined,
				phone: additionalFields.phone || undefined,
				fax: additionalFields.fax || undefined,
				mobile: additionalFields.mobile || undefined,
				vatNumber: additionalFields.vatId || undefined,
				address: {
					street: additionalFields.street || undefined,
					zip: additionalFields.zipCode || undefined,
					city: additionalFields.city || undefined,
					state: additionalFields.state || undefined,
					country: additionalFields.country || undefined,
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

		if (updateFields.companyName) general.name = updateFields.companyName;
		if (updateFields.email) general.email = updateFields.email;
		if (updateFields.phone) general.phone = updateFields.phone;
		if (updateFields.fax) general.fax = updateFields.fax;
		if (updateFields.mobile) general.mobile = updateFields.mobile;
		if (updateFields.honorific) general.honorific = updateFields.honorific;
		if (updateFields.vatId) general.vatNumber = updateFields.vatId;
		if (updateFields.street) address.street = updateFields.street;
		if (updateFields.zipCode) address.zip = updateFields.zipCode;
		if (updateFields.city) address.city = updateFields.city;
		if (updateFields.state) address.state = updateFields.state;
		if (updateFields.country) address.country = updateFields.country;

		if (Object.keys(address).length > 0) general.address = address;
		if (Object.keys(general).length > 0) body.general = general;
		if (updateFields.customerType) body.type = updateFields.customerType;

		return xentralRequest.call(this, 'PATCH', `customers/${customerId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `customers/${customerId}`, {}, {}, 'v1');
	}

	if (operation === 'search') {
		const searchTerm = this.getNodeParameter('searchTerm', itemIndex) as string;
		const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
		return xentralV1CursorGetAll.call(this, 'customers', { 'filter[name]': searchTerm }, limit);
	}

	throw new Error(`Unknown customer operation: ${operation}`);
}
