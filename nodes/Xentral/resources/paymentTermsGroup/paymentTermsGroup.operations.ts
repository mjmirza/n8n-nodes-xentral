import type { INodeProperties } from 'n8n-workflow';

export const paymentTermsGroupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['paymentTermsGroup'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new payment terms group',
				action: 'Create a payment terms group',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a payment terms group by ID',
				action: 'Get a payment terms group',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many payment terms groups',
				action: 'Get many payment terms groups',
			},
		],
		default: 'getAll',
	},
];
