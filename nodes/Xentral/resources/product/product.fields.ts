import type { INodeProperties } from 'n8n-workflow';

export const productFields: INodeProperties[] = [
	// ----------------------------------
	//         product:get / update / delete / getStock
	// ----------------------------------
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the product',
	},

	// ----------------------------------
	//         product:create
	// ----------------------------------
	{
		displayName: 'Product Name',
		name: 'productName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create'],
			},
		},
		description: 'The name of the product',
	},
	{
		displayName: 'Project',
		name: 'project',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create'],
			},
		},
		description: 'The project this product belongs to',
	},
	{
		displayName: 'Article Number',
		name: 'articleNumber',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['create'],
			},
		},
		description: 'The article/SKU number of the product',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
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
				displayName: 'Category ID',
				name: 'categoryId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Price (Net)',
				name: 'priceNet',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
			},
			{
				displayName: 'Tax Rate (%)',
				name: 'taxRate',
				type: 'number',
				default: 19,
			},
			{
				displayName: 'Weight (kg)',
				name: 'weight',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 3 },
			},
			{
				displayName: 'EAN',
				name: 'ean',
				type: 'string',
				default: '',
				description: 'European Article Number / barcode',
			},
			{
				displayName: 'Unit',
				name: 'unit',
				type: 'string',
				default: 'Stück',
				description: 'Unit of measure (e.g. Stück, kg, m)',
			},
		],
	},

	// ----------------------------------
	//         product:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['product'],
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
				resource: ['product'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         product:search
	// ----------------------------------
	{
		displayName: 'Search Term',
		name: 'searchTerm',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['search'],
			},
		},
		description: 'Search by product name, article number, or EAN',
	},

	// ----------------------------------
	//         product:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Product Name',
				name: 'productName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Article Number',
				name: 'articleNumber',
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
				displayName: 'Price (Net)',
				name: 'priceNet',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
			},
		],
	},
];
