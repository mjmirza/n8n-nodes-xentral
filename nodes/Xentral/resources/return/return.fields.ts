import type { INodeProperties } from 'n8n-workflow';

export const returnFields: INodeProperties[] = [
	// ----------------------------------
	//         return:create
	// ----------------------------------
	{
		displayName: 'Sales Order ID',
		name: 'salesOrderId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		description: 'The ID of the related sales order (provide this or Customer ID)',
	},
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		description: 'The ID of the customer (provide this or Sales Order ID)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				description: 'The reason for the return',
			},
			{
				displayName: 'Internal Note',
				name: 'internalNote',
				type: 'string',
				default: '',
				description: 'Internal note (not visible to customer)',
			},
		],
	},

	// ----------------------------------
	//         return:get / update / delete
	// ----------------------------------
	{
		displayName: 'Return ID',
		name: 'returnId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['get', 'delete', 'release'],
			},
		},
		description: 'The ID of the return',
	},

	// ----------------------------------
	//         return:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue: 100 },
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
];
