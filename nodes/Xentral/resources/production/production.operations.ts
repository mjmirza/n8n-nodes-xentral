import type { INodeProperties } from 'n8n-workflow';

export const productionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['production'],
			},
		},
		options: [
			{
				name: 'Attach File',
				value: 'attachFile',
				description: 'Attach a file to a production order',
				action: 'Attach file to production order',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new production order (Produktionsauftrag)',
				action: 'Create a production order',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a production order',
				action: 'Delete a production order',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a production order by ID',
				action: 'Get a production order',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many production orders',
				action: 'Get many production orders',
			},
			{
				name: 'Log Activity',
				value: 'logActivity',
				description: 'Log an activity on a production order',
				action: 'Log activity on production order',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release a production order',
				action: 'Release a production order',
			},
			{
				name: 'Start',
				value: 'start',
				description: 'Start a production order',
				action: 'Start a production order',
			},
		],
		default: 'getAll',
	},
];
