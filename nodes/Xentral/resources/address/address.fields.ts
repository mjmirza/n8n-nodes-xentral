import type { INodeProperties } from 'n8n-workflow';

export const addressFields: INodeProperties[] = [
	// ----------------------------------
	//         address: customerId (all operations)
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create', 'getAll', 'update', 'delete'],
			},
		},
		description: 'The ID of the customer whose addresses to manage',
	},

	// ----------------------------------
	//         address:create (required fields)
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
		description: 'The name for this address. Required for billing and delivery addresses, not sent for a master data address, whose schema has no name.',
	},
	{
		displayName: 'Street',
		name: 'street',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
		description: 'The street address (required)',
	},
	{
		displayName: 'City',
		name: 'city',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
		description: 'The city (required)',
	},
	{
		displayName: 'ZIP Code',
		name: 'zip',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
		description: 'The postal/ZIP code (required)',
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		default: 'DE',
		required: true,
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
		description: 'ISO 3166-1 alpha-2 country code (required)',
	},
	{
		displayName: 'Address Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Master Data', value: 'masterdata' },
			{ name: 'Billing Address', value: 'billingaddress' },
			{ name: 'Delivery Address', value: 'deliveryaddress' },
		],
		default: 'deliveryaddress',
		required: true,
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
		description: 'The type of address to create',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Address Supplement',
				name: 'addressSupplement',
				type: 'string',
				default: '',
				description: 'Additional address line (e.g. c/o, floor)',
			},
			{
				displayName: 'Delivery Details',
				name: 'deliveryDetails',
				type: 'fixedCollection',
				placeholder: 'Add Delivery Detail',
				default: {},
				options: [
					{
						displayName: 'Delivery Details',
						name: 'deliveryDetailsValues',
						values: [
							{
						displayName: 'Default Delivery Address',
						name: 'defaultDeliveryAddress',
						type: 'boolean',
						default: false,
						description: 'Whether this is the default delivery address',
							},
							{
						displayName: 'Internal Comment',
						name: 'internalComment',
						type: 'string',
						default: '',
							},
							{
						displayName: 'Note',
						name: 'note',
						type: 'string',
						default: '',
							},
							{
						displayName: 'Tax Type',
						name: 'taxType',
						type: 'string',
						default: '',
							},
							{
						displayName: 'Terms Of Delivery',
						name: 'termsOfDelivery',
						type: 'string',
						default: '',
						description: 'Delivery terms',
							},
							{
						displayName: 'VAT ID',
						name: 'vatId',
						type: 'string',
						default: '',
						description: 'VAT identification number',
							},
						],
					},
				],
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
				description: 'Contact email (nested under contactDetails)',
			},
			{
				displayName: 'GLN',
				name: 'gln',
				type: 'string',
				default: '',
				description: 'Global Location Number (nested under contactDetails)',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Contact phone number (nested under contactDetails)',
			},
			{
				displayName: 'Salutation',
				name: 'salutation',
				type: 'string',
				default: '',
				description: 'Salutation (e.g. Herr, Frau)',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State/province code',
			},
			{
				displayName: 'Sub-Department',
				name: 'subDepartment',
				type: 'string',
				default: '',
				description: 'Sub-department name',
			},
			],
	},

	// ----------------------------------
	//         address:update / delete
	// ----------------------------------
	{
		displayName: 'Address ID',
		name: 'addressId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update', 'delete'],
			},
		},
		description: 'The ID of the address',
	},

	// ----------------------------------
	//         address:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['address'],
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
				resource: ['address'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         address:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Address Supplement',
				name: 'addressSupplement',
				type: 'string',
				default: '',
				description: 'Additional address line (e.g. c/o, floor)',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City name',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'ISO 3166-1 alpha-2 country code',
			},
			{
				displayName: 'Delivery Details',
				name: 'deliveryDetails',
				type: 'fixedCollection',
				placeholder: 'Add Delivery Detail',
				default: {},
				options: [
					{
						displayName: 'Delivery Details',
						name: 'deliveryDetailsValues',
						values: [
							{
						displayName: 'Default Delivery Address',
						name: 'defaultDeliveryAddress',
						type: 'boolean',
						default: false,
						description: 'Whether this is the default delivery address',
							},
							{
						displayName: 'Internal Comment',
						name: 'internalComment',
						type: 'string',
						default: '',
							},
							{
						displayName: 'Note',
						name: 'note',
						type: 'string',
						default: '',
							},
							{
						displayName: 'Tax Type',
						name: 'taxType',
						type: 'string',
						default: '',
							},
							{
						displayName: 'Terms Of Delivery',
						name: 'termsOfDelivery',
						type: 'string',
						default: '',
						description: 'Delivery terms',
							},
							{
						displayName: 'VAT ID',
						name: 'vatId',
						type: 'string',
						default: '',
						description: 'VAT identification number',
							},
						],
					},
				],
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
				description: 'Contact email (nested under contactDetails)',
			},
			{
				displayName: 'GLN',
				name: 'gln',
				type: 'string',
				default: '',
				description: 'Global Location Number (nested under contactDetails)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name or company name',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Contact phone number (nested under contactDetails)',
			},
			{
				displayName: 'Salutation',
				name: 'salutation',
				type: 'string',
				default: '',
				description: 'Salutation (e.g. Herr, Frau)',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State/province code',
			},
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				default: '',
				description: 'Street address',
			},
			{
				displayName: 'Sub-Department',
				name: 'subDepartment',
				type: 'string',
				default: '',
				description: 'Sub-department name',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				description: 'Ignored on update. The Xentral address update has no type field.',
			},
			{
				displayName: 'ZIP Code',
				name: 'zip',
				type: 'string',
				default: '',
				description: 'ZIP/postal code',
			},
		],
	},
];
