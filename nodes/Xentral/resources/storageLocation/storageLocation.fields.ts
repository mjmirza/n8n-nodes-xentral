import { INodeProperties } from 'n8n-workflow';

export const storageLocationFields: INodeProperties[] = [
	// ----------------------------------
	//         storageLocation:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'storageLocationName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['storageLocation'],
				operation: ['create'],
			},
		},
		description: 'The name of the storage location',
	},
	{
		displayName: 'Warehouse ID',
		name: 'warehouseId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['storageLocation'],
				operation: ['create'],
			},
		},
		description: 'The ID of the warehouse this storage location belongs to',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['storageLocation'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the storage location',
			},
			{
				displayName: 'Aisle',
				name: 'aisle',
				type: 'string',
				default: '',
				description: 'The aisle identifier',
			},
			{
				displayName: 'Shelf',
				name: 'shelf',
				type: 'string',
				default: '',
				description: 'The shelf identifier',
			},
			{
				displayName: 'Level',
				name: 'level',
				type: 'string',
				default: '',
				description: 'The level identifier',
			},
		],
	},

	// ----------------------------------
	//         storageLocation:update / delete
	// ----------------------------------
	{
		displayName: 'Storage Location ID',
		name: 'storageLocationId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['storageLocation'],
				operation: ['update', 'delete'],
			},
		},
		description: 'The ID of the storage location',
	},

	// ----------------------------------
	//         storageLocation:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['storageLocation'],
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
				resource: ['storageLocation'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         storageLocation:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['storageLocation'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'storageLocationName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Warehouse ID',
				name: 'warehouseId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Aisle',
				name: 'aisle',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Shelf',
				name: 'shelf',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Level',
				name: 'level',
				type: 'string',
				default: '',
			},
		],
	},
];
