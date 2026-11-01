import type { INodeProperties } from 'n8n-workflow';

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
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 1,
				description: 'The quantity/amount for this price entry',
			},
			{
				displayName: 'Customer Group ID',
				name: 'customerGroupId',
				type: 'string',
				default: '',
				description: 'The ID of the customer group for this price (nullable)',
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				default: '',
				description: 'The ID of a specific customer for this price (nullable)',
			},
			{
				displayName: 'Customer Product Number',
				name: 'customerProductNumber',
				type: 'string',
				default: '',
				description: 'The customer-specific product number',
			},
			{
				displayName: 'Expires At',
				name: 'expiresAt',
				type: 'dateTime',
				default: '',
				description: 'Expiration date for this price',
			},
			{
				displayName: 'Hide In Bulk Price Listing',
				name: 'hideInBulkPriceListing',
				type: 'boolean',
				default: false,
				description: 'Whether to hide this price in bulk price listings',
			},
			{
				displayName: 'Is Not Calculated From Exchange Table',
				name: 'isNotCalculatedFromExchangeTable',
				type: 'boolean',
				default: false,
				description: 'Whether this price is exempt from exchange table calculations',
			},
			{
				displayName: 'Package Amount',
				name: 'packageAmount',
				type: 'number',
				default: 0,
				description: 'The package amount for this price',
			},
			{
				displayName: 'Price Amount',
				name: 'priceAmount',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'The net price amount',
			},
			{
				displayName: 'Price Currency',
				name: 'priceCurrency',
				type: 'string',
				default: 'EUR',
				description: 'ISO 4217 currency code (default: EUR)',
			},
			{
				displayName: 'Remark',
				name: 'remark',
				type: 'string',
				default: '',
				description: 'A remark or note for this price entry',
			},
			{
				displayName: 'Valid From',
				name: 'validFrom',
				type: 'dateTime',
				default: '',
				description: 'Start date for this price',
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
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 1,
				description: 'The quantity/amount for this price entry',
			},
			{
				displayName: 'Customer Group ID',
				name: 'customerGroupId',
				type: 'string',
				default: '',
				description: 'The ID of the customer group (set empty to clear)',
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				default: '',
				description: 'The ID of a specific customer (set empty to clear)',
			},
			{
				displayName: 'Customer Product Number',
				name: 'customerProductNumber',
				type: 'string',
				default: '',
				description: 'The customer-specific product number',
			},
			{
				displayName: 'Expires At',
				name: 'expiresAt',
				type: 'dateTime',
				default: '',
				description: 'Expiration date for this price',
			},
			{
				displayName: 'Hide In Bulk Price Listing',
				name: 'hideInBulkPriceListing',
				type: 'boolean',
				default: false,
				description: 'Whether to hide this price in bulk price listings',
			},
			{
				displayName: 'Is Not Calculated From Exchange Table',
				name: 'isNotCalculatedFromExchangeTable',
				type: 'boolean',
				default: false,
				description: 'Whether this price is exempt from exchange table calculations',
			},
			{
				displayName: 'Package Amount',
				name: 'packageAmount',
				type: 'number',
				default: 0,
				description: 'The package amount for this price',
			},
			{
				displayName: 'Price Amount',
				name: 'priceAmount',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'The net price amount',
			},
			{
				displayName: 'Price Currency',
				name: 'priceCurrency',
				type: 'string',
				default: 'EUR',
				description: 'ISO 4217 currency code',
			},
			{
				displayName: 'Remark',
				name: 'remark',
				type: 'string',
				default: '',
				description: 'A remark or note for this price entry',
			},
			{
				displayName: 'Valid From',
				name: 'validFrom',
				type: 'dateTime',
				default: '',
				description: 'Start date for this price',
			},
		],
	},
];
