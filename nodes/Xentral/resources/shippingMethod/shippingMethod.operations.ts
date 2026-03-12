import { INodeProperties } from 'n8n-workflow';

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
		],
		default: 'getAll',
	},
];
