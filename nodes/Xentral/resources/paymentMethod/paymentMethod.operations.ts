import type { INodeProperties } from 'n8n-workflow';

export const paymentMethodOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['paymentMethod'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many payment methods',
				action: 'Get many payment methods',
			},
		],
		default: 'getAll',
	},
];
