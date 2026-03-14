import type { INodeProperties } from 'n8n-workflow';

export const liabilityFields: INodeProperties[] = [
	// ----------------------------------
	//         liability:create
	// ----------------------------------
	{
		displayName: 'Supplier ID',
		name: 'supplierId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['liability'],
				operation: ['create'],
			},
		},
		description: 'The ID of the supplier for this liability. Used as supplier.id in the API.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['liability'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Booking Text',
				name: 'bookingText',
				type: 'string',
				default: '',
				description: 'Booking text for the liability',
			},
			{
				displayName: 'Clarification Case',
				name: 'clarificationCase',
				type: 'boolean',
				default: false,
				description: 'Whether this liability is a clarification case',
			},
			{
				displayName: 'Clarification Reason',
				name: 'clarificationReason',
				type: 'string',
				default: '',
				description: 'Reason for the clarification case',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'string',
				default: '',
				description: 'The liability date (ISO 8601 date string)',
			},
			{
				displayName: 'Internal Comment',
				name: 'internalComment',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Internal comment (not visible externally)',
			},
			{
				displayName: 'Invoice Release',
				name: 'invoiceRelease',
				type: 'boolean',
				default: false,
				description: 'Whether to release the invoice',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'ID of the associated project',
			},
			{
				displayName: 'Receipt Date',
				name: 'receiptDate',
				type: 'string',
				default: '',
				description: 'Receipt date (ISO 8601 date string)',
			},
			{
				displayName: 'Release',
				name: 'release',
				type: 'boolean',
				default: false,
				description: 'Whether to release the liability on creation',
			},
			{
				displayName: 'Service Date',
				name: 'serviceDate',
				type: 'string',
				default: '',
				description: 'Service date (ISO 8601 date string)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Pending', value: 'PENDING' },
					{ name: 'Paid', value: 'PAID' },
					{ name: 'Partially Paid', value: 'PARTIALLY_PAID' },
					{ name: 'Cancelled', value: 'CANCELLED' },
				],
				default: 'PENDING',
				description: 'Status of the liability',
			},
			{
				displayName: 'Supplier Invoice Number',
				name: 'supplierInvoiceNumber',
				type: 'string',
				default: '',
				description: 'The supplier invoice number',
			},
			{
				displayName: 'Financials (JSON)',
				name: 'financialsJson',
				type: 'json',
				default: '{}',
				description: 'Financials object as JSON (e.g. {"currency": "EUR", "grossAmount": 100})',
			},
			{
				displayName: 'Payment (JSON)',
				name: 'paymentJson',
				type: 'json',
				default: '{}',
				description: 'Payment object as JSON',
			},
			{
				displayName: 'Payment Terms (JSON)',
				name: 'paymentTermsJson',
				type: 'json',
				default: '{}',
				description: 'Payment terms object as JSON',
			},
			{
				displayName: 'Positions (JSON)',
				name: 'positionsJson',
				type: 'json',
				default: '[]',
				description: 'Positions array as JSON',
			},
			{
				displayName: 'Accounting (JSON)',
				name: 'accountingJson',
				type: 'json',
				default: '[]',
				description: 'Accounting array as JSON',
			},
			{
				displayName: 'Assigned Purchase Orders (JSON)',
				name: 'assignedPurchaseOrdersJson',
				type: 'json',
				default: '[]',
				description: 'Assigned purchase orders array as JSON',
			},
		],
	},

	// ----------------------------------
	//         liability:get / release / uploadDocument
	// ----------------------------------
	{
		displayName: 'Liability ID',
		name: 'liabilityId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['liability'],
				operation: ['get', 'release', 'uploadDocument'],
			},
		},
		description: 'The ID of the liability',
	},

	// ----------------------------------
	//         liability:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['liability'],
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
				resource: ['liability'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         liability:uploadDocument
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['liability'],
				operation: ['uploadDocument'],
			},
		},
		description: 'Name of the binary property containing the file to upload. In most cases the default "data" works when connected to a node that outputs binary data.',
	},
];
