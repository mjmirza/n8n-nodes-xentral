import { INodeProperties } from 'n8n-workflow';

export const returnOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['return'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new return (Retoure)',
				action: 'Create a return',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a return by ID',
				action: 'Get a return',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many returns',
				action: 'Get many returns',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a return',
				action: 'Update a return',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a return',
				action: 'Delete a return',
			},
		],
		default: 'getAll',
	},
];
