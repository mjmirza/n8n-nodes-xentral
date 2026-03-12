import { INodeProperties } from 'n8n-workflow';

export const purchaseOrderFields: INodeProperties[] = [
	// ----------------------------------
	//         purchaseOrder:create
	// ----------------------------------
	{
		displayName: 'Supplier ID',
		name: 'supplierId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['create'],
			},
		},
		description: 'The ID of the supplier for this purchase order',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'dateTime',
				default: '',
				description: 'The date of the purchase order document (defaults to today)',
			},
			{
				displayName: 'Delivery Date',
				name: 'deliveryDate',
				type: 'dateTime',
				default: '',
				description: 'Expected delivery date',
			},
			{
				displayName: 'Internal Note',
				name: 'internalNote',
				type: 'string',
				default: '',
				description: 'Internal note (not visible to supplier)',
			},
			{
				displayName: 'Project',
				name: 'project',
				type: 'string',
				default: '',
				description: 'The project this purchase order belongs to',
			},
		],
	},

	// ----------------------------------
	//         purchaseOrder:get / update / delete
	// ----------------------------------
	{
		displayName: 'Purchase Order ID',
		name: 'purchaseOrderId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['get', 'update', 'delete', 'cancel', 'release'],
			},
		},
		description: 'The ID of the purchase order',
	},

	// ----------------------------------
	//         purchaseOrder:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
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
				resource: ['purchaseOrder'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         purchaseOrder:search
	// ----------------------------------
	{
		displayName: 'Search Term',
		name: 'searchTerm',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['search'],
			},
		},
		description: 'Search by supplier name or purchase order number',
	},

	// ----------------------------------
	//         purchaseOrder:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Delivery Date',
				name: 'deliveryDate',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Internal Note',
				name: 'internalNote',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Project',
				name: 'project',
				type: 'string',
				default: '',
			},
		],
	},
];
