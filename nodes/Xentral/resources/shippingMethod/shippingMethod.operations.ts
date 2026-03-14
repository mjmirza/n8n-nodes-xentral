import type { INodeProperties } from 'n8n-workflow';

export const shippingMethodOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new shipping method',
				action: 'Create a shipping method',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a shipping method by ID',
				action: 'Get a shipping method',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many shipping methods',
				action: 'Get many shipping methods',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a shipping method',
				action: 'Update a shipping method',
			},
		],
		default: 'getAll',
	},
];
