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
		displayName: 'Price Amount',
		name: 'priceAmount',
		type: 'number',
		default: 0,
		required: true,
		typeOptions: { numberPrecision: 2 },
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
				operation: ['create'],
			},
		},
		description: 'The purchase price amount',
	},
	{
		displayName: 'Price Currency',
		name: 'priceCurrency',
		type: 'string',
		default: 'EUR',
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
				operation: ['create'],
			},
		},
		description: 'ISO 4217 currency code (default: EUR)',
	},
	{
		displayName: 'Valid From',
		name: 'validFrom',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
				operation: ['create'],
			},
		},
		description: 'Optional. Leave empty for a price that is valid from now on.',
	},
	{
		displayName: 'Expires At',
		name: 'expiresAt',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
				operation: ['create'],
			},
		},
		description: 'Optional. Leave empty for a price without an end date.',
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
				displayName: 'Is Standard Supplier',
				name: 'isStandardSupplier',
				type: 'boolean',
				default: false,
				description: 'Whether this supplier is the standard supplier for this product',
			},
			{
				displayName: 'Package Amount',
				name: 'packageAmount',
				type: 'number',
				default: 0,
				description: 'The package amount for this price',
			},
			{
				displayName: 'Supplier Designation',
				name: 'supplierDesignation',
				type: 'string',
				default: '',
				description: 'The supplier designation for this product',
			},
			{
				displayName: 'Supplier ID',
				name: 'supplierId',
				type: 'string',
				default: '',
				description: 'The ID of the supplier',
			},
			{
				displayName: 'Supplier Item Number',
				name: 'supplierItemNumber',
				type: 'string',
				default: '',
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
				displayName: 'Expires At',
				name: 'expiresAt',
				type: 'dateTime',
				default: '',
				description: 'Expiration date for this price. An expression that returns null removes it.',
			},
			{
				displayName: 'From Quantity',
				name: 'fromQuantity',
				type: 'number',
				default: 1,
			},
			{
				displayName: 'Is Standard Supplier',
				name: 'isStandardSupplier',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Package Amount',
				name: 'packageAmount',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Price Amount',
				name: 'priceAmount',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'The purchase price amount',
			},
			{
				displayName: 'Price Currency',
				name: 'priceCurrency',
				type: 'string',
				default: 'EUR',
				description: 'ISO 4217 currency code',
			},
			{
				displayName: 'Supplier Designation',
				name: 'supplierDesignation',
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
				displayName: 'Supplier Item Number',
				name: 'supplierItemNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Valid From',
				name: 'validFrom',
				type: 'dateTime',
				default: '',
				description: 'Start date for this price. An expression that returns null removes it.',
			},
		],
	},
];
