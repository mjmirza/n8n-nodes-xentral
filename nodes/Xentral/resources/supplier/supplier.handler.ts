import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleSupplier(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') {
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `suppliers/${supplierId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'suppliers', {}, limit);
	}

	if (operation === 'update') {
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		const general: IDataObject = {};
		const address: IDataObject = {};

		if (updateFields.supplierName !== undefined) general.name = updateFields.supplierName;
		if (updateFields.email !== undefined) general.email = updateFields.email;
		if (updateFields.phone !== undefined) general.phone = updateFields.phone;
		if (updateFields.fax !== undefined) general.fax = updateFields.fax;
		if (updateFields.vatId !== undefined) general.vatNumber = updateFields.vatId;
		if (updateFields.paymentMethod !== undefined) general.paymentMethod = updateFields.paymentMethod;
		if (updateFields.language !== undefined) general.language = updateFields.language;
		if (updateFields.street !== undefined) address.street = updateFields.street;
		if (updateFields.zipCode !== undefined) address.zip = updateFields.zipCode;
		if (updateFields.city !== undefined) address.city = updateFields.city;
		if (updateFields.country !== undefined) address.country = updateFields.country;

		if (Object.keys(address).length > 0) general.address = address;
		if (Object.keys(general).length > 0) body.general = general;
		if (updateFields.supplierType !== undefined) body.type = updateFields.supplierType;

		return xentralRequest.call(this, 'PATCH', `suppliers/${supplierId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'search') {
		const searchTerm = this.getNodeParameter('searchTerm', itemIndex) as string;
		const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
		return xentralV1PageGetAll.call(this, 'suppliers', {
			'filter[0][key]': 'name',
			'filter[0][op]': 'contains',
			'filter[0][value]': searchTerm,
		}, limit);
	}

	throw new Error(`Unknown supplier operation: ${operation}`);
}
