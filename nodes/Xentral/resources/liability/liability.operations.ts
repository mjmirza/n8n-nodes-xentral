import type { INodeProperties } from 'n8n-workflow';

export const liabilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['liability'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new liability',
				action: 'Create a liability',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a liability by ID',
				action: 'Get a liability',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many liabilities',
				action: 'Get many liabilities',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release a liability',
				action: 'Release a liability',
			},
			{
				name: 'Upload Document',
				value: 'uploadDocument',
				description: 'Upload a document to a liability',
				action: 'Upload document to liability',
			},
		],
		default: 'getAll',
	},
];
