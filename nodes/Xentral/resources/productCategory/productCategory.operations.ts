import { INodeProperties } from 'n8n-workflow';

export const productCategoryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['productCategory'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new product category',
				action: 'Create a product category',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a product category by ID',
				action: 'Get a product category',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many product categories',
				action: 'Get many product categories',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product category',
				action: 'Update a product category',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a product category',
				action: 'Delete a product category',
			},
		],
		default: 'getAll',
	},
];
