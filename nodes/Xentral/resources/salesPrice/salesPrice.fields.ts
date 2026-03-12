import { INodeProperties } from 'n8n-workflow';

export const salesPriceFields: INodeProperties[] = [
	// ----------------------------------
	//         salesPrice:create
	// ----------------------------------
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['salesPrice'],
				operation: ['create'],
			},
		},
		description: 'The ID of the product',
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'number',
		default: 0,
		required: true,
		typeOptions: { numberPrecision: 2 },
		displayOptions: {
			show: {
				resource: ['salesPrice'],
				operation: ['create'],
			},
		},
		description: 'The sales price',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesPrice'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: 'EUR',
				description: 'ISO 4217 currency code',
			},
			{
				displayName: 'Customer Group ID',
				name: 'customerGroupId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Min Quantity',
				name: 'minQuantity',
				type: 'number',
				default: 1,
			},
			{
				displayName: 'Valid From',
				name: 'validFrom',
				type: 'string',
				default: '',
				description: 'Start date (YYYY-MM-DD)',
			},
			{
				displayName: 'Valid To',
				name: 'validTo',
				type: 'string',
				default: '',
				description: 'End date (YYYY-MM-DD)',
			},
		],
	},

	// ----------------------------------
	//         salesPrice:get / update / delete
	// ----------------------------------
	{
		displayName: 'Sales Price ID',
		name: 'salesPriceId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['salesPrice'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the sales price',
	},

	// ----------------------------------
	//         salesPrice:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['salesPrice'],
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
				resource: ['salesPrice'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         salesPrice:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesPrice'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Price',
				name: 'price',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: 'EUR',
			},
			{
				displayName: 'Customer Group ID',
				name: 'customerGroupId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Min Quantity',
				name: 'minQuantity',
				type: 'number',
				default: 1,
			},
			{
				displayName: 'Valid From',
				name: 'validFrom',
				type: 'string',
				default: '',
				description: 'Start date (YYYY-MM-DD)',
			},
			{
				displayName: 'Valid To',
				name: 'validTo',
				type: 'string',
				default: '',
				description: 'End date (YYYY-MM-DD)',
			},
		],
	},
];
