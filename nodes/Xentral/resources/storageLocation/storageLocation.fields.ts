import type { INodeProperties } from 'n8n-workflow';

export const storageLocationFields: INodeProperties[] = [
	// ----------------------------------
	//         storageLocation: warehouseId (all operations)
	// ----------------------------------
	{
		displayName: 'Warehouse ID',
		name: 'warehouseId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['storageLocation'],
				operation: ['create', 'getAll', 'update', 'delete'],
			},
		},
		description: 'The ID of the warehouse that contains this storage location',
	},

	// ----------------------------------
	//         storageLocation:create
	// ----------------------------------
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
				displayName: 'ABC Category',
				name: 'abcCategory',
				type: 'options',
				options: [
					{ name: 'A', value: 'A' },
					{ name: 'B', value: 'B' },
					{ name: 'C', value: 'C' },
				],
				default: 'A',
				description: 'ABC classification category for this storage location',
			},
			{
				displayName: 'Address ID',
				name: 'addressId',
				type: 'string',
				default: '',
				description: 'The ID of the address associated with this storage location',
			},
			{
				displayName: 'Allows Production Access',
				name: 'allowsProductionAccess',
				type: 'boolean',
				default: false,
				description: 'Whether this location allows production access',
			},
			{
				displayName: 'Designation',
				name: 'designation',
				type: 'string',
				default: '',
				description: 'The designation (name) of the storage location',
			},
			{
				displayName: 'Dimension Height',
				name: 'dimensionHeight',
				type: 'number',
				default: 0,
				description: 'Height dimension of the storage location',
			},
			{
				displayName: 'Dimension Length',
				name: 'dimensionLength',
				type: 'number',
				default: 0,
				description: 'Length dimension of the storage location',
			},
			{
				displayName: 'Dimension Width',
				name: 'dimensionWidth',
				type: 'number',
				default: 0,
				description: 'Width dimension of the storage location',
			},
			{
				displayName: 'Is Consumption Location',
				name: 'isConsumptionLocation',
				type: 'boolean',
				default: false,
				description: 'Whether this is a consumption location',
			},
			{
				displayName: 'Is POS Location',
				name: 'isPosLocation',
				type: 'boolean',
				default: false,
				description: 'Whether this is a point-of-sale location',
			},
			{
				displayName: 'Is Replenishment Location',
				name: 'isReplenishmentLocation',
				type: 'boolean',
				default: false,
				description: 'Whether this is a replenishment location',
			},
			{
				displayName: 'Is Restricted Location',
				name: 'isRestrictedLocation',
				type: 'boolean',
				default: false,
				description: 'Whether this is a restricted location',
			},
			{
				displayName: 'Location Type',
				name: 'locationType',
				type: 'options',
				options: [
					{ name: 'Pallet', value: 'pallet' },
					{ name: 'Shelf', value: 'shelf' },
				],
				default: 'shelf',
				description: 'The type of storage location',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'number',
				default: 0,
				description: 'Sort order for this storage location',
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
				displayName: 'ABC Category',
				name: 'abcCategory',
				type: 'options',
				options: [
					{ name: 'A', value: 'A' },
					{ name: 'B', value: 'B' },
					{ name: 'C', value: 'C' },
				],
				default: 'A',
				description: 'ABC classification category for this storage location',
			},
			{
				displayName: 'Address ID',
				name: 'addressId',
				type: 'string',
				default: '',
				description: 'The ID of the address associated with this storage location',
			},
			{
				displayName: 'Allows Production Access',
				name: 'allowsProductionAccess',
				type: 'boolean',
				default: false,
				description: 'Whether this location allows production access',
			},
			{
				displayName: 'Designation',
				name: 'designation',
				type: 'string',
				default: '',
				description: 'The designation (name) of the storage location',
			},
			{
				displayName: 'Dimension Height',
				name: 'dimensionHeight',
				type: 'number',
				default: 0,
				description: 'Height dimension of the storage location',
			},
			{
				displayName: 'Dimension Length',
				name: 'dimensionLength',
				type: 'number',
				default: 0,
				description: 'Length dimension of the storage location',
			},
			{
				displayName: 'Dimension Width',
				name: 'dimensionWidth',
				type: 'number',
				default: 0,
				description: 'Width dimension of the storage location',
			},
			{
				displayName: 'Is Consumption Location',
				name: 'isConsumptionLocation',
				type: 'boolean',
				default: false,
				description: 'Whether this is a consumption location',
			},
			{
				displayName: 'Is POS Location',
				name: 'isPosLocation',
				type: 'boolean',
				default: false,
				description: 'Whether this is a point-of-sale location',
			},
			{
				displayName: 'Is Replenishment Location',
				name: 'isReplenishmentLocation',
				type: 'boolean',
				default: false,
				description: 'Whether this is a replenishment location',
			},
			{
				displayName: 'Is Restricted Location',
				name: 'isRestrictedLocation',
				type: 'boolean',
				default: false,
				description: 'Whether this is a restricted location',
			},
			{
				displayName: 'Location Type',
				name: 'locationType',
				type: 'options',
				options: [
					{ name: 'Pallet', value: 'pallet' },
					{ name: 'Shelf', value: 'shelf' },
				],
				default: 'shelf',
				description: 'The type of storage location',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'number',
				default: 0,
				description: 'Sort order for this storage location',
			},
		],
	},
];
