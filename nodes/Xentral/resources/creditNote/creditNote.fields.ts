import type { INodeProperties } from 'n8n-workflow';

export const creditNoteFields: INodeProperties[] = [
	// ----------------------------------
	//         creditNote:create
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['creditNote'],
				operation: ['create'],
			},
		},
		description: 'The ID of the customer (business contact) for this credit note',
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: 'de',
		displayOptions: {
			show: {
				resource: ['creditNote'],
				operation: ['create'],
			},
		},
		description: 'ISO 639-1 language code for the credit note document',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['creditNote'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'dateTime',
				default: '',
				description: 'The date of the credit note document (defaults to today)',
			},
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				description: 'Reason for issuing the credit note',
			},
			{
				displayName: 'Header Text',
				name: 'headerText',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Text shown at the top of the credit note document',
			},
			{
				displayName: 'Footer Text',
				name: 'footerText',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Text shown at the bottom of the credit note document',
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
	//         creditNote:get / update / delete / release / send / cancel / logActivity / setWriteProtection / removeWriteProtection / attachFile
	// ----------------------------------
	{
		displayName: 'Credit Note ID',
		name: 'creditNoteId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['creditNote'],
				operation: [
					'get', 'update', 'delete', 'release', 'send', 'cancel',
					'updateLineItem', 'deleteLineItem',
					'logActivity', 'setWriteProtection', 'removeWriteProtection', 'attachFile',
				],
			},
		},
		description: 'The ID of the credit note',
	},

	// ----------------------------------
	//         creditNote:addLineItem
	// ----------------------------------
	{
		displayName: 'Credit Note ID',
		name: 'creditNoteId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['creditNote'],
				operation: ['addLineItem'],
			},
		},
		description: 'The ID of the credit note to add the line item to',
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['creditNote'],
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
				resource: ['creditNote'],
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
				resource: ['creditNote'],
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
				description: 'Position number in the credit note (0 = auto)',
			},
		],
	},

	// ----------------------------------
	//         creditNote:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['creditNote'],
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
				resource: ['creditNote'],
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
				resource: ['creditNote'],
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
				description: 'Filter by credit note status',
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
				description: 'Only return credit notes created after this date',
			},
		],
	},

	// ----------------------------------
	//         creditNote:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['creditNote'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Reason',
				name: 'reason',
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
				displayName: 'Header Text',
				name: 'headerText',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Footer Text',
				name: 'footerText',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         creditNote:updateLineItem
	// ----------------------------------
	{
		displayName: 'Line Item ID',
		name: 'lineItemId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['creditNote'],
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
				resource: ['creditNote'],
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

	// ----------------------------------
	//         creditNote:logActivity
	// ----------------------------------
	{
		displayName: 'Activity Data',
		name: 'activityData',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['creditNote'],
				operation: ['logActivity'],
			},
		},
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				description: 'The type of the activity',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'A note for the activity',
			},
		],
	},

	// ----------------------------------
	//         creditNote:attachFile
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['creditNote'],
				operation: ['attachFile'],
			},
		},
		description: 'Name of the binary property containing the file to upload. In most cases the default "data" works when connected to a node that outputs binary data (e.g. Email Trigger, HTTP Request, Read Binary File).',
	},
];
