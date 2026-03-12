import { INodeProperties } from 'n8n-workflow';

export const proformaInvoiceFields: INodeProperties[] = [
	// ----------------------------------
	//         proformaInvoice:create
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['proformaInvoice'],
				operation: ['create'],
			},
		},
		description: 'The ID of the customer (business contact) for this proforma invoice',
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: 'de',
		displayOptions: {
			show: {
				resource: ['proformaInvoice'],
				operation: ['create'],
			},
		},
		description: 'ISO 639-1 language code for the proforma invoice document',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['proformaInvoice'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'dateTime',
				default: '',
				description: 'The date of the proforma invoice document (defaults to today)',
			},
			{
				displayName: 'Delivery Time',
				name: 'deliveryTime',
				type: 'string',
				default: '',
				description: 'Expected delivery time (e.g. "3-5 Werktage")',
			},
			{
				displayName: 'Payment Term',
				name: 'paymentTerm',
				type: 'string',
				default: '',
				description: 'Payment terms (e.g. "14 Tage netto")',
			},
			{
				displayName: 'Shipping Method',
				name: 'shippingMethod',
				type: 'string',
				default: '',
				description: 'The shipping method to use',
			},
			{
				displayName: 'Shipping Cost',
				name: 'shippingCost',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'Shipping cost in EUR',
			},
			{
				displayName: 'Internal Note',
				name: 'internalNote',
				type: 'string',
				default: '',
				description: 'Internal note (not visible to customer)',
			},
			{
				displayName: 'Header Text',
				name: 'headerText',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Text shown at the top of the proforma invoice document',
			},
			{
				displayName: 'Footer Text',
				name: 'footerText',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Text shown at the bottom of the proforma invoice document',
			},
		],
	},

	// ----------------------------------
	//         proformaInvoice:get / update / delete / release / send / cancel / getLineItems / logActivity / setWriteProtection / removeWriteProtection / attachFile
	// ----------------------------------
	{
		displayName: 'Proforma Invoice ID',
		name: 'proformaInvoiceId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['proformaInvoice'],
				operation: [
					'get', 'update', 'delete', 'release', 'send', 'cancel',
					'getLineItems', 'updateLineItem', 'deleteLineItem',
					'logActivity', 'setWriteProtection', 'removeWriteProtection', 'attachFile',
				],
			},
		},
		description: 'The ID of the proforma invoice',
	},

	// ----------------------------------
	//         proformaInvoice:addLineItem
	// ----------------------------------
	{
		displayName: 'Proforma Invoice ID',
		name: 'proformaInvoiceId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['proformaInvoice'],
				operation: ['addLineItem'],
			},
		},
		description: 'The ID of the proforma invoice to add the line item to',
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['proformaInvoice'],
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
				resource: ['proformaInvoice'],
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
				resource: ['proformaInvoice'],
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
				description: 'Position number in the proforma invoice (0 = auto)',
			},
		],
	},

	// ----------------------------------
	//         proformaInvoice:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['proformaInvoice'],
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
				resource: ['proformaInvoice'],
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
				resource: ['proformaInvoice'],
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
				description: 'Filter by proforma invoice status',
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
				description: 'Only return proforma invoices created after this date',
			},
		],
	},

	// ----------------------------------
	//         proformaInvoice:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['proformaInvoice'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Delivery Time',
				name: 'deliveryTime',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Payment Term',
				name: 'paymentTerm',
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
				displayName: 'Shipping Cost',
				name: 'shippingCost',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
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
	//         proformaInvoice:updateLineItem
	// ----------------------------------
	{
		displayName: 'Line Item ID',
		name: 'lineItemId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['proformaInvoice'],
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
				resource: ['proformaInvoice'],
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
	//         proformaInvoice:logActivity
	// ----------------------------------
	{
		displayName: 'Activity Data',
		name: 'activityData',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['proformaInvoice'],
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
	//         proformaInvoice:attachFile
	// ----------------------------------
	{
		displayName: 'File Data',
		name: 'fileData',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['proformaInvoice'],
				operation: ['attachFile'],
			},
		},
		options: [
			{
				displayName: 'File Name',
				name: 'fileName',
				type: 'string',
				default: '',
				description: 'Name of the file to attach',
			},
			{
				displayName: 'File Content (Base64)',
				name: 'content',
				type: 'string',
				default: '',
				description: 'Base64-encoded file content',
			},
			{
				displayName: 'MIME Type',
				name: 'mimeType',
				type: 'string',
				default: 'application/pdf',
				description: 'MIME type of the file',
			},
		],
	},
];
