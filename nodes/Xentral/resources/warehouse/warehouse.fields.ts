import { INodeProperties } from 'n8n-workflow';

export const warehouseFields: INodeProperties[] = [
	// ----------------------------------
	//         warehouse:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'warehouseName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['warehouse'],
				operation: ['create'],
			},
		},
		description: 'The name of the warehouse',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['warehouse'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
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
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: 'DE',
				description: 'ISO 3166-1 alpha-2 country code',
			},
			{
				displayName: 'Is Default',
				name: 'isDefault',
				type: 'boolean',
				default: false,
				description: 'Whether this is the default warehouse',
			},
		],
	},

	// ----------------------------------
	//         warehouse:get
	// ----------------------------------
	{
		displayName: 'Warehouse ID',
		name: 'warehouseId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['warehouse'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the warehouse',
	},

	// ----------------------------------
	//         warehouse:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['warehouse'],
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
				resource: ['warehouse'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         warehouse:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['warehouse'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'warehouseName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Description',
				name: 'description',
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
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Is Default',
				name: 'isDefault',
				type: 'boolean',
				default: false,
				description: 'Whether this is the default warehouse',
			},
		],
	},
];
