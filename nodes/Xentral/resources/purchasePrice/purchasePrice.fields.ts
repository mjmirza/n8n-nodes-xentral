import type { INodeProperties } from 'n8n-workflow';

export const purchasePriceFields: INodeProperties[] = [
	// ----------------------------------
	//         purchasePrice:create
	// ----------------------------------
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
				operation: ['create'],
			},
		},
		description: 'The ID of the product',
	},
	{
		displayName: 'Supplier ID',
		name: 'supplierId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
				operation: ['create'],
			},
		},
		description: 'The ID of the supplier',
	},
	{
		displayName: 'From Quantity',
		name: 'fromQuantity',
		type: 'number',
		default: 1,
		required: true,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
				operation: ['create'],
			},
		},
		description: 'Minimum quantity for this price tier',
	},
	{
		displayName: 'Package Amount',
		name: 'packageAmount',
		type: 'number',
		default: 1,
		required: true,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
				operation: ['create'],
			},
		},
		description: 'The package amount for this price',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Price',
				name: 'price',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'The purchase price',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: 'EUR',
				description: 'ISO 4217 currency code',
			},
			{
				displayName: 'Delivery Time',
				name: 'deliveryTime',
				type: 'string',
				default: '',
				description: 'Expected delivery time',
			},
		],
	},

	// ----------------------------------
	//         purchasePrice:get / update / delete
	// ----------------------------------
	{
		displayName: 'Purchase Price ID',
		name: 'purchasePriceId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the purchase price',
	},

	// ----------------------------------
	//         purchasePrice:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
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
				resource: ['purchasePrice'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         purchasePrice:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
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
				displayName: 'Supplier ID',
				name: 'supplierId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'From Quantity',
				name: 'fromQuantity',
				type: 'number',
				default: 1,
			},
			{
				displayName: 'Package Amount',
				name: 'packageAmount',
				type: 'number',
				default: 1,
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
				displayName: 'Delivery Time',
				name: 'deliveryTime',
				type: 'string',
				default: '',
			},
		],
	},
];
