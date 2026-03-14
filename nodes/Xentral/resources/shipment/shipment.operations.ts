import type { INodeProperties } from 'n8n-workflow';

export const shipmentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['shipment'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new shipment (requires a valid shipment type configured in your Xentral instance)',
				action: 'Create a shipment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a shipment by ID',
				action: 'Get a shipment',
			},
		],
		default: 'get',
	},
];
