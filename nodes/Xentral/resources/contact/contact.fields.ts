import type { INodeProperties } from 'n8n-workflow';

export const contactFields: INodeProperties[] = [
	// ----------------------------------
	//         contact: customerId (all operations)
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create', 'get', 'getAll', 'update', 'delete'],
			},
		},
		description: 'The ID of the parent customer',
	},

	// ----------------------------------
	//         contact:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'contactName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		description: 'The name of the contact person (required)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Additional Street',
				name: 'additionalStreet',
				type: 'string',
				default: '',
				description: 'Additional street line (address.additionalStreet)',
			},
			{
				displayName: 'Address State',
				name: 'addressState',
				type: 'string',
				default: '',
				description: 'State/province (address.state)',
			},
			{
				displayName: 'Birthday',
				name: 'birthday',
				type: 'string',
				default: '',
				description: 'Birthday in ISO format (YYYY-MM-DD)',
			},
			{
				displayName: 'Birthday Show in Calendar',
				name: 'birthdayShowInCalendar',
				type: 'boolean',
				default: false,
				description: 'Whether to show the birthday in the calendar',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City (address.city)',
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				description: 'Free-text comment about the contact',
			},
			{
				displayName: 'Contact Salutation',
				name: 'contactSalutation',
				type: 'string',
				default: '',
				description: 'Contact-level salutation (contact.salutation)',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country code (address.country)',
			},
			{
				displayName: 'Department',
				name: 'department',
				type: 'string',
				default: '',
				description: 'Department name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Contact email (contact.email)',
			},
			{
				displayName: 'Fax',
				name: 'fax',
				type: 'string',
				default: '',
				description: 'Contact fax number (contact.fax)',
			},
			{
				displayName: 'Groups',
				name: 'groups',
				type: 'string',
				default: '',
				description: 'Comma-separated list of group IDs',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'ISO 639-1 language code (e.g. de, en)',
			},
			{
				displayName: 'Marketing Ban',
				name: 'marketingBan',
				type: 'boolean',
				default: false,
				description: 'Whether the contact has opted out of marketing',
			},
			{
				displayName: 'Mobile',
				name: 'mobile',
				type: 'string',
				default: '',
				description: 'Contact mobile number (contact.mobile)',
			},
			{
				displayName: 'Others',
				name: 'others',
				type: 'string',
				default: '',
				description: 'Additional notes or other info',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Contact phone number (contact.phone)',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'string',
				default: '',
				description: 'Job title or position',
			},
			{
				displayName: 'Send Birthday Card',
				name: 'sendBirthdayCard',
				type: 'boolean',
				default: false,
				description: 'Whether to send a birthday card',
			},
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				default: '',
				description: 'Street address (address.street)',
			},
			{
				displayName: 'Sub-Department',
				name: 'subDepartment',
				type: 'string',
				default: '',
				description: 'Sub-department name',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Academic or professional title',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Company', value: 'company' },
					{ name: 'Mr', value: 'mr' },
					{ name: 'Mrs', value: 'mrs' },
					{ name: 'Other', value: 'other' },
				],
				default: 'mr',
				description: 'Salutation type for the contact',
			},
			{
				displayName: 'ZIP Code',
				name: 'zipCode',
				type: 'string',
				default: '',
				description: 'Postal code (address.zip)',
			},
		],
	},

	// ----------------------------------
	//         contact:get / update / delete
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the contact',
	},

	// ----------------------------------
	//         contact:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         contact:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Additional Street',
				name: 'additionalStreet',
				type: 'string',
				default: '',
				description: 'Additional street line (address.additionalStreet)',
			},
			{
				displayName: 'Address State',
				name: 'addressState',
				type: 'string',
				default: '',
				description: 'State/province (address.state)',
			},
			{
				displayName: 'Birthday',
				name: 'birthday',
				type: 'string',
				default: '',
				description: 'Birthday in ISO format (YYYY-MM-DD)',
			},
			{
				displayName: 'Birthday Show in Calendar',
				name: 'birthdayShowInCalendar',
				type: 'boolean',
				default: false,
				description: 'Whether to show the birthday in the calendar',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City (address.city)',
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				description: 'Free-text comment about the contact',
			},
			{
				displayName: 'Contact Salutation',
				name: 'contactSalutation',
				type: 'string',
				default: '',
				description: 'Contact-level salutation (contact.salutation)',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country code (address.country)',
			},
			{
				displayName: 'Department',
				name: 'department',
				type: 'string',
				default: '',
				description: 'Department name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Contact email (contact.email)',
			},
			{
				displayName: 'Fax',
				name: 'fax',
				type: 'string',
				default: '',
				description: 'Contact fax number (contact.fax)',
			},
			{
				displayName: 'Groups',
				name: 'groups',
				type: 'string',
				default: '',
				description: 'Comma-separated list of group IDs',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'ISO 639-1 language code (e.g. de, en)',
			},
			{
				displayName: 'Marketing Ban',
				name: 'marketingBan',
				type: 'boolean',
				default: false,
				description: 'Whether the contact has opted out of marketing',
			},
			{
				displayName: 'Mobile',
				name: 'mobile',
				type: 'string',
				default: '',
				description: 'Contact mobile number (contact.mobile)',
			},
			{
				displayName: 'Name',
				name: 'contactName',
				type: 'string',
				default: '',
				description: 'The name of the contact person',
			},
			{
				displayName: 'Others',
				name: 'others',
				type: 'string',
				default: '',
				description: 'Additional notes or other info',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Contact phone number (contact.phone)',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'string',
				default: '',
				description: 'Job title or position',
			},
			{
				displayName: 'Send Birthday Card',
				name: 'sendBirthdayCard',
				type: 'boolean',
				default: false,
				description: 'Whether to send a birthday card',
			},
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				default: '',
				description: 'Street address (address.street)',
			},
			{
				displayName: 'Sub-Department',
				name: 'subDepartment',
				type: 'string',
				default: '',
				description: 'Sub-department name',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Academic or professional title',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Company', value: 'company' },
					{ name: 'Mr', value: 'mr' },
					{ name: 'Mrs', value: 'mrs' },
					{ name: 'Other', value: 'other' },
				],
				default: 'mr',
				description: 'Salutation type for the contact',
			},
			{
				displayName: 'ZIP Code',
				name: 'zipCode',
				type: 'string',
				default: '',
				description: 'Postal code (address.zip)',
			},
		],
	},
];
