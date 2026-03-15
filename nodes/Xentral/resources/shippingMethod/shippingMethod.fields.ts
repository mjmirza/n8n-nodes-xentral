import type { INodeProperties } from 'n8n-workflow';

export const shippingMethodFields: INodeProperties[] = [
	// ----------------------------------
	//         shippingMethod:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
				operation: ['create'],
			},
		},
		description: 'The name of the shipping method',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Carrier Credentials (JSON)',
				name: 'carrierCredentials',
				type: 'json',
				default: '{}',
				description: 'Carrier credentials as JSON object',
			},
			{
				displayName: 'Carrier Extra Field 1',
				name: 'carrierExtraField1',
				type: 'string',
				default: '',
				description: 'Carrier extra field 1',
			},
			{
				displayName: 'Carrier Extra Field 2',
				name: 'carrierExtraField2',
				type: 'string',
				default: '',
				description: 'Carrier extra field 2',
			},
			{
				displayName: 'Carrier ID',
				name: 'carrierId',
				type: 'string',
				default: '',
				description: 'ID of the carrier',
			},
			{
				displayName: 'Carrier Product ID',
				name: 'carrierProductId',
				type: 'string',
				default: '',
				description: 'ID of the carrier product',
			},
			{
				displayName: 'Carrier Service URL',
				name: 'carrierServiceUrl',
				type: 'string',
				default: '',
				description: 'Service URL for the carrier',
			},
			{
				displayName: 'Carrier Shipment Type',
				name: 'carrierShipmentType',
				type: 'string',
				default: '',
				description: 'Shipment type for the carrier',
			},
			{
				displayName: 'Is Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether the shipping method is active',
			},
			{
				displayName: 'Parcel (JSON)',
				name: 'parcel',
				type: 'json',
				default: '{}',
				description: 'Parcel configuration as JSON object',
			},
			{
				displayName: 'Printers (JSON)',
				name: 'printers',
				type: 'json',
				default: '{}',
				description: 'Printer configuration as JSON object',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'ID of the project to associate (nullable)',
			},
			{
				displayName: 'Sender (JSON)',
				name: 'sender',
				type: 'json',
				default: '{}',
				description: 'Sender address configuration as JSON object',
			},
		],
	},

	// ----------------------------------
	//         shippingMethod:get / update
	// ----------------------------------
	{
		displayName: 'Shipping Method ID',
		name: 'shippingMethodId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
				operation: ['get', 'update'],
			},
		},
		description: 'The ID of the shipping method',
	},

	// ----------------------------------
	//         shippingMethod:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
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
				resource: ['shippingMethod'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         shippingMethod:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Carrier Credentials (JSON)',
				name: 'carrierCredentials',
				type: 'json',
				default: '{}',
				description: 'Carrier credentials as JSON object',
			},
			{
				displayName: 'Carrier Extra Field 1',
				name: 'carrierExtraField1',
				type: 'string',
				default: '',
				description: 'Carrier extra field 1',
			},
			{
				displayName: 'Carrier Extra Field 2',
				name: 'carrierExtraField2',
				type: 'string',
				default: '',
				description: 'Carrier extra field 2',
			},
			{
				displayName: 'Carrier ID',
				name: 'carrierId',
				type: 'string',
				default: '',
				description: 'ID of the carrier',
			},
			{
				displayName: 'Carrier Product ID',
				name: 'carrierProductId',
				type: 'string',
				default: '',
				description: 'ID of the carrier product',
			},
			{
				displayName: 'Carrier Service URL',
				name: 'carrierServiceUrl',
				type: 'string',
				default: '',
				description: 'Service URL for the carrier',
			},
			{
				displayName: 'Carrier Shipment Type',
				name: 'carrierShipmentType',
				type: 'string',
				default: '',
				description: 'Shipment type for the carrier',
			},
			{
				displayName: 'Is Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether the shipping method is active',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The name of the shipping method',
			},
			{
				displayName: 'Parcel (JSON)',
				name: 'parcel',
				type: 'json',
				default: '{}',
				description: 'Parcel configuration as JSON object',
			},
			{
				displayName: 'Printers (JSON)',
				name: 'printers',
				type: 'json',
				default: '{}',
				description: 'Printer configuration as JSON object',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'ID of the project to associate (nullable)',
			},
			{
				displayName: 'Sender (JSON)',
				name: 'sender',
				type: 'json',
				default: '{}',
				description: 'Sender address configuration as JSON object',
			},
		],
	},
];
