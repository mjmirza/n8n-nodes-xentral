import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId } from '../../transport';

export async function handleContact(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const customerId = this.getNodeParameter('customerId', itemIndex) as string;
	assertSafeId(customerId, 'customerId');

	if (operation === 'create') {
		const name = this.getNodeParameter('contactName', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			name,
		};

		if (additionalFields.email !== undefined) body.email = additionalFields.email;
		if (additionalFields.phone !== undefined) body.phone = additionalFields.phone;
		if (additionalFields.position !== undefined) body.position = additionalFields.position;
		if (additionalFields.department !== undefined) body.department = additionalFields.department;

		return xentralRequest.call(this, 'POST', `customers/${customerId}/contactPerson`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const contactId = this.getNodeParameter('contactId', itemIndex) as string;
		assertSafeId(contactId, 'contactId');
		return xentralRequest.call(this, 'GET', `customers/${customerId}/contactPerson/${contactId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, `customers/${customerId}/contactPerson`, {}, limit, maxPages);
	}

	if (operation === 'update') {
		const contactId = this.getNodeParameter('contactId', itemIndex) as string;
		assertSafeId(contactId, 'contactId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (updateFields.contactName !== undefined) body.name = updateFields.contactName;
		if (updateFields.email !== undefined) body.email = updateFields.email;
		if (updateFields.phone !== undefined) body.phone = updateFields.phone;
		if (updateFields.position !== undefined) body.position = updateFields.position;
		if (updateFields.department !== undefined) body.department = updateFields.department;

		return xentralRequest.call(this, 'PATCH', `customers/${customerId}/contactPerson/${contactId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const contactId = this.getNodeParameter('contactId', itemIndex) as string;
		assertSafeId(contactId, 'contactId');
		return xentralRequest.call(this, 'DELETE', `customers/${customerId}/contactPerson/${contactId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown contact operation: ${operation}`);
}
