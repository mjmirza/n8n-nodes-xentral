import type { INodeProperties } from 'n8n-workflow';

export const supplierFields: INodeProperties[] = [
	// ----------------------------------
	//         supplier:get / update
	// ----------------------------------
	{
		displayName: 'Supplier ID',
		name: 'supplierId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['supplier'],
				operation: ['get', 'update'],
			},
		},
		description: 'The ID of the supplier',
	},

	// ----------------------------------
	//         supplier:getAll / search
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['supplier'],
				operation: ['getAll', 'search'],
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
				resource: ['supplier'],
				operation: ['getAll', 'search'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         supplier:search
	// ----------------------------------
	{
		displayName: 'Search Term',
		name: 'searchTerm',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['supplier'],
				operation: ['search'],
			},
		},
		description: 'Search by supplier name or company',
	},

	// ----------------------------------
	//         supplier:update (V1 API - tags only)
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['supplier'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags to set on the supplier',
			},
		],
	},
];
