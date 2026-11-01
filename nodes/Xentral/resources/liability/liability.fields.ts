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
		description: 'The ID of the supplier for this liability. Sent to the API as the supplier reference.',
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
				displayName: 'Accounting (JSON)',
				name: 'accountingJson',
				type: 'json',
				default: '[]',
				description: 'Accounting details as JSON object',
			},
			{
				displayName: 'Assigned Purchase Orders (JSON)',
				name: 'assignedPurchaseOrdersJson',
				type: 'json',
				default: '[]',
				description: 'Assigned purchase order IDs as JSON array',
			},
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
				displayName: 'Financials (JSON)',
				name: 'financialsJson',
				type: 'json',
				default: '{}',
				description: 'Financial details as JSON. Example: {"currency": "EUR", "grossAmount": 119, "netAmount": 100, "taxAmount": 19}.',
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
				displayName: 'Payment (JSON)',
				name: 'paymentJson',
				type: 'json',
				default: '{}',
				description: 'Payment details as JSON object',
			},
			{
				displayName: 'Payment Terms (JSON)',
				name: 'paymentTermsJson',
				type: 'json',
				default: '{}',
				description: 'Payment terms as JSON object',
			},
			{
				displayName: 'Positions (JSON)',
				name: 'positionsJson',
				type: 'json',
				default: '[]',
				description: 'Line item positions as JSON array. Example: [{"description": "Item 1", "amount": {"net": 100}}].',
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
				],
				default: 'PENDING',
				description: 'Status of the liability. Xentral accepts open or paid, so Partially Paid is sent as open.',
			},
			{
				displayName: 'Supplier Invoice Number',
				name: 'supplierInvoiceNumber',
				type: 'string',
				default: '',
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
