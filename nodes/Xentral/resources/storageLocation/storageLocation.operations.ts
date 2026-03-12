import { INodeProperties } from 'n8n-workflow';

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
				description: 'Create a new storage location',
				action: 'Create a storage location',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many storage locations',
				action: 'Get many storage locations',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a storage location',
				action: 'Update a storage location',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a storage location',
				action: 'Delete a storage location',
			},
		],
		default: 'getAll',
	},
];
