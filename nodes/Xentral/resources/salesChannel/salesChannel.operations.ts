import { INodeProperties } from 'n8n-workflow';

export const salesChannelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['salesChannel'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many sales channels',
				action: 'Get many sales channels',
			},
		],
		default: 'getAll',
	},
];
