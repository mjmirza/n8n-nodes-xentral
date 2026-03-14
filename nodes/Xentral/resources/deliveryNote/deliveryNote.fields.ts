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
		description: 'The ID of the customer (business contact / address) for this delivery note',
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
				displayName: 'Commission Consignment Warehouse ID',
				name: 'commissionConsignmentWarehouseId',
				type: 'string',
				default: '',
				description: 'ID of the commission consignment warehouse',
			},
			{
				displayName: 'Cost Center',
				name: 'costCenter',
				type: 'string',
				default: '',
				description: 'Cost center for this delivery note',
			},
			{
				displayName: 'Delivery Terms',
				name: 'deliveryTerms',
				type: 'string',
				default: '',
				description: 'Delivery terms for this delivery note',
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
				description: 'The date of the delivery note document (defaults to today)',
			},
			{
				displayName: 'Editor ID',
				name: 'editorId',
				type: 'string',
				default: '',
				description: 'ID of the editor (employee) responsible for this delivery note',
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
				description: 'Internal designation for the delivery note',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: 'de',
				description: 'ISO 639-1 language code for the document',
			},
			{
				displayName: 'Master Reference Number',
				name: 'masterReferenceNumber',
				type: 'string',
				default: '',
				description: 'Master reference number for grouping related documents',
			},
			{
				displayName: 'Order Picking ID',
				name: 'orderPickingId',
				type: 'string',
				default: '',
				description: 'ID of the order picking record',
			},
			{
				displayName: 'Preferred Warehouse ID',
				name: 'preferredWarehouseId',
				type: 'string',
				default: '',
				description: 'ID of the preferred warehouse',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'ID of the project this delivery note belongs to',
			},
			{
				displayName: 'Sales Representative ID',
				name: 'salesId',
				type: 'string',
				default: '',
				description: 'ID of the sales representative',
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
	//         deliveryNote:get / update / delete / actions
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
					'get', 'update', 'delete', 'release', 'send', 'cancel',
					'updateLineItem', 'deleteLineItem',
					'logActivity', 'setWriteProtection', 'removeWriteProtection', 'attachFile',
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
				displayName: 'Delivered Quantity',
				name: 'deliveredQuantity',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'The quantity that has actually been delivered',
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
				description: 'Name override for this line item',
			},
			{
				displayName: 'Number',
				name: 'number',
				type: 'string',
				default: '',
				description: 'Product number override',
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
				displayName: 'Commission Consignment Warehouse ID',
				name: 'commissionConsignmentWarehouseId',
				type: 'string',
				default: '',
				description: 'Commission consignment warehouse ID',
			},
			{
				displayName: 'Cost Center',
				name: 'costCenter',
				type: 'string',
				default: '',
				description: 'Cost center for accounting',
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
				displayName: 'Master Reference Number',
				name: 'masterReferenceNumber',
				type: 'string',
				default: '',
				description: 'Master reference number for linked documents',
			},
			{
				displayName: 'Order Picking ID',
				name: 'orderPickingId',
				type: 'string',
				default: '',
				description: 'Order picking ID',
			},
			{
				displayName: 'Preferred Warehouse ID',
				name: 'preferredWarehouseId',
				type: 'string',
				default: '',
				description: 'ID of preferred warehouse',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Project ID',
			},
			{
				displayName: 'Sales Representative ID',
				name: 'salesId',
				type: 'string',
				default: '',
				description: 'Sales representative ID',
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
		name: 'lineItemUpdateFields',
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
				displayName: 'Delivered Quantity',
				name: 'deliveredQuantity',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'The quantity that has actually been delivered',
			},
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
		],
	},

	// ----------------------------------
	//         deliveryNote:logActivity
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
				resource: ['deliveryNote'],
			},
		},
	},

	// ----------------------------------
	//         deliveryNote:attachFile
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
				operation: ['attachFile'],
			},
		},
		description: 'Name of the binary property containing the file to upload. In most cases the default "data" works when connected to a node that outputs binary data (e.g. Email Trigger, HTTP Request, Read Binary File).',
	},
];
