import { INodeProperties } from 'n8n-workflow';

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
		description: 'The ID of the supplier for this liability',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		default: 0,
		required: true,
		typeOptions: { numberPrecision: 2 },
		displayOptions: {
			show: {
				resource: ['liability'],
				operation: ['create'],
			},
		},
		description: 'The amount of the liability',
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
				displayName: 'Due Date',
				name: 'dueDate',
				type: 'dateTime',
				default: '',
				description: 'The due date of the liability',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the liability',
			},
			{
				displayName: 'Document Date',
				name: 'documentDate',
				type: 'dateTime',
				default: '',
				description: 'The document date of the liability',
			},
		],
	},

	// ----------------------------------
	//         liability:get / release
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
				operation: ['get', 'release'],
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
];
