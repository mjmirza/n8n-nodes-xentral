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
				name: 'Create',
				value: 'create',
				description: 'Create a new storage location in a warehouse',
				action: 'Create a storage location',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many storage locations from a warehouse',
				action: 'Get many storage locations',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a storage location in a warehouse',
				action: 'Update a storage location',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a storage location from a warehouse',
				action: 'Delete a storage location',
			},
		],
		default: 'getAll',
	},
];
