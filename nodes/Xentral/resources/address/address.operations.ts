import { INodeProperties } from 'n8n-workflow';

export const addressOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['address'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new address for a customer',
				action: 'Create an address',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an address by ID',
				action: 'Get an address',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many addresses for a customer',
				action: 'Get many addresses',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an address',
				action: 'Update an address',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an address',
				action: 'Delete an address',
			},
		],
		default: 'getAll',
	},
];
