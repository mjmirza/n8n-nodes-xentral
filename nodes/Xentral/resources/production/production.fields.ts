import type { INodeProperties } from 'n8n-workflow';

export const productionFields: INodeProperties[] = [
	// ----------------------------------
	//         production:create
	// ----------------------------------
	{
		displayName: 'Address ID',
		name: 'addressId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['production'],
				operation: ['create'],
			},
		},
		description: 'The ID of the address for the production order',
	},
	{
		displayName: 'Language',
		name: 'language',
		type: 'string',
		default: 'de',
		required: true,
		displayOptions: {
			show: {
				resource: ['production'],
				operation: ['create'],
			},
		},
		description: 'Language code for the production order (e.g. de, en)',
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
				displayName: 'Internal Note',
				name: 'internalNote',
				type: 'string',
				default: '',
				description: 'Internal note for this production order',
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
