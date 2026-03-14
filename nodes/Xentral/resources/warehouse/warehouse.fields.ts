import type { INodeProperties } from 'n8n-workflow';

export const warehouseFields: INodeProperties[] = [
	// ----------------------------------
	//         warehouse:create
	// ----------------------------------
	{
		displayName: 'Designation',
		name: 'designation',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['warehouse'],
				operation: ['create'],
			},
		},
		description: 'The designation (name) of the warehouse',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['warehouse'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Address ID',
				name: 'addressId',
				type: 'string',
				default: '',
				description: 'ID of the address to associate with this warehouse',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'ID of the project to associate with this warehouse',
			},
		],
	},

	// ----------------------------------
	//         warehouse:update / delete
	// ----------------------------------
	{
		displayName: 'Warehouse ID',
		name: 'warehouseId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['warehouse'],
				operation: ['update', 'delete'],
			},
		},
		description: 'The ID of the warehouse',
	},

	// ----------------------------------
	//         warehouse:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['warehouse'],
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
				resource: ['warehouse'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         warehouse:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['warehouse'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Address ID',
				name: 'addressId',
				type: 'string',
				default: '',
				description: 'ID of the address to associate with this warehouse',
			},
			{
				displayName: 'Designation',
				name: 'designation',
				type: 'string',
				default: '',
				description: 'The designation (name) of the warehouse',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'ID of the project to associate with this warehouse',
			},
		],
	},
];
