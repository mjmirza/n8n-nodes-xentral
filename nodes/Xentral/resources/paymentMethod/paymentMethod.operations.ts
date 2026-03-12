import { INodeProperties } from 'n8n-workflow';

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
				name: 'Get',
				value: 'get',
				description: 'Get a payment method by ID',
				action: 'Get a payment method',
			},
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
