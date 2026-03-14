import type { INodeProperties } from 'n8n-workflow';

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
		description: 'The ID of the supplier (business contact / address) for this purchase order',
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
				displayName: 'Body Introduction',
				name: 'bodyIntroduction',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Introductory text shown at the top of the document',
			},
			{
				displayName: 'Closing Text',
				name: 'bodyOutroduction',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Closing text shown at the bottom of the document',
			},
			{
				displayName: 'Confirmation Type',
				name: 'confirmationType',
				type: 'string',
				default: '',
				description: 'Confirmation type for the purchase order (or leave empty for null)',
			},
			{
				displayName: 'Confirmed Delivery Date',
				name: 'confirmedDeliveryDate',
				type: 'dateTime',
				default: '',
				description: 'The confirmed delivery date from the supplier',
			},
			{
				displayName: 'Cost Center',
				name: 'costCenter',
				type: 'string',
				default: '',
				description: 'Cost center for this purchase order',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: 'EUR',
				description: 'Currency code for the financials (e.g. EUR, USD)',
			},
			{
				displayName: 'Delivery Terms',
				name: 'deliveryTerms',
				type: 'string',
				default: '',
				description: 'Delivery terms for this purchase order',
			},
			{
				displayName: 'Desired Delivery Date',
				name: 'desiredDeliveryDate',
				type: 'dateTime',
				default: '',
				description: 'The desired delivery date',
			},
			{
				displayName: 'Document Address',
				name: 'documentAddress',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: 'Address',
						name: 'address',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								required: true,
								description: 'Name or company name',
							},
							{
								displayName: 'Street',
								name: 'street',
								type: 'string',
								default: '',
							},
							{
								displayName: 'City',
								name: 'city',
								type: 'string',
								default: '',
							},
							{
								displayName: 'ZIP Code',
								name: 'zipCode',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: 'DE',
							},
							{
								displayName: 'Address Supplement',
								name: 'addressSupplement',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Contact Person',
								name: 'contactPerson',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Department',
								name: 'department',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Sub-Department',
								name: 'subDepartment',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Email',
								name: 'email',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Fax',
								name: 'fax',
								type: 'string',
								default: '',
							},
							{
								displayName: 'GLN',
								name: 'gln',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Mobile',
								name: 'mobile',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Phone',
								name: 'phone',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Salutation',
								name: 'salutation',
								type: 'string',
								default: '',
							},
							{
								displayName: 'State',
								name: 'state',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Title',
								name: 'title',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'dateTime',
				default: '',
				description: 'The date of the purchase order document (defaults to today)',
			},
			{
				displayName: 'Editor ID',
				name: 'editorId',
				type: 'string',
				default: '',
				description: 'ID of the editor (employee) responsible for this purchase order',
			},
			{
				displayName: 'Internal Comment',
				name: 'internalComment',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Internal comment (not visible to supplier)',
			},
			{
				displayName: 'Internal Designation',
				name: 'internalDesignation',
				type: 'string',
				default: '',
				description: 'Internal designation for the purchase order',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: 'de',
				description: 'ISO 639-1 language code for the document',
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
								displayName: 'Without Prices',
								name: 'withoutPrices',
								type: 'boolean',
								default: false,
								description: 'Whether to print without prices',
							},
							{
								displayName: 'Without Product Numbers',
								name: 'withoutProductNumbers',
								type: 'boolean',
								default: false,
								description: 'Whether to print without product numbers',
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
				description: 'ID of the project this purchase order belongs to',
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
				default: 'domestic',
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
	//         purchaseOrder:get / update / delete / actions
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
				operation: [
					'get', 'update', 'delete', 'release', 'send', 'cancel',
					'updateLineItem', 'deleteLineItem',
					'logActivity', 'setWriteProtection', 'removeWriteProtection', 'attachFile',
				],
			},
		},
		description: 'The ID of the purchase order',
	},

	// ----------------------------------
	//         purchaseOrder:addLineItem
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
				operation: ['addLineItem'],
			},
		},
		description: 'The ID of the purchase order to add the line item to',
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
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
				resource: ['purchaseOrder'],
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
				resource: ['purchaseOrder'],
				operation: ['addLineItem'],
			},
		},
		options: [
			{
				displayName: 'Country of Origin',
				name: 'countryOfOrigin',
				type: 'string',
				default: '',
				description: 'Country of origin for the product',
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
				type: 'dateTime',
				default: '',
				description: 'Expected delivery date for this line item',
			},
			{
				displayName: 'Delivery Date as Calendar Week',
				name: 'deliveryDateAsCalendarWeek',
				type: 'boolean',
				default: false,
				description: 'Whether to interpret the delivery date as a calendar week',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Custom description for this line item',
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
				description: 'Name override for this line item',
			},
			{
				displayName: 'Number',
				name: 'number',
				type: 'string',
				default: '',
				description: 'Product number override',
			},
			{
				displayName: 'Price Amount',
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
				description: 'Tax legal notice text for the line item',
			},
		],
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
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
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
				description: 'Filter by purchase order status',
			},
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Only return purchase orders created after this date',
			},
		],
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
				displayName: 'Body Introduction',
				name: 'bodyIntroduction',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Introductory text shown at the top of the document',
			},
			{
				displayName: 'Closing Text',
				name: 'bodyOutroduction',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Closing text shown at the bottom of the document',
			},
			{
				displayName: 'Confirmation Type',
				name: 'confirmationType',
				type: 'string',
				default: '',
				description: 'Confirmation type',
			},
			{
				displayName: 'Confirmed Delivery Date',
				name: 'confirmedDeliveryDate',
				type: 'dateTime',
				default: '',
				description: 'Confirmed delivery date',
			},
			{
				displayName: 'Cost Center',
				name: 'costCenter',
				type: 'string',
				default: '',
				description: 'Cost center for accounting',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				default: 'EUR',
				description: 'Currency code for the financials',
			},
			{
				displayName: 'Delivery Terms',
				name: 'deliveryTerms',
				type: 'string',
				default: '',
				description: 'Delivery terms',
			},
			{
				displayName: 'Desired Delivery Date',
				name: 'desiredDeliveryDate',
				type: 'dateTime',
				default: '',
				description: 'Desired delivery date',
			},
			{
				displayName: 'Document Address',
				name: 'documentAddress',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: 'Address',
						name: 'address',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								required: true,
								description: 'Product/item name',
							},
							{
								displayName: 'Street',
								name: 'street',
								type: 'string',
								default: '',
							},
							{
								displayName: 'City',
								name: 'city',
								type: 'string',
								default: '',
							},
							{
								displayName: 'ZIP Code',
								name: 'zipCode',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: 'DE',
							},
							{
								displayName: 'Address Supplement',
								name: 'addressSupplement',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Contact Person',
								name: 'contactPerson',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Department',
								name: 'department',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Sub-Department',
								name: 'subDepartment',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Email',
								name: 'email',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Fax',
								name: 'fax',
								type: 'string',
								default: '',
							},
							{
								displayName: 'GLN',
								name: 'gln',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Mobile',
								name: 'mobile',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Phone',
								name: 'phone',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Salutation',
								name: 'salutation',
								type: 'string',
								default: '',
							},
							{
								displayName: 'State',
								name: 'state',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Title',
								name: 'title',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'dateTime',
				default: '',
				description: 'Document date in ISO 8601 format',
			},
			{
				displayName: 'Editor ID',
				name: 'editorId',
				type: 'string',
				default: '',
				description: 'ID of the editor (employee)',
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
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'Document language (e.g. de, en)',
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
								displayName: 'Without Prices',
								name: 'withoutPrices',
								type: 'boolean',
								default: false,
								description: 'Whether to print without prices',
							},
							{
								displayName: 'Without Product Numbers',
								name: 'withoutProductNumbers',
								type: 'boolean',
								default: false,
								description: 'Whether to print without product numbers',
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
				description: 'Project ID',
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
				default: 'domestic',
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
	//         purchaseOrder:updateLineItem
	// ----------------------------------
	{
		displayName: 'Line Item ID',
		name: 'lineItemId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['updateLineItem', 'deleteLineItem'],
			},
		},
		description: 'The ID of the line item',
	},
	{
		displayName: 'Update Fields',
		name: 'lineItemUpdateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['updateLineItem'],
			},
		},
		options: [
			{
				displayName: 'Delivery Date',
				name: 'deliveryDate',
				type: 'dateTime',
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
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Product/item name',
			},
			{
				displayName: 'Price Amount',
				name: 'priceAmount',
				type: 'number',
				default: 0,
				description: 'Unit price amount',
				typeOptions: { numberPrecision: 2 },
			},
			{
				displayName: 'Price Currency',
				name: 'priceCurrency',
				type: 'string',
				default: 'EUR',
				description: 'Price currency code (e.g. EUR)',
			},
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				default: '',
				description: 'Product ID',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
				description: 'Quantity',
				typeOptions: { minValue: 1 },
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'number',
				default: 0,
				description: 'Sort order (integer) of the line item in the document',
			},
			{
				displayName: 'Tax Legal Notice',
				name: 'taxLegalNotice',
				type: 'string',
				default: '',
				description: 'Tax legal notice text',
			},
		],
	},

	// ----------------------------------
	//         purchaseOrder:logActivity
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
				resource: ['purchaseOrder'],
			},
		},
	},

	// ----------------------------------
	//         purchaseOrder:attachFile
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
				operation: ['attachFile'],
			},
		},
		description: 'Name of the binary property containing the file to upload. In most cases the default "data" works when connected to a node that outputs binary data (e.g. Email Trigger, HTTP Request, Read Binary File).',
	},
];
