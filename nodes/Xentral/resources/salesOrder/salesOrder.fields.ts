import type { INodeProperties } from 'n8n-workflow';

export const salesOrderFields: INodeProperties[] = [
	// ----------------------------------
	//         salesOrder:create
	// ----------------------------------
	{
		displayName: 'Customer Name',
		name: 'customerName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['salesOrder'],
				operation: ['create'],
			},
		},
		description: 'The name of the customer for this sales order',
	},
	{
		displayName: 'Project',
		name: 'project',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['salesOrder'],
				operation: ['create'],
			},
		},
		description: 'The project associated with this sales order',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesOrder'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				default: '',
				description: 'The ID of the customer (if known, overrides name-based lookup)',
			},
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'dateTime',
				default: '',
				description: 'The date of the sales order document (defaults to today)',
			},
			{
				displayName: 'Delivery Date',
				name: 'deliveryDate',
				type: 'dateTime',
				default: '',
				description: 'Expected delivery date',
			},
			{
				displayName: 'Payment Method',
				name: 'paymentMethod',
				type: 'string',
				default: '',
				description: 'The payment method to use',
			},
			{
				displayName: 'Shipping Method',
				name: 'shippingMethod',
				type: 'string',
				default: '',
				description: 'The shipping method to use',
			},
			{
				displayName: 'Internal Note',
				name: 'internalNote',
				type: 'string',
				default: '',
				description: 'Internal note (not visible to customer)',
			},
			{
				displayName: 'External Note',
				name: 'externalNote',
				type: 'string',
				default: '',
				description: 'External note (visible to customer)',
			},
		],
	},

	// ----------------------------------
	//         salesOrder:get / update / delete
	// ----------------------------------
	{
		displayName: 'Sales Order ID',
		name: 'salesOrderId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['salesOrder'],
				operation: ['get', 'update', 'delete', 'cancel', 'dispatch'],
			},
		},
		description: 'The ID of the sales order',
	},

	// ----------------------------------
	//         salesOrder:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['salesOrder'],
				operation: ['getAll', 'search'],
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
				resource: ['salesOrder'],
				operation: ['getAll', 'search'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         salesOrder:search
	// ----------------------------------
	{
		displayName: 'Search Term',
		name: 'searchTerm',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['salesOrder'],
				operation: ['search'],
			},
		},
		description: 'Search by document number (e.g. order number)',
	},

	// ----------------------------------
	//         salesOrder:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['salesOrder'],
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
				displayName: 'Payment Method',
				name: 'paymentMethod',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Shipping Method',
				name: 'shippingMethod',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Internal Note',
				name: 'internalNote',
				type: 'string',
				default: '',
			},
			{
				displayName: 'External Note',
				name: 'externalNote',
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
