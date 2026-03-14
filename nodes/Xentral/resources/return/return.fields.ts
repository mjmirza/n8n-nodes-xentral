import type { INodeProperties } from 'n8n-workflow';

// Reusable postal address fields for fixedCollection
const postalAddressValues: INodeProperties[] = [
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		description: 'Name or company name on the address',
	},
	{
		displayName: 'Street',
		name: 'street',
		type: 'string',
		default: '',
		description: 'Street and house number',
	},
	{
		displayName: 'City',
		name: 'city',
		type: 'string',
		default: '',
		description: 'City name',
	},
	{
		displayName: 'ZIP Code',
		name: 'zipCode',
		type: 'string',
		default: '',
		description: 'Postal / ZIP code',
	},
	{
		displayName: 'Country',
		name: 'country',
		type: 'string',
		default: '',
		description: 'Country code (e.g. DE, AT, CH)',
	},
	{
		displayName: 'Address Supplement',
		name: 'addressSupplement',
		type: 'string',
		default: '',
		description: 'Additional address line',
	},
	{
		displayName: 'Contact Person',
		name: 'contactPerson',
		type: 'string',
		default: '',
		description: 'Contact person at this address',
	},
	{
		displayName: 'Department',
		name: 'department',
		type: 'string',
		default: '',
		description: 'Department name',
	},
	{
		displayName: 'Sub-Department',
		name: 'subDepartment',
		type: 'string',
		default: '',
		description: 'Sub-department name',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		description: 'Email address',
	},
	{
		displayName: 'Fax',
		name: 'fax',
		type: 'string',
		default: '',
		description: 'Fax number',
	},
	{
		displayName: 'GLN',
		name: 'gln',
		type: 'string',
		default: '',
		description: 'Global Location Number',
	},
	{
		displayName: 'Mobile',
		name: 'mobile',
		type: 'string',
		default: '',
		description: 'Mobile phone number',
	},
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		default: '',
		description: 'Phone number',
	},
	{
		displayName: 'Salutation',
		name: 'salutation',
		type: 'string',
		default: '',
		description: 'Salutation (e.g. Herr, Frau)',
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'string',
		default: '',
		description: 'State or province',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		description: 'Academic or professional title',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'string',
		default: '',
		description: 'Address type',
	},
];

export const returnFields: INodeProperties[] = [
	// ----------------------------------
	//         return:create
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['create'],
			},
		},
		description: 'The ID of the customer (business contact). Used as address.id in the API.',
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
				displayName: 'Body Introduction',
				name: 'bodyIntroduction',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Text shown at the top of the return order document body',
			},
			{
				displayName: 'Closing Text',
				name: 'bodyOutroduction',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Text shown at the bottom of the return order document body',
			},
			{
				displayName: 'Credit Note ID',
				name: 'creditNoteId',
				type: 'string',
				default: '',
				description: 'ID of the associated credit note (or leave empty for null)',
			},
			{
				displayName: 'Customer Order Number',
				name: 'customerOrderNumber',
				type: 'string',
				default: '',
				description: 'The customer order number',
			},
			{
				displayName: 'Delivery Note ID',
				name: 'deliveryNoteId',
				type: 'string',
				default: '',
				description: 'ID of the associated delivery note (or leave empty for null)',
			},
			{
				displayName: 'Delivery Terms',
				name: 'deliveryTerms',
				type: 'string',
				default: '',
				description: 'Delivery terms text',
			},
			{
				displayName: 'Document Address',
				name: 'documentAddress',
				type: 'fixedCollection',
				default: {},
				description: 'Override the document address (printed on the return order)',
				options: [
					{
						displayName: 'Address',
						name: 'address',
						values: postalAddressValues,
					},
				],
			},
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'string',
				default: '',
				description: 'The date of the return order document (ISO 8601 date string)',
			},
			{
				displayName: 'Editor ID',
				name: 'editorId',
				type: 'string',
				default: '',
				description: 'ID of the editor (employee) for this return order',
			},
			{
				displayName: 'Internal Comment',
				name: 'internalComment',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Internal comment (not visible to customer)',
			},
			{
				displayName: 'Internal Designation',
				name: 'internalDesignation',
				type: 'string',
				default: '',
				description: 'Internal designation for the return order',
			},
			{
				displayName: 'Is Supplier Return Order',
				name: 'isSupplierReturnOrder',
				type: 'boolean',
				default: false,
				description: 'Whether this is a supplier return order',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'ISO 639-1 language code for the document (e.g. de, en)',
			},
			{
				displayName: 'Progress',
				name: 'progress',
				type: 'string',
				default: '',
				description: 'Progress status string',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'ID of the associated project',
			},
			{
				displayName: 'Replacement Sales Order ID',
				name: 'replacementSalesOrderId',
				type: 'string',
				default: '',
				description: 'ID of the replacement sales order',
			},
			{
				displayName: 'Sales Order ID',
				name: 'salesOrderId',
				type: 'string',
				default: '',
				description: 'ID of the related sales order',
			},
			{
				displayName: 'Print Settings',
				name: 'printSettings',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add Print Setting',
				options: [
					{
						displayName: 'Settings',
						name: 'settings',
						values: [
							{
								displayName: 'Without Letterhead',
								name: 'withoutLetterhead',
								type: 'boolean',
								default: false,
								description: 'Whether to print without letterhead',
							},
							{
								displayName: 'Without Product Text',
								name: 'withoutProductText',
								type: 'boolean',
								default: false,
								description: 'Whether to print without product text',
							},
						],
					},
				],
				description: 'Print settings for the document',
			},
			{
				displayName: 'Sales Representative ID',
				name: 'salesId',
				type: 'string',
				default: '',
				description: 'Sales address ID',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
			{
				displayName: 'VAT ID',
				name: 'vatId',
				type: 'string',
				default: '',
				description: 'VAT identification number',
			},
		],
	},

	// ----------------------------------
	//         return:createFromDeliveryNote
	// ----------------------------------
	{
		displayName: 'Delivery Note ID',
		name: 'deliveryNoteId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['createFromDeliveryNote'],
			},
		},
		description: 'The ID of the delivery note to create the return order from',
	},
	{
		displayName: 'Line Items (JSON)',
		name: 'lineItemsJson',
		type: 'json',
		default: '[]',
		required: true,
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['createFromDeliveryNote'],
			},
		},
		description: 'JSON array of line items for the return order. Each item should have product (object with id) and quantity (number).',
	},

	// ----------------------------------
	//         return:get / update / delete / release / cancel / send / logActivity / setWriteProtection / removeWriteProtection
	// ----------------------------------
	{
		displayName: 'Return Order ID',
		name: 'returnId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['return'],
				operation: [
					'get', 'update', 'delete', 'release', 'cancel', 'send',
					'updateLineItem', 'deleteLineItem',
					'logActivity', 'setWriteProtection', 'removeWriteProtection', 'attachFile',
				],
			},
		},
		description: 'The ID of the return order',
	},

	// ----------------------------------
	//         return:addLineItem
	// ----------------------------------
	{
		displayName: 'Return Order ID',
		name: 'returnId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['addLineItem'],
			},
		},
		description: 'The ID of the return order to add the line item to',
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['return'],
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
				resource: ['return'],
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
				resource: ['return'],
				operation: ['addLineItem'],
			},
		},
		options: [
			{
				displayName: 'Country of Origin',
				name: 'countryOfOrigin',
				type: 'string',
				default: '',
				description: 'Country of origin code',
			},
			{
				displayName: 'Customer Product Number',
				name: 'customerProductNumber',
				type: 'string',
				default: '',
				description: 'The customer product number for this line item',
			},
			{
				displayName: 'Delivery Date',
				name: 'deliveryDate',
				type: 'string',
				default: '',
				description: 'Delivery date for this line item (ISO 8601)',
			},
			{
				displayName: 'Delivery Date as Calendar Week',
				name: 'deliveryDateAsCalendarWeek',
				type: 'boolean',
				default: false,
				description: 'Whether the delivery date is a calendar week',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Custom description for this line item',
			},
			{
				displayName: 'Hidden on PDF',
				name: 'hiddenOnPdf',
				type: 'boolean',
				default: false,
				description: 'Whether to hide this line item when printing the document',
			},
			{
				displayName: 'HS Code',
				name: 'hsCode',
				type: 'string',
				default: '',
				description: 'Harmonized System code for customs',
			},
			{
				displayName: 'Internal Comment',
				name: 'internalComment',
				type: 'string',
				default: '',
				description: 'Internal comment for this line item',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Override the product name for this line item',
			},
			{
				displayName: 'Number',
				name: 'number',
				type: 'string',
				default: '',
				description: 'Override the product number for this line item',
			},
			{
				displayName: 'Return Reason',
				name: 'returnReason',
				type: 'string',
				default: '',
				description: 'Reason for the return (as a string or JSON object)',
			},
		],
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
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['return'],
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
				description: 'Filter by return order status',
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				default: '',
				description: 'Filter by customer',
			},
		],
	},

	// ----------------------------------
	//         return:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Body Introduction',
				name: 'bodyIntroduction',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Text shown at the top of the document body',
			},
			{
				displayName: 'Closing Text',
				name: 'bodyOutroduction',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Text shown at the bottom of the document body',
			},
			{
				displayName: 'Credit Note ID',
				name: 'creditNoteId',
				type: 'string',
				default: '',
				description: 'ID of the associated credit note',
			},
			{
				displayName: 'Customer Order Number',
				name: 'customerOrderNumber',
				type: 'string',
				default: '',
				description: "Customer's order number",
			},
			{
				displayName: 'Delivery Note ID',
				name: 'deliveryNoteId',
				type: 'string',
				default: '',
				description: 'Associated delivery note ID',
			},
			{
				displayName: 'Delivery Terms',
				name: 'deliveryTerms',
				type: 'string',
				default: '',
				description: 'Delivery terms',
			},
			{
				displayName: 'Document Address',
				name: 'documentAddress',
				type: 'fixedCollection',
				default: {},
				description: 'Override the document address',
				options: [
					{
						displayName: 'Address',
						name: 'address',
						values: postalAddressValues,
					},
				],
			},
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'string',
				default: '',
				description: 'Document date in ISO 8601 format',
			},
			{
				displayName: 'Editor ID',
				name: 'editorId',
				type: 'string',
				default: '',
				description: 'Editor/user ID',
			},
			{
				displayName: 'Internal Comment',
				name: 'internalComment',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Internal comment, not visible to customer',
			},
			{
				displayName: 'Internal Designation',
				name: 'internalDesignation',
				type: 'string',
				default: '',
				description: 'Internal designation',
			},
			{
				displayName: 'Is Supplier Return Order',
				name: 'isSupplierReturnOrder',
				type: 'boolean',
				default: false,
				description: 'Whether this is a supplier return',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'Document language (e.g. de, en)',
			},
			{
				displayName: 'Progress',
				name: 'progress',
				type: 'string',
				default: '',
				description: 'Progress status',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Project ID',
			},
			{
				displayName: 'Replacement Sales Order ID',
				name: 'replacementSalesOrderId',
				type: 'string',
				default: '',
				description: 'Replacement sales order ID',
			},
			{
				displayName: 'Sales Order ID',
				name: 'salesOrderId',
				type: 'string',
				default: '',
				description: 'Associated sales order ID',
			},
			{
				displayName: 'Print Settings',
				name: 'printSettings',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add Print Setting',
				options: [
					{
						displayName: 'Settings',
						name: 'settings',
						values: [
							{
								displayName: 'Without Letterhead',
								name: 'withoutLetterhead',
								type: 'boolean',
								default: false,
								description: 'Whether to print without letterhead',
							},
							{
								displayName: 'Without Product Text',
								name: 'withoutProductText',
								type: 'boolean',
								default: false,
								description: 'Whether to print without product text',
							},
						],
					},
				],
				description: 'Print settings for the document',
			},
			{
				displayName: 'Sales Representative ID',
				name: 'salesId',
				type: 'string',
				default: '',
				description: 'Sales address ID',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
			{
				displayName: 'Use Alternative Document Title',
				name: 'useAlternativeDocumentTitle',
				type: 'boolean',
				default: false,
				description: 'Whether to use an alternative document title',
			},
			{
				displayName: 'VAT ID',
				name: 'vatId',
				type: 'string',
				default: '',
				description: 'VAT identification number',
			},
		],
	},

	// ----------------------------------
	//         return:updateLineItem / deleteLineItem
	// ----------------------------------
	{
		displayName: 'Line Item ID',
		name: 'lineItemId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['return'],
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
				resource: ['return'],
				operation: ['updateLineItem'],
			},
		},
		options: [
			{
				displayName: 'Delivery Date',
				name: 'deliveryDate',
				type: 'string',
				default: '',
				description: 'Expected delivery date',
			},
			{
				displayName: 'Delivery Date as Calendar Week',
				name: 'deliveryDateAsCalendarWeek',
				type: 'boolean',
				default: false,
				description: 'Whether delivery date is a calendar week',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Line item description text',
			},
			{
				displayName: 'Hidden on PDF',
				name: 'hiddenOnPdf',
				type: 'boolean',
				default: false,
				description: 'Whether to hide this line item when printing the document',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Product/item name',
			},
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				default: '',
				description: 'ID of the product to change this line item to',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
				typeOptions: { minValue: 1 },
				description: 'Quantity',
			},
			{
				displayName: 'Return Reason',
				name: 'returnReason',
				type: 'string',
				default: '',
				description: 'Reason for the return',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'number',
				default: 0,
				description: 'Sort position of this line item (integer)',
			},
		],
	},

	// ----------------------------------
	//         return:logActivity
	// ----------------------------------
	{
		displayName: 'Message',
		name: 'activityMessage',
		type: 'string',
		required: true,
		default: '',
		description: 'Message to log in the activity log (max 255 characters)',
		displayOptions: {
			show: {
				operation: ['logActivity'],
				resource: ['return'],
			},
		},
	},

	// ----------------------------------
	//         return:attachFile
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['return'],
				operation: ['attachFile'],
			},
		},
		description: 'Name of the binary property containing the file to upload. In most cases the default "data" works when connected to a node that outputs binary data (e.g. Email Trigger, HTTP Request, Read Binary File).',
	},
];
