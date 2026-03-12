import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleContact(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const customerId = this.getNodeParameter('customerId', itemIndex) as string;

	if (operation === 'create') {
		const firstName = this.getNodeParameter('firstName', itemIndex) as string;
		const lastName = this.getNodeParameter('lastName', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			firstName,
			lastName,
			email: additionalFields.email || undefined,
			phone: additionalFields.phone || undefined,
			position: additionalFields.position || undefined,
			department: additionalFields.department || undefined,
		};

		// Clean undefined values
		Object.keys(body).forEach((key) => {
			if (body[key] === undefined) delete body[key];
		});

		return xentralRequest.call(this, 'POST', `customers/${customerId}/contacts`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const contactId = this.getNodeParameter('contactId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `customers/${customerId}/contacts/${contactId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, `customers/${customerId}/contacts`, {}, limit);
	}

	if (operation === 'update') {
		const contactId = this.getNodeParameter('contactId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.firstName) body.firstName = updateFields.firstName;
		if (updateFields.lastName) body.lastName = updateFields.lastName;
		if (updateFields.email) body.email = updateFields.email;
		if (updateFields.phone) body.phone = updateFields.phone;
		if (updateFields.position) body.position = updateFields.position;
		if (updateFields.department) body.department = updateFields.department;

		return xentralRequest.call(this, 'PATCH', `customers/${customerId}/contacts/${contactId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const contactId = this.getNodeParameter('contactId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `customers/${customerId}/contacts/${contactId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown contact operation: ${operation}`);
}
