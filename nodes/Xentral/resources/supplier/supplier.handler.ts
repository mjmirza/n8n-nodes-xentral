import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1CursorGetAll } from '../../transport';

export async function handleSupplier(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const type = this.getNodeParameter('supplierType', itemIndex, 'company') as string;
		const name = this.getNodeParameter('supplierName', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			type,
			general: {
				name,
				email: additionalFields.email || undefined,
				phone: additionalFields.phone || undefined,
				fax: additionalFields.fax || undefined,
				vatNumber: additionalFields.vatId || undefined,
				paymentMethod: additionalFields.paymentMethod || undefined,
				language: additionalFields.language || undefined,
				address: {
					street: additionalFields.street || undefined,
					zip: additionalFields.zipCode || undefined,
					city: additionalFields.city || undefined,
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

		return xentralRequest.call(this, 'POST', 'suppliers', body as IDataObject, {}, 'v3');
	}

	if (operation === 'get') {
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `supplier/${supplierId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1CursorGetAll.call(this, 'supplier', {}, limit);
	}

	if (operation === 'update') {
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		const general: IDataObject = {};
		const address: IDataObject = {};

		if (updateFields.supplierName) general.name = updateFields.supplierName;
		if (updateFields.email) general.email = updateFields.email;
		if (updateFields.phone) general.phone = updateFields.phone;
		if (updateFields.fax) general.fax = updateFields.fax;
		if (updateFields.vatId) general.vatNumber = updateFields.vatId;
		if (updateFields.paymentMethod) general.paymentMethod = updateFields.paymentMethod;
		if (updateFields.language) general.language = updateFields.language;
		if (updateFields.street) address.street = updateFields.street;
		if (updateFields.zipCode) address.zip = updateFields.zipCode;
		if (updateFields.city) address.city = updateFields.city;
		if (updateFields.country) address.country = updateFields.country;

		if (Object.keys(address).length > 0) general.address = address;
		if (Object.keys(general).length > 0) body.general = general;
		if (updateFields.supplierType) body.type = updateFields.supplierType;

		return xentralRequest.call(this, 'PATCH', `suppliers/${supplierId}`, body as IDataObject, {}, 'v3');
	}

	if (operation === 'delete') {
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `supplier/${supplierId}`, {}, {}, 'v1');
	}

	if (operation === 'search') {
		const searchTerm = this.getNodeParameter('searchTerm', itemIndex) as string;
		const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
		return xentralV1CursorGetAll.call(this, 'supplier', { 'filter[name]': searchTerm }, limit);
	}

	throw new Error(`Unknown supplier operation: ${operation}`);
}
