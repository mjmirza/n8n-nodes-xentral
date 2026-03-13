import type { INodeProperties } from 'n8n-workflow';

export const warehouseOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['warehouse'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new warehouse',
				action: 'Create a warehouse',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many warehouses',
				action: 'Get many warehouses',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a warehouse',
				action: 'Update a warehouse',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a warehouse',
				action: 'Delete a warehouse',
			},
		],
		default: 'getAll',
	},
];
