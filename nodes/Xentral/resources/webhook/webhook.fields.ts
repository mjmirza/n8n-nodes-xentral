import type { INodeProperties } from 'n8n-workflow';

export const webhookFields: INodeProperties[] = [
	// ----------------------------------
	//         webhook:create
	// ----------------------------------
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'The URL the webhook will send events to',
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		options: [
			{ name: 'Customer Created', value: 'customer.created' },
			{ name: 'Customer Updated', value: 'customer.updated' },
			{ name: 'Customer Deleted', value: 'customer.deleted' },
			{ name: 'Product Created', value: 'product.created' },
			{ name: 'Product Updated', value: 'product.updated' },
			{ name: 'Product Deleted', value: 'product.deleted' },
			{ name: 'Sales Order Created', value: 'salesOrder.created' },
			{ name: 'Sales Order Updated', value: 'salesOrder.updated' },
			{ name: 'Sales Order Deleted', value: 'salesOrder.deleted' },
			{ name: 'Purchase Order Created', value: 'purchaseOrder.created' },
			{ name: 'Purchase Order Updated', value: 'purchaseOrder.updated' },
			{ name: 'Shipment Created', value: 'shipment.created' },
			{ name: 'Shipment Updated', value: 'shipment.updated' },
		],
		default: [],
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'The events to listen for',
	},
	{
		displayName: 'Signature Key',
		name: 'signatureKey',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'Secret key used for HMAC signature verification of webhook payloads',
	},

	// ----------------------------------
	//         webhook:get / update / delete
	// ----------------------------------
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The ID of the webhook',
	},

	// ----------------------------------
	//         webhook:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['webhook'],
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
				resource: ['webhook'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         webhook:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The URL the webhook will send events to',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{ name: 'Customer Created', value: 'customer.created' },
					{ name: 'Customer Updated', value: 'customer.updated' },
					{ name: 'Customer Deleted', value: 'customer.deleted' },
					{ name: 'Product Created', value: 'product.created' },
					{ name: 'Product Updated', value: 'product.updated' },
					{ name: 'Product Deleted', value: 'product.deleted' },
					{ name: 'Sales Order Created', value: 'salesOrder.created' },
					{ name: 'Sales Order Updated', value: 'salesOrder.updated' },
					{ name: 'Sales Order Deleted', value: 'salesOrder.deleted' },
				],
				default: [],
				description: 'The events to listen for',
			},
			{
				displayName: 'Signature Key',
				name: 'signatureKey',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Secret key used for HMAC signature verification',
			},
		],
	},
];
