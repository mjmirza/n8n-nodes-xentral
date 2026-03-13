import type { INodeProperties } from 'n8n-workflow';

export const salesPriceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['salesPrice'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new sales price',
				action: 'Create a sales price',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a sales price by ID',
				action: 'Get a sales price',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many sales prices',
				action: 'Get many sales prices',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a sales price',
				action: 'Update a sales price',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a sales price',
				action: 'Delete a sales price',
			},
		],
		default: 'getAll',
	},
];
