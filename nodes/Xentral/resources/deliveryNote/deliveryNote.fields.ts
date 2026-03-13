import type { INodeProperties } from 'n8n-workflow';

export const deliveryNoteFields: INodeProperties[] = [
	// ----------------------------------
	//         deliveryNote:create
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: ['create'],
			},
		},
		description: 'The ID of the customer (business contact) for this delivery note',
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: 'de',
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: ['create'],
			},
		},
		description: 'ISO 639-1 language code for the delivery note document',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'dateTime',
				default: '',
				description: 'The date of the delivery note document (defaults to today)',
			},
			{
				displayName: 'Sales Order ID',
				name: 'salesOrderId',
				type: 'string',
				default: '',
				description: 'The ID of the related sales order',
			},
			{
				displayName: 'Shipping Method',
				name: 'shippingMethod',
				type: 'string',
				default: '',
				description: 'The shipping method to use',
			},
			{
				displayName: 'Tracking Number',
				name: 'trackingNumber',
				type: 'string',
				default: '',
				description: 'The shipment tracking number',
			},
			{
				displayName: 'Carrier',
				name: 'carrier',
				type: 'string',
				default: '',
				description: 'The shipping carrier (e.g. DHL, DPD, UPS)',
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
	//         deliveryNote:get / update / delete / attachFile
	// ----------------------------------
	{
		displayName: 'Delivery Note ID',
		name: 'deliveryNoteId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: [
					'get', 'update', 'delete',
					'updateLineItem', 'deleteLineItem',
				],
			},
		},
		description: 'The ID of the delivery note',
	},

	// ----------------------------------
	//         deliveryNote:addLineItem
	// ----------------------------------
	{
		displayName: 'Delivery Note ID',
		name: 'deliveryNoteId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: ['addLineItem'],
			},
		},
		description: 'The ID of the delivery note to add the line item to',
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: ['addLineItem'],
			},
		},
		description: 'The ID of the product to add',
	},
	{
		displayName: 'Quantity',
		name: 'quantity',
		type: 'number',
		default: 1,
		required: true,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: ['addLineItem'],
			},
		},
		description: 'The quantity of the product',
	},
	{
		displayName: 'Line Item Options',
		name: 'lineItemOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: ['addLineItem'],
			},
		},
		options: [
			{
				displayName: 'Unit Price Override',
				name: 'unitPrice',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'Override the default product price',
			},
			{
				displayName: 'Discount (%)',
				name: 'discount',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'Discount percentage for this line item',
			},
			{
				displayName: 'Description Override',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Custom description for this line item',
			},
			{
				displayName: 'Position Number',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'Position number in the delivery note (0 = auto)',
			},
		],
	},

	// ----------------------------------
	//         deliveryNote:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
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
				resource: ['deliveryNote'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Draft', value: 'draft' },
					{ name: 'Released', value: 'released' },
					{ name: 'Sent', value: 'sent' },
					{ name: 'Cancelled', value: 'cancelled' },
				],
				default: 'released',
				description: 'Filter by delivery note status',
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				default: '',
				description: 'Filter by customer',
			},
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Only return delivery notes created after this date',
			},
		],
	},

	// ----------------------------------
	//         deliveryNote:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Shipping Method',
				name: 'shippingMethod',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tracking Number',
				name: 'trackingNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Carrier',
				name: 'carrier',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Internal Note',
				name: 'internalNote',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         deliveryNote:updateLineItem
	// ----------------------------------
	{
		displayName: 'Line Item ID',
		name: 'lineItemId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: ['updateLineItem', 'deleteLineItem'],
			},
		},
		description: 'The ID of the line item',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: ['updateLineItem'],
			},
		},
		options: [
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
				typeOptions: { minValue: 1 },
			},
			{
				displayName: 'Unit Price',
				name: 'unitPrice',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
			},
			{
				displayName: 'Discount (%)',
				name: 'discount',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Position Number',
				name: 'position',
				type: 'number',
				default: 0,
			},
		],
	},

];
