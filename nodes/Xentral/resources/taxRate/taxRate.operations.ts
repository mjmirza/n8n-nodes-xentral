import { INodeProperties } from 'n8n-workflow';

export const taxRateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['taxRate'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many tax rates',
				action: 'Get many tax rates',
			},
		],
		default: 'getAll',
	},
];
