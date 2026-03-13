import type { INodeProperties } from 'n8n-workflow';

export const tagFields: INodeProperties[] = [
	// ----------------------------------
	//         tag:create
	// ----------------------------------
	{
		displayName: 'Tag Name',
		name: 'tagName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['create'],
			},
		},
		description: 'The title of the tag (required by Xentral API)',
	},
	{
		displayName: 'Tag Type',
		name: 'tagType',
		type: 'options',
		default: 'article',
		required: true,
		options: [
			{ name: 'Article', value: 'article' },
			{ name: 'Customer', value: 'customer' },
			{ name: 'Supplier', value: 'supplier' },
			{ name: 'Project', value: 'project' },
		],
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['create'],
			},
		},
		description: 'The type/category of the tag (required by Xentral API)',
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
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description for the tag',
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
