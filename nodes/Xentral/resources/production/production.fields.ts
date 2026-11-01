import type { INodeProperties } from 'n8n-workflow';

export const productionFields: INodeProperties[] = [
	// ----------------------------------
	//         production:create
	// ----------------------------------
	{
		displayName: 'Product ID (to Produce)',
		name: 'produceProductId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['production'],
				operation: ['create'],
			},
		},
		description: 'The ID of the product to produce. Sent to the API as the produced product reference.',
	},
	{
		displayName: 'Quantity (to Produce)',
		name: 'produceQuantity',
		type: 'number',
		default: 1,
		required: true,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				resource: ['production'],
				operation: ['create'],
			},
		},
		description: 'The quantity to produce',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['production'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Address ID',
				name: 'addressId',
				type: 'string',
				default: '',
				description: 'The ID of the address for the production order',
			},
			{
				displayName: 'Body Text',
				name: 'bodyText',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Body text for the production order',
			},
			{
				displayName: 'Create Serial Numbers',
				name: 'createSerialNumbers',
				type: 'boolean',
				default: false,
				description: 'Whether to create serial numbers for produced items',
			},
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'string',
				default: '',
				description: 'The document date (ISO 8601 date string)',
			},
			{
				displayName: 'Function Test',
				name: 'functionTest',
				type: 'boolean',
				default: false,
				description: 'Whether to perform a function test',
			},
			{
				displayName: 'Internal Comment',
				name: 'internalComment',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Internal comment for this production order',
			},
			{
				displayName: 'Internal Designation',
				name: 'internalDesignation',
				type: 'string',
				default: '',
				description: 'Internal designation for the production order',
			},
			{
				displayName: 'Material Reservation',
				name: 'materialReservation',
				type: 'string',
				default: '',
				description: 'Material reservation setting',
			},
			{
				displayName: 'Material Retrieval',
				name: 'materialRetrieval',
				type: 'string',
				default: '',
				description: 'Material retrieval setting',
			},
			{
				displayName: 'Preferred Warehouse ID',
				name: 'preferredWarehouseId',
				type: 'string',
				default: '',
				description: 'ID of the preferred warehouse',
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
								displayName: 'Show Task Description',
								name: 'showTaskDescription',
								type: 'boolean',
								default: false,
								description: 'Whether to show the task description on the production order',
							},
						],
					},
				],
				description: 'Print settings for the document',
			},
			{
				displayName: 'Production End Date',
				name: 'productionEndDate',
				type: 'string',
				default: '',
				description: 'The planned end date of the production (ISO 8601)',
			},
			{
				displayName: 'Production Start Date',
				name: 'productionStartDate',
				type: 'string',
				default: '',
				description: 'The planned start date of the production (ISO 8601)',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'ID of the associated project',
			},
			{
				displayName: 'Record Sub-Serial Numbers',
				name: 'recordSubSerialNumbers',
				type: 'boolean',
				default: false,
				description: 'Whether to record sub-serial numbers',
			},
			{
				displayName: 'Resolve Multi-Level BOM',
				name: 'resolveMultiLevelBOM',
				type: 'boolean',
				default: false,
				description: 'Whether to resolve the bill of materials to multiple levels',
			},
			{
				displayName: 'Sales Order ID',
				name: 'salesOrderId',
				type: 'string',
				default: '',
				description: 'ID of the related sales order',
			},
			{
				displayName: 'Stock Provisioning Date',
				name: 'stockProvisioningDate',
				type: 'string',
				default: '',
				description: 'Date for stock provisioning (ISO 8601)',
			},
			{
				displayName: 'Stock Retrieval Date',
				name: 'stockRetrievalDate',
				type: 'string',
				default: '',
				description: 'Date for stock retrieval (ISO 8601)',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tags',
			},
		],
	},

	// ----------------------------------
	//         production:get / delete / release / start / logActivity / attachFile
	// ----------------------------------
	{
		displayName: 'Production ID',
		name: 'productionId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['production'],
				operation: ['get', 'delete', 'release', 'start', 'logActivity', 'attachFile'],
			},
		},
		description: 'The ID of the production order',
	},

	// ----------------------------------
	//         production:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['production'],
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
				resource: ['production'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         production:attachFile
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['production'],
				operation: ['attachFile'],
			},
		},
		description: 'Name of the binary property containing the file to upload. In most cases the default "data" works when connected to a node that outputs binary data (e.g. Email Trigger, HTTP Request, Read Binary File).',
	},

	// ----------------------------------
	//         production:logActivity
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
				resource: ['production'],
			},
		},
	},
];
