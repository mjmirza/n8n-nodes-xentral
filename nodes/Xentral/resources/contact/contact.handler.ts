import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmpty, assertNonEmptyBody } from '../../transport';

function buildContactBody(fields: IDataObject): IDataObject {
	const body: IDataObject = {};

	// Simple top-level fields
	if (fields.contactName !== undefined) body.name = fields.contactName;
	if (fields.title !== undefined) body.title = fields.title;
	if (fields.position !== undefined) body.position = fields.position;
	if (fields.department !== undefined) body.department = fields.department;
	if (fields.subDepartment !== undefined) body.subDepartment = fields.subDepartment;
	if (fields.birthday !== undefined) body.birthday = fields.birthday;
	if (fields.birthdayShowInCalendar !== undefined) body.birthdayShowInCalendar = fields.birthdayShowInCalendar;
	if (fields.sendBirthdayCard !== undefined) body.sendBirthdayCard = fields.sendBirthdayCard;
	if (fields.comment !== undefined) body.comment = fields.comment;
	if (fields.language !== undefined) body.language = fields.language;
	if (fields.marketingBan !== undefined) body.marketingBan = fields.marketingBan;
	if (fields.others !== undefined) body.others = fields.others;
	if (fields.type !== undefined) body.type = fields.type;

	// contact object (email, phone, fax, mobile, salutation)
	const contact: IDataObject = {};
	if (fields.email !== undefined) contact.email = fields.email;
	if (fields.phone !== undefined) contact.phone = fields.phone;
	if (fields.fax !== undefined) contact.fax = fields.fax;
	if (fields.mobile !== undefined) contact.mobile = fields.mobile;
	if (fields.contactSalutation !== undefined) contact.salutation = fields.contactSalutation;
	if (Object.keys(contact).length > 0) body.contact = contact;

	// address object
	const address: IDataObject = {};
	if (fields.street !== undefined) address.street = fields.street;
	if (fields.additionalStreet !== undefined) address.additionalStreet = fields.additionalStreet;
	if (fields.addressState !== undefined) address.state = fields.addressState;
	if (fields.zipCode !== undefined) address.zip = fields.zipCode;
	if (fields.city !== undefined) address.city = fields.city;
	if (fields.country !== undefined) address.country = fields.country;
	if (Object.keys(address).length > 0) body.address = address;

	// groups: comma-separated string to the array of id strings Xentral expects
	if (fields.groups !== undefined) {
		const groupStr = (fields.groups as string).trim();
		if (groupStr) {
			body.groups = groupStr.split(',').map((g: string) => g.trim()).filter((g: string) => g !== '');
		}
	}

	return body;
}

export async function handleContact(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const customerId = this.getNodeParameter('customerId', itemIndex) as string;
	assertSafeId(customerId, 'customerId');

	if (operation === 'create') {
		const name = assertNonEmpty(this.getNodeParameter('contactName', itemIndex) as string, 'Contact Name');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body = buildContactBody(additionalFields);
		body.name = name;

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

		const body = buildContactBody(updateFields);
		assertNonEmptyBody(body, 'contact update');

		return xentralRequest.call(this, 'PATCH', `customers/${customerId}/contactPerson/${contactId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const contactId = this.getNodeParameter('contactId', itemIndex) as string;
		assertSafeId(contactId, 'contactId');
		return xentralRequest.call(this, 'DELETE', `customers/${customerId}/contactPerson/${contactId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown contact operation: ${operation}`);
}
