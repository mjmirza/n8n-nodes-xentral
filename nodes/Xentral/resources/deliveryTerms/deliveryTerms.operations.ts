import { INodeProperties } from 'n8n-workflow';

export const deliveryTermsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deliveryTerms'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many delivery terms',
				action: 'Get many delivery terms',
			},
		],
		default: 'getAll',
	},
];
