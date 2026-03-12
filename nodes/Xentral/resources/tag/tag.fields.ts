import { INodeProperties } from 'n8n-workflow';

export const tagFields: INodeProperties[] = [
	// ----------------------------------
	//         tag:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['create'],
			},
		},
		description: 'The name of the tag',
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
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				description: 'The type of the tag',
			},
		],
	},

	// ----------------------------------
	//         tag:delete
	// ----------------------------------
	{
		displayName: 'Tag ID',
		name: 'tagId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['tag'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the tag to delete',
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
