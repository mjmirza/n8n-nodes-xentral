import type { INodeProperties } from 'n8n-workflow';

export const supplierOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['supplier'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a supplier by ID',
				action: 'Get a supplier',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many suppliers',
				action: 'Get many suppliers',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search suppliers by name',
				action: 'Search suppliers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a supplier (tags only via V1 API)',
				action: 'Update a supplier',
			},
		],
		default: 'getAll',
	},
];
