import { INodeProperties } from 'n8n-workflow';

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
				operation: ['create', 'get', 'getAll', 'update', 'delete'],
			},
		},
		description: 'The ID of the parent customer',
	},

	// ----------------------------------
	//         address:create
	// ----------------------------------
	{
		displayName: 'Address Type',
		name: 'addressType',
		type: 'options',
		options: [
			{ name: 'Delivery', value: 'delivery' },
			{ name: 'Billing', value: 'billing' },
		],
		default: 'delivery',
		required: true,
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
		description: 'The type of address',
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
		description: 'The street address',
	},
	{
		displayName: 'ZIP Code',
		name: 'zipCode',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['address'],
				operation: ['create'],
			},
		},
		description: 'The postal/ZIP code',
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
		description: 'The city',
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
		description: 'ISO 3166-1 alpha-2 country code',
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
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State/province code',
			},
		],
	},

	// ----------------------------------
	//         address:get / update / delete
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
				operation: ['get', 'update', 'delete'],
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
				displayName: 'Address Type',
				name: 'addressType',
				type: 'options',
				options: [
					{ name: 'Delivery', value: 'delivery' },
					{ name: 'Billing', value: 'billing' },
				],
				default: 'delivery',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				default: '',
			},
			{
				displayName: 'ZIP Code',
				name: 'zipCode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
			},
		],
	},
];
