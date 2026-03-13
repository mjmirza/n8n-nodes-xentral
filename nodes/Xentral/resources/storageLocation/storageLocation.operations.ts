import type { INodeProperties } from 'n8n-workflow';

export const storageLocationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['storageLocation'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many storage locations',
				action: 'Get many storage locations',
			},
		],
		default: 'getAll',
	},
];
