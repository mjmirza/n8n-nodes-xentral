import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { xentralRequest, xentralV1CursorGetAll, assertSafeId, assertNonEmpty, assertNonEmptyBody } from '../../transport';
import { runCustomerSearch } from './customer.search';

// autoCreateDocuments takes both, delivery_note or invoice. The explicit type wins; the old
// boolean maps true to both and leaves the setting untouched when false.
function autoCreateDocumentsValue(fields: IDataObject): string | undefined {
	const type = fields.autoCreateDocumentsType;
	if (typeof type === 'string' && type !== '') return type;
	if (fields.autoCreateDocuments === true) return 'both';
	return undefined;
}

// These fields are text inputs in the node, the API wants JSON booleans.
function toBoolean(value: unknown): IDataObject[string] {
	if (typeof value !== 'string') return value as IDataObject[string];
	const v = value.trim().toLowerCase();
	return v === 'true' ? true : v === 'false' ? false : value;
}

export async function handleCustomer(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const salutation = this.getNodeParameter('salutation', itemIndex, 'company') as string;
		const name = assertNonEmpty(this.getNodeParameter('name', itemIndex) as string, 'Name');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			salutation,
			name,
		};

		// Simple top-level fields
		if (additionalFields.customerType !== undefined) body.customerType = additionalFields.customerType;
		if (additionalFields.firstname !== undefined) body.firstname = additionalFields.firstname;
		if (additionalFields.lastname !== undefined) body.lastname = additionalFields.lastname;
		if (additionalFields.title !== undefined) body.title = additionalFields.title;
		if (additionalFields.salutationPhrase !== undefined) body.salutationPhrase = additionalFields.salutationPhrase;
		if (additionalFields.department !== undefined) body.department = additionalFields.department;
		if (additionalFields.subDepartment !== undefined) body.subDepartment = additionalFields.subDepartment;
		if (additionalFields.birthdate !== undefined) body.birthdate = additionalFields.birthdate;
		if (additionalFields.number !== undefined) body.number = additionalFields.number;
		if (additionalFields.deviatingCustomerNumber !== undefined) body.deviatingCustomerNumber = additionalFields.deviatingCustomerNumber;
		if (additionalFields.isLead !== undefined) body.isLead = additionalFields.isLead;

		// customFields: JSON string to array of {id, value}
		if (additionalFields.customFields !== undefined) {
			try {
				body.customFields = JSON.parse(additionalFields.customFields as string);
			} catch {
				throw new NodeOperationError(this.getNode(), 'Custom Fields must be valid JSON', { itemIndex });
			}
		}

		// contactDetails object
		const contactDetails: IDataObject = {};
		if (additionalFields.email !== undefined) contactDetails.email = additionalFields.email;
		if (additionalFields.phone !== undefined) contactDetails.phone = additionalFields.phone;
		if (additionalFields.fax !== undefined) contactDetails.fax = additionalFields.fax;
		if (additionalFields.mobile !== undefined) contactDetails.mobile = additionalFields.mobile;
		if (additionalFields.website !== undefined) contactDetails.website = additionalFields.website;
		if (additionalFields.additionalContactData !== undefined) {
			try {
				contactDetails.additionalData = JSON.parse(additionalFields.additionalContactData as string);
			} catch {
				throw new NodeOperationError(this.getNode(), 'Additional Contact Data must be valid JSON', { itemIndex });
			}
		}
		if (Object.keys(contactDetails).length > 0) body.contactDetails = contactDetails;

		// documentDelivery object
		const documentDelivery: IDataObject = {};
		if (additionalFields.amountInvoicePrints !== undefined) documentDelivery.amountInvoicePrints = additionalFields.amountInvoicePrints;
		const autoCreate = autoCreateDocumentsValue(additionalFields);
		if (autoCreate !== undefined) documentDelivery.autoCreateDocuments = autoCreate;
		if (additionalFields.invoiceAlwaysPaper !== undefined) documentDelivery.invoiceAlwaysPaper = additionalFields.invoiceAlwaysPaper;
		if (additionalFields.preferFax !== undefined) documentDelivery.preferFax = additionalFields.preferFax;
		if (Object.keys(documentDelivery).length > 0) body.documentDelivery = documentDelivery;

		// financials object
		const financials: IDataObject = {};
		if (additionalFields.defaultCurrency !== undefined) financials.defaultCurrency = additionalFields.defaultCurrency;
		if (additionalFields.creditLimit !== undefined) financials.creditLimit = additionalFields.creditLimit;
		if (additionalFields.customsInformation !== undefined) financials.customsInformation = additionalFields.customsInformation;
		if (additionalFields.subscriptionPaymentMethod !== undefined) financials.subscriptionPaymentMethod = additionalFields.subscriptionPaymentMethod;
		// financials.paymentMethod nested object
		if (additionalFields.paymentMethodId !== undefined) financials.paymentMethod = { id: additionalFields.paymentMethodId };
		// financials.paymentTerms nested object
		const paymentTerms: IDataObject = {};
		if (additionalFields.fixedPaymentTerms !== undefined) paymentTerms.fixedPaymentTerms = toBoolean(additionalFields.fixedPaymentTerms);
		if (additionalFields.paymentTargetDays !== undefined) paymentTerms.paymentTargetDays = additionalFields.paymentTargetDays;
		if (additionalFields.paymentTargetDiscount !== undefined) paymentTerms.paymentTargetDiscount = additionalFields.paymentTargetDiscount;
		if (additionalFields.paymentTargetDiscountDays !== undefined) paymentTerms.paymentTargetDiscountDays = additionalFields.paymentTargetDiscountDays;
		if (Object.keys(paymentTerms).length > 0) financials.paymentTerms = paymentTerms;
		// financials.tax nested object
		const tax: IDataObject = {};
		if (additionalFields.taxNumber !== undefined) tax.taxNumber = additionalFields.taxNumber;
		if (additionalFields.vatId !== undefined) tax.vatId = additionalFields.vatId;
		if (additionalFields.taxDisplay !== undefined) tax.taxDisplay = additionalFields.taxDisplay;
		if (additionalFields.taxation !== undefined) tax.taxation = additionalFields.taxation;
		if (additionalFields.useDeliveryThreshold !== undefined) tax.useDeliveryThreshold = additionalFields.useDeliveryThreshold;
		if (Object.keys(tax).length > 0) financials.tax = tax;
		if (Object.keys(financials).length > 0) body.financials = financials;

		// shipping object
		const shipping: IDataObject = {};
		if (additionalFields.shippingMethodId !== undefined) shipping.shippingMethod = { id: additionalFields.shippingMethodId };
		if (additionalFields.freeShipping !== undefined) shipping.freeShipping = additionalFields.freeShipping;
		if (additionalFields.freeShippingFrom !== undefined) shipping.freeShippingFrom = additionalFields.freeShippingFrom;
		if (additionalFields.deliveryBan !== undefined) shipping.deliveryBan = additionalFields.deliveryBan;
		if (additionalFields.deliveryBanDate !== undefined) shipping.deliveryBanDate = additionalFields.deliveryBanDate;
		if (additionalFields.deliveryBanReason !== undefined) shipping.deliveryBanReason = additionalFields.deliveryBanReason;
		if (additionalFields.trackingMailBan !== undefined) shipping.trackingMailBan = additionalFields.trackingMailBan;
		if (Object.keys(shipping).length > 0) body.shipping = shipping;

		// primaryBankAccount object
		const primaryBankAccount: IDataObject = {};
		if (additionalFields.primaryBankAccountIban !== undefined) primaryBankAccount.iban = additionalFields.primaryBankAccountIban;
		if (additionalFields.primaryBankAccountBic !== undefined) primaryBankAccount.bic = additionalFields.primaryBankAccountBic;
		if (additionalFields.primaryBankAccountOwner !== undefined) primaryBankAccount.owner = additionalFields.primaryBankAccountOwner;
		if (additionalFields.bankName !== undefined) primaryBankAccount.bankName = additionalFields.bankName;
		// primaryBankAccount.sepa nested object
		const sepa: IDataObject = {};
		if (additionalFields.sepaCompanySepa !== undefined) sepa.companySepa = toBoolean(additionalFields.sepaCompanySepa);
		if (additionalFields.sepaInitial !== undefined) sepa.initial = toBoolean(additionalFields.sepaInitial);
		if (additionalFields.sepaMandateReference !== undefined) sepa.mandateReference = additionalFields.sepaMandateReference;
		if (additionalFields.sepaMandateReferenceChange !== undefined) sepa.mandateReferenceChange = toBoolean(additionalFields.sepaMandateReferenceChange);
		if (additionalFields.sepaMandateReferenceDate !== undefined) sepa.mandateReferenceDate = additionalFields.sepaMandateReferenceDate;
		if (additionalFields.sepaRemark !== undefined) sepa.remark = additionalFields.sepaRemark;
		if (additionalFields.sepaUsage !== undefined) sepa.usage = additionalFields.sepaUsage;
		if (Object.keys(sepa).length > 0) primaryBankAccount.sepa = sepa;
		if (Object.keys(primaryBankAccount).length > 0) body.primaryBankAccount = primaryBankAccount;

		// Object refs
		if (additionalFields.accountManagerId !== undefined) body.accountManager = { id: additionalFields.accountManagerId };
		if (additionalFields.projectId !== undefined) body.project = { id: additionalFields.projectId };
		if (additionalFields.salesManagerId !== undefined) body.salesManager = { id: additionalFields.salesManagerId };

		// groups: comma-separated string to array of integers
		if (additionalFields.groups !== undefined) {
			const groupStr = (additionalFields.groups as string).trim();
			if (groupStr) {
				body.groups = groupStr.split(',').map((g: string) => parseInt(g.trim(), 10));
			}
		}

		return xentralRequest.call(this, 'POST', 'customers', body as IDataObject, {}, 'v2');
	}

	if (operation === 'get') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		assertSafeId(customerId, 'customerId');
		return xentralRequest.call(this, 'GET', `customers/${customerId}`, {}, {}, 'v2');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1CursorGetAll.call(this, 'customers', {}, limit, maxPages, 'v2');
	}

	if (operation === 'update') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		assertSafeId(customerId, 'customerId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		// Simple top-level fields
		if (updateFields.customerType !== undefined) body.customerType = updateFields.customerType;
		if (updateFields.salutation !== undefined) body.salutation = updateFields.salutation;
		if (updateFields.salutationPhrase !== undefined) body.salutationPhrase = updateFields.salutationPhrase;
		if (updateFields.name !== undefined) body.name = updateFields.name;
		if (updateFields.firstname !== undefined) body.firstname = updateFields.firstname;
		if (updateFields.lastname !== undefined) body.lastname = updateFields.lastname;
		if (updateFields.title !== undefined) body.title = updateFields.title;
		if (updateFields.department !== undefined) body.department = updateFields.department;
		if (updateFields.subDepartment !== undefined) body.subDepartment = updateFields.subDepartment;
		if (updateFields.birthdate !== undefined) body.birthdate = updateFields.birthdate;
		if (updateFields.number !== undefined) body.number = updateFields.number;
		if (updateFields.deviatingCustomerNumber !== undefined) body.deviatingCustomerNumber = updateFields.deviatingCustomerNumber;
		if (updateFields.isLead !== undefined) body.isLead = updateFields.isLead;
		if (updateFields.commission !== undefined) body.commission = updateFields.commission;
		if (updateFields.contactPerson !== undefined) body.contactPerson = updateFields.contactPerson;
		if (updateFields.identifier !== undefined) body.identifier = updateFields.identifier;
		if (updateFields.language !== undefined) body.language = updateFields.language;
		if (updateFields.lat !== undefined) body.lat = updateFields.lat;
		if (updateFields.lng !== undefined) body.lng = updateFields.lng;
		if (updateFields.logfile !== undefined) body.logfile = updateFields.logfile;

		// customFields: JSON string to array of {id, value}
		if (updateFields.customFields !== undefined) {
			try {
				body.customFields = JSON.parse(updateFields.customFields as string);
			} catch {
				throw new NodeOperationError(this.getNode(), 'Custom Fields must be valid JSON', { itemIndex });
			}
		}

		// contactDetails object
		const contactDetails: IDataObject = {};
		if (updateFields.email !== undefined) contactDetails.email = updateFields.email;
		if (updateFields.phone !== undefined) contactDetails.phone = updateFields.phone;
		if (updateFields.fax !== undefined) contactDetails.fax = updateFields.fax;
		if (updateFields.mobile !== undefined) contactDetails.mobile = updateFields.mobile;
		if (updateFields.website !== undefined) contactDetails.website = updateFields.website;
		if (updateFields.additionalContactData !== undefined) {
			try {
				contactDetails.additionalData = JSON.parse(updateFields.additionalContactData as string);
			} catch {
				throw new NodeOperationError(this.getNode(), 'Additional Contact Data must be valid JSON', { itemIndex });
			}
		}
		if (Object.keys(contactDetails).length > 0) body.contactDetails = contactDetails;

		// documentDelivery object
		const documentDelivery: IDataObject = {};
		if (updateFields.amountInvoicePrints !== undefined) documentDelivery.amountInvoicePrints = updateFields.amountInvoicePrints;
		const autoCreate = autoCreateDocumentsValue(updateFields);
		if (autoCreate !== undefined) documentDelivery.autoCreateDocuments = autoCreate;
		if (updateFields.invoiceAlwaysPaper !== undefined) documentDelivery.invoiceAlwaysPaper = updateFields.invoiceAlwaysPaper;
		if (updateFields.preferFax !== undefined) documentDelivery.preferFax = updateFields.preferFax;
		if (Object.keys(documentDelivery).length > 0) body.documentDelivery = documentDelivery;

		// financials object
		const financials: IDataObject = {};
		if (updateFields.defaultCurrency !== undefined) financials.defaultCurrency = updateFields.defaultCurrency;
		if (updateFields.creditLimit !== undefined) financials.creditLimit = updateFields.creditLimit;
		if (updateFields.customsInformation !== undefined) financials.customsInformation = updateFields.customsInformation;
		if (updateFields.subscriptionPaymentMethod !== undefined) financials.subscriptionPaymentMethod = updateFields.subscriptionPaymentMethod;
		// financials.paymentMethod nested object
		if (updateFields.paymentMethodId !== undefined) financials.paymentMethod = { id: updateFields.paymentMethodId };
		// financials.paymentTerms nested object
		const paymentTerms: IDataObject = {};
		if (updateFields.fixedPaymentTerms !== undefined) paymentTerms.fixedPaymentTerms = toBoolean(updateFields.fixedPaymentTerms);
		if (updateFields.paymentTargetDays !== undefined) paymentTerms.paymentTargetDays = updateFields.paymentTargetDays;
		if (updateFields.paymentTargetDiscount !== undefined) paymentTerms.paymentTargetDiscount = updateFields.paymentTargetDiscount;
		if (updateFields.paymentTargetDiscountDays !== undefined) paymentTerms.paymentTargetDiscountDays = updateFields.paymentTargetDiscountDays;
		if (Object.keys(paymentTerms).length > 0) financials.paymentTerms = paymentTerms;
		// financials.tax nested object
		const tax: IDataObject = {};
		if (updateFields.taxNumber !== undefined) tax.taxNumber = updateFields.taxNumber;
		if (updateFields.vatId !== undefined) tax.vatId = updateFields.vatId;
		if (updateFields.taxDisplay !== undefined) tax.taxDisplay = updateFields.taxDisplay;
		if (updateFields.taxation !== undefined) tax.taxation = updateFields.taxation;
		if (updateFields.useDeliveryThreshold !== undefined) tax.useDeliveryThreshold = updateFields.useDeliveryThreshold;
		if (Object.keys(tax).length > 0) financials.tax = tax;
		if (Object.keys(financials).length > 0) body.financials = financials;

		// shipping object
		const shipping: IDataObject = {};
		if (updateFields.shippingMethodId !== undefined) shipping.shippingMethod = { id: updateFields.shippingMethodId };
		if (updateFields.freeShipping !== undefined) shipping.freeShipping = updateFields.freeShipping;
		if (updateFields.freeShippingFrom !== undefined) shipping.freeShippingFrom = updateFields.freeShippingFrom;
		if (updateFields.deliveryBan !== undefined) shipping.deliveryBan = updateFields.deliveryBan;
		if (updateFields.deliveryBanDate !== undefined) shipping.deliveryBanDate = updateFields.deliveryBanDate;
		if (updateFields.deliveryBanReason !== undefined) shipping.deliveryBanReason = updateFields.deliveryBanReason;
		if (updateFields.trackingMailBan !== undefined) shipping.trackingMailBan = updateFields.trackingMailBan;
		if (Object.keys(shipping).length > 0) body.shipping = shipping;

		// primaryBankAccount object
		const primaryBankAccount: IDataObject = {};
		if (updateFields.primaryBankAccountIban !== undefined) primaryBankAccount.iban = updateFields.primaryBankAccountIban;
		if (updateFields.primaryBankAccountBic !== undefined) primaryBankAccount.bic = updateFields.primaryBankAccountBic;
		if (updateFields.primaryBankAccountOwner !== undefined) primaryBankAccount.owner = updateFields.primaryBankAccountOwner;
		if (updateFields.bankName !== undefined) primaryBankAccount.bankName = updateFields.bankName;
		// primaryBankAccount.sepa nested object
		const sepa: IDataObject = {};
		if (updateFields.sepaCompanySepa !== undefined) sepa.companySepa = toBoolean(updateFields.sepaCompanySepa);
		if (updateFields.sepaInitial !== undefined) sepa.initial = toBoolean(updateFields.sepaInitial);
		if (updateFields.sepaMandateReference !== undefined) sepa.mandateReference = updateFields.sepaMandateReference;
		if (updateFields.sepaMandateReferenceChange !== undefined) sepa.mandateReferenceChange = toBoolean(updateFields.sepaMandateReferenceChange);
		if (updateFields.sepaMandateReferenceDate !== undefined) sepa.mandateReferenceDate = updateFields.sepaMandateReferenceDate;
		if (updateFields.sepaRemark !== undefined) sepa.remark = updateFields.sepaRemark;
		if (updateFields.sepaUsage !== undefined) sepa.usage = updateFields.sepaUsage;
		if (Object.keys(sepa).length > 0) primaryBankAccount.sepa = sepa;
		if (Object.keys(primaryBankAccount).length > 0) body.primaryBankAccount = primaryBankAccount;

		// marketing object (update only)
		const marketing: IDataObject = {};
		if (updateFields.ageApproval !== undefined) marketing.ageApproval = updateFields.ageApproval;
		if (updateFields.birthdayCard !== undefined) marketing.birthdayCard = updateFields.birthdayCard;
		if (updateFields.marketingBan !== undefined) marketing.marketingBan = updateFields.marketingBan;
		if (updateFields.showBirthdayInCalendar !== undefined) marketing.showBirthdayInCalendar = updateFields.showBirthdayInCalendar;
		if (Object.keys(marketing).length > 0) body.marketing = marketing;

		// Object refs
		if (updateFields.accountManagerId !== undefined) body.accountManager = { id: updateFields.accountManagerId };
		if (updateFields.salesManagerId !== undefined) body.salesManager = { id: updateFields.salesManagerId };
		if (updateFields.mainProjectId !== undefined) body.mainProject = { id: updateFields.mainProjectId };
		if (updateFields.fromShopId !== undefined) body.fromShop = { id: updateFields.fromShopId };

		// groups: comma-separated string to array of integers
		if (updateFields.groups !== undefined) {
			const groupStr = (updateFields.groups as string).trim();
			if (groupStr) {
				body.groups = groupStr.split(',').map((g: string) => parseInt(g.trim(), 10));
			}
		}

		assertNonEmptyBody(body, 'customer update');

		return xentralRequest.call(this, 'PATCH', `customers/${customerId}`, body as IDataObject, {}, 'v2');
	}

	if (operation === 'delete') {
		const customerId = this.getNodeParameter('customerId', itemIndex) as string;
		assertSafeId(customerId, 'customerId');
		return xentralRequest.call(this, 'DELETE', `customers/${customerId}`, {}, {}, 'v1');
	}

	if (operation === 'search') {
		const searchTerm = (this.getNodeParameter('searchTerm', itemIndex) as string).trim();
		if (!searchTerm) {
			return [];
		}
		const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex, 50) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return runCustomerSearch(
			(query, pageLimit) => xentralV1CursorGetAll.call(this, 'customers', query, pageLimit, maxPages, 'v2'),
			searchTerm,
			limit,
		);
	}

	throw new Error(`Unknown customer operation: ${operation}`);
}
