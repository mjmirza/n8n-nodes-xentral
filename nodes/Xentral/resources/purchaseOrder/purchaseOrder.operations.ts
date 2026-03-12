import { INodeProperties } from 'n8n-workflow';

export const purchaseOrderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new purchase order (Bestellung)',
				action: 'Create a purchase order',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a purchase order by ID',
				action: 'Get a purchase order',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many purchase orders',
				action: 'Get many purchase orders',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search purchase orders',
				action: 'Search purchase orders',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a purchase order',
				action: 'Update a purchase order',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a purchase order',
				action: 'Delete a purchase order',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a purchase order',
				action: 'Cancel a purchase order',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release a purchase order',
				action: 'Release a purchase order',
			},
		],
		default: 'getAll',
	},
];
