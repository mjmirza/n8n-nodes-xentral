import { INodeProperties } from 'n8n-workflow';

export const salesOrderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['salesOrder'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new sales order (Auftrag)',
				action: 'Create a sales order',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a sales order by ID',
				action: 'Get a sales order',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many sales orders',
				action: 'Get many sales orders',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a sales order',
				action: 'Update a sales order',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a sales order',
				action: 'Delete a sales order',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search sales orders',
				action: 'Search sales orders',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a sales order',
				action: 'Cancel a sales order',
			},
			{
				name: 'Dispatch',
				value: 'dispatch',
				description: 'Dispatch a sales order',
				action: 'Dispatch a sales order',
			},
		],
		default: 'getAll',
	},
];
