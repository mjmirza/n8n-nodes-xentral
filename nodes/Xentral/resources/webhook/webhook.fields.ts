import type { INodeProperties } from 'n8n-workflow';

export const webhookFields: INodeProperties[] = [
	// ----------------------------------
	//         webhook:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'The name of the webhook',
	},
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
		displayName: 'Signature Key',
		name: 'signatureKey',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'Secret key used for HMAC signature verification of webhook payloads',
	},
	{
		displayName: 'Event IDs',
		name: 'events',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'Comma-separated list of event IDs using the full qualified format, e.g. "com.xentral.salesOrder.created.v1, com.xentral.customer.updated.v1"',
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
				displayName: 'Event IDs',
				name: 'events',
				type: 'string',
				default: '',
				description: 'Comma-separated list of event IDs using the full qualified format, e.g. "com.xentral.salesOrder.created.v1, com.xentral.customer.updated.v1"',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the webhook',
			},
			{
				displayName: 'Signature Key',
				name: 'signatureKey',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Secret key used for HMAC signature verification',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The URL the webhook will send events to',
			},
		],
	},
];
