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

export const invoiceFields: INodeProperties[] = [
	// ----------------------------------
	//         invoice:create
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
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
				resource: ['invoice'],
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
				description: 'Text shown at the top of the invoice document body',
			},
			{
				displayName: 'Body Outroduction',
				name: 'bodyOutroduction',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Text shown at the bottom of the invoice document body',
			},
			{
				displayName: 'Cost Center',
				name: 'costCenter',
				type: 'string',
				default: '',
				description: 'Cost center for the invoice',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'Currency code for the financials object (e.g. EUR, USD)',
			},
			{
				displayName: 'Customer Order Number',
				name: 'customerOrderNumber',
				type: 'string',
				default: '',
				description: 'The customer order number',
			},
			{
				displayName: 'Delivery Date',
				name: 'deliveryDate',
				type: 'string',
				default: '',
				description: 'Delivery date (ISO 8601 date string)',
			},
			{
				displayName: 'Delivery Terms',
				name: 'deliveryTerms',
				type: 'string',
				default: '',
				description: 'Delivery terms text',
			},
			{
				displayName: 'Deviating Debtor Account Number',
				name: 'deviatingDebtorAccountNumber',
				type: 'string',
				default: '',
				description: 'Deviating debtor account number for bookkeeping',
			},
			{
				displayName: 'Document Address',
				name: 'documentAddress',
				type: 'fixedCollection',
				default: {},
				description: 'Override the document address (printed on the invoice)',
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
				description: 'The date of the invoice document (ISO 8601 date string, defaults to today)',
			},
			{
				displayName: 'Dunning Manual Settings',
				name: 'dunningManualSettingsJson',
				type: 'string',
				default: '',
				description: 'Manual dunning settings as JSON string. Set to "null" to clear.',
			},
			{
				displayName: 'Dunning Set Manually',
				name: 'dunningSetManually',
				type: 'boolean',
				default: false,
				description: 'Whether dunning settings are set manually',
			},
			{
				displayName: 'Dunning Settings JSON',
				name: 'dunningSettingsJson',
				type: 'string',
				default: '',
				description: 'Dunning settings as JSON string (complex object)',
			},
			{
				displayName: 'Editor ID',
				name: 'editorId',
				type: 'string',
				default: '',
				description: 'ID of the editor (employee) for this invoice',
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
				description: 'Internal designation for the invoice',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'ISO 639-1 language code for the invoice document (e.g. de, en)',
			},
			{
				displayName: 'Master Reference Number',
				name: 'masterReferenceNumber',
				type: 'string',
				default: '',
				description: 'Master reference number for linked documents',
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
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'ID of the associated project',
			},
			{
				displayName: 'Sales ID',
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
				displayName: 'Taxation',
				name: 'taxation',
				type: 'options',
				default: '',
				options: [
					{ name: 'Domestic', value: 'domestic' },
					{ name: 'EU', value: 'eu' },
					{ name: 'Export', value: 'export' },
					{ name: 'Exempt', value: 'exempt' },
				],
				description: 'Taxation type of the document',
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
	//         invoice:get / update / delete / release / logActivity / setWriteProtection / removeWriteProtection / attachFile
	// ----------------------------------
	{
		displayName: 'Invoice ID',
		name: 'invoiceId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: [
					'get', 'update', 'delete', 'release', 'send',
					'updateLineItem', 'deleteLineItem',
					'logActivity', 'setWriteProtection', 'removeWriteProtection', 'attachFile',
				],
			},
		},
		description: 'The ID of the invoice',
	},

	// ----------------------------------
	//         invoice:createFromSalesOrder
	// ----------------------------------
	{
		displayName: 'Sales Order ID',
		name: 'salesOrderId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['createFromSalesOrder'],
			},
		},
		description: 'The ID of the sales order to create the invoice from',
	},

	// ----------------------------------
	//         invoice:addLineItem
	// ----------------------------------
	{
		displayName: 'Invoice ID',
		name: 'invoiceId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['addLineItem'],
			},
		},
		description: 'The ID of the invoice to add the line item to',
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
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
				resource: ['invoice'],
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
				resource: ['invoice'],
				operation: ['addLineItem'],
			},
		},
		options: [
			{
				displayName: 'Country of Origin',
				name: 'countryOfOrigin',
				type: 'string',
				default: '',
				description: 'Country of origin code (e.g. DE)',
			},
			{
				displayName: 'Customer Product Number',
				name: 'customerProductNumber',
				type: 'string',
				default: '',
				description: 'The customer-specific product number',
			},
			{
				displayName: 'Delivery Date',
				name: 'deliveryDate',
				type: 'string',
				default: '',
				description: 'Delivery date for this line item (ISO 8601 date string)',
			},
			{
				displayName: 'Delivery Date as Calendar Week',
				name: 'deliveryDateAsCalendarWeek',
				type: 'boolean',
				default: false,
				description: 'Whether the delivery date should be interpreted as a calendar week',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Custom description for this line item',
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
				displayName: 'Price Amount (Net)',
				name: 'priceAmount',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'Net price amount for this line item',
			},
			{
				displayName: 'Price Currency',
				name: 'priceCurrency',
				type: 'string',
				default: 'EUR',
				description: 'Currency for the price (e.g. EUR, USD)',
			},
			{
				displayName: 'Tax Legal Notice',
				name: 'taxLegalNotice',
				type: 'string',
				default: '',
				description: 'Tax-related legal notice for this line item',
			},
		],
	},

	// ----------------------------------
	//         invoice:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['invoice'],
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
				resource: ['invoice'],
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
				resource: ['invoice'],
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
				description: 'Filter by invoice status',
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
				description: 'Only return invoices created after this date',
			},
		],
	},

	// ----------------------------------
	//         invoice:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['invoice'],
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
				description: 'Text shown at the top of the invoice document body',
			},
			{
				displayName: 'Body Outroduction',
				name: 'bodyOutroduction',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Text shown at the bottom of the invoice document body',
			},
			{
				displayName: 'Cost Center',
				name: 'costCenter',
				type: 'string',
				default: '',
				description: 'Cost center for the invoice',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: '',
				description: 'Currency code for the financials object (e.g. EUR, USD)',
			},
			{
				displayName: 'Customer Order Number',
				name: 'customerOrderNumber',
				type: 'string',
				default: '',
				description: 'The customer order number',
			},
			{
				displayName: 'Delivery Date',
				name: 'deliveryDate',
				type: 'string',
				default: '',
				description: 'Delivery date (ISO 8601 date string, or empty to clear)',
			},
			{
				displayName: 'Delivery Terms',
				name: 'deliveryTerms',
				type: 'string',
				default: '',
				description: 'Delivery terms text',
			},
			{
				displayName: 'Deviating Debtor Account Number',
				name: 'deviatingDebtorAccountNumber',
				type: 'string',
				default: '',
				description: 'Deviating debtor account number for bookkeeping',
			},
			{
				displayName: 'Document Address',
				name: 'documentAddress',
				type: 'fixedCollection',
				default: {},
				description: 'Override the document address (printed on the invoice)',
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
				description: 'The date of the invoice document (ISO 8601 date string)',
			},
			{
				displayName: 'Dunning Manual Settings',
				name: 'dunningManualSettingsJson',
				type: 'string',
				default: '',
				description: 'Manual dunning settings as JSON string. Set to "null" to clear.',
			},
			{
				displayName: 'Dunning Set Manually',
				name: 'dunningSetManually',
				type: 'boolean',
				default: false,
				description: 'Whether dunning settings are set manually',
			},
			{
				displayName: 'Dunning Settings JSON',
				name: 'dunningSettingsJson',
				type: 'string',
				default: '',
				description: 'Dunning settings as JSON string (complex object)',
			},
			{
				displayName: 'Editor ID',
				name: 'editorId',
				type: 'string',
				default: '',
				description: 'ID of the editor (employee) for this invoice',
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
				description: 'Internal designation for the invoice',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'ISO 639-1 language code for the invoice document',
			},
			{
				displayName: 'Master Reference Number',
				name: 'masterReferenceNumber',
				type: 'string',
				default: '',
				description: 'Master reference number for linked documents',
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
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'ID of the associated project. Set empty to remove.',
			},
			{
				displayName: 'Sales ID',
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
				displayName: 'Taxation',
				name: 'taxation',
				type: 'options',
				default: '',
				options: [
					{ name: 'Domestic', value: 'domestic' },
					{ name: 'EU', value: 'eu' },
					{ name: 'Export', value: 'export' },
					{ name: 'Exempt', value: 'exempt' },
				],
				description: 'Taxation type of the document',
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
	//         invoice:updateLineItem
	// ----------------------------------
	{
		displayName: 'Line Item ID',
		name: 'lineItemId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
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
				resource: ['invoice'],
				operation: ['updateLineItem'],
			},
		},
		options: [
			{
				displayName: 'Delivery Date',
				name: 'deliveryDate',
				type: 'string',
				default: '',
				description: 'Delivery date for this line item (ISO 8601 date string, or empty to clear)',
			},
			{
				displayName: 'Delivery Date as Calendar Week',
				name: 'deliveryDateAsCalendarWeek',
				type: 'boolean',
				default: false,
				description: 'Whether the delivery date should be interpreted as a calendar week',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Custom description for this line item',
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
				description: 'Override the product name for this line item',
			},
			{
				displayName: 'Price Amount (Net)',
				name: 'priceAmount',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'Net price amount for this line item',
			},
			{
				displayName: 'Price Currency',
				name: 'priceCurrency',
				type: 'string',
				default: 'EUR',
				description: 'Currency for the price (e.g. EUR, USD)',
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
				description: 'Quantity of the product',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'number',
				default: 0,
				description: 'Sort position of this line item (integer)',
			},
			{
				displayName: 'Tax Legal Notice',
				name: 'taxLegalNotice',
				type: 'string',
				default: '',
				description: 'Tax-related legal notice for this line item',
			},
		],
	},

	// ----------------------------------
	//         invoice:logActivity
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
				resource: ['invoice'],
			},
		},
	},

	// ----------------------------------
	//         invoice:attachFile
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['attachFile'],
			},
		},
		description: 'Name of the binary property containing the file to upload. In most cases the default "data" works when connected to a node that outputs binary data (e.g. Email Trigger, HTTP Request, Read Binary File).',
	},
];
