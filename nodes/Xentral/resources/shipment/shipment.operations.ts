import { INodeProperties } from 'n8n-workflow';

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
				description: 'Create a new shipment',
				action: 'Create a shipment',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a shipment by ID',
				action: 'Get a shipment',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many deliveries',
				action: 'Get many deliveries',
			},
		],
		default: 'getAll',
	},
];
