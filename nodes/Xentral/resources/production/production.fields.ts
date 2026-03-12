import { INodeProperties } from 'n8n-workflow';

export const productionFields: INodeProperties[] = [
	// ----------------------------------
	//         production:create
	// ----------------------------------
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['production'],
				operation: ['create'],
			},
		},
		description: 'The ID of the product to produce',
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
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'The planned start date of the production',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'The planned end date of the production',
			},
			{
				displayName: 'Warehouse',
				name: 'warehouse',
				type: 'string',
				default: '',
				description: 'The warehouse for this production order',
			},
			{
				displayName: 'Internal Note',
				name: 'internalNote',
				type: 'string',
				default: '',
				description: 'Internal note for this production order',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Planned', value: 'planned' },
					{ name: 'In Progress', value: 'in_progress' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Cancelled', value: 'cancelled' },
				],
				default: 'planned',
				description: 'The initial status of the production order',
			},
		],
	},

	// ----------------------------------
	//         production:get / delete / release / start
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
				operation: ['get', 'delete', 'release', 'start'],
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

];
