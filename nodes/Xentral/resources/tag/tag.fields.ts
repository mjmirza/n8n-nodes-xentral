import type { INodeProperties } from 'n8n-workflow';

export const tagFields: INodeProperties[] = [
	// ----------------------------------
	//         tag:create
	// ----------------------------------
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['create'],
			},
		},
		description: 'The display title of the tag',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['create'],
			},
		},
		description: 'The unique type identifier of the tag (lowercase, no spaces)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'Hex color code without the # prefix (e.g. "ff0000" for red)',
			},
			{
				displayName: 'Group',
				name: 'group',
				type: 'options',
				options: [
					{ name: 'Addresses', value: 'addresses' },
					{ name: 'Credit Notes', value: 'creditNotes' },
					{ name: 'Delivery Notes', value: 'deliveryNotes' },
					{ name: 'Invoices', value: 'invoices' },
					{ name: 'Offers', value: 'offers' },
					{ name: 'Price Inquiries', value: 'priceInquiries' },
					{ name: 'Productions', value: 'productions' },
					{ name: 'Products', value: 'products' },
					{ name: 'Projects', value: 'projects' },
					{ name: 'Purchase Orders', value: 'purchaseOrders' },
					{ name: 'Returns', value: 'returns' },
					{ name: 'Sales Orders', value: 'salesOrders' },
				],
				default: 'products',
				description: 'The group this tag belongs to',
			},
		],
	},

	// ----------------------------------
	//         tag:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['tag'],
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
				resource: ['tag'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
];
