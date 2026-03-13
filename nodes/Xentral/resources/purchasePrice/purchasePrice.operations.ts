import type { INodeProperties } from 'n8n-workflow';

export const purchasePriceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['purchasePrice'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new purchase price',
				action: 'Create a purchase price',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a purchase price by ID',
				action: 'Get a purchase price',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many purchase prices',
				action: 'Get many purchase prices',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a purchase price',
				action: 'Update a purchase price',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a purchase price',
				action: 'Delete a purchase price',
			},
		],
		default: 'getAll',
	},
];
