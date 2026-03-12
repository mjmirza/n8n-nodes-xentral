import { INodeProperties } from 'n8n-workflow';

export const offerFields: INodeProperties[] = [
	// ----------------------------------
	//         offer:create
	// ----------------------------------
	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['offer'],
				operation: ['create'],
			},
		},
		description: 'The ID of the customer (business contact) for this offer',
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: 'de',
		displayOptions: {
			show: {
				resource: ['offer'],
				operation: ['create'],
			},
		},
		description: 'ISO 639-1 language code for the offer document',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['offer'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'dateTime',
				default: '',
				description: 'The date of the offer document (defaults to today)',
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
				description: 'Text shown at the top of the offer document',
			},
			{
				displayName: 'Footer Text',
				name: 'footerText',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Text shown at the bottom of the offer document',
			},
			{
				displayName: 'Validity (Days)',
				name: 'validityDays',
				type: 'number',
				default: 30,
				description: 'How many days the offer is valid',
			},
			{
				displayName: 'Delivery Address (Different)',
				name: 'deliveryAddress',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: 'Address',
						name: 'address',
						values: [
							{
								displayName: 'Company',
								name: 'company',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Street',
								name: 'street',
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
								displayName: 'City',
								name: 'city',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'country',
								type: 'string',
								default: 'DE',
							},
						],
					},
				],
			},
		],
	},

	// ----------------------------------
	//         offer:get / update / delete / release / send / cancel
	// ----------------------------------
	{
		displayName: 'Offer ID',
		name: 'offerId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['offer'],
				operation: ['get', 'update', 'delete', 'release', 'send', 'cancel'],
			},
		},
		description: 'The ID of the offer',
	},

	// ----------------------------------
	//         offer:addLineItem
	// ----------------------------------
	{
		displayName: 'Offer ID',
		name: 'offerId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['offer'],
				operation: ['addLineItem'],
			},
		},
		description: 'The ID of the offer to add the line item to',
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['offer'],
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
				resource: ['offer'],
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
				resource: ['offer'],
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
				description: 'Position number in the offer (0 = auto)',
			},
		],
	},

	// ----------------------------------
	//         offer:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['offer'],
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
				resource: ['offer'],
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
				resource: ['offer'],
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
				description: 'Filter by offer status',
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
				description: 'Only return offers created after this date',
			},
		],
	},

	// ----------------------------------
	//         offer:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['offer'],
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
];
