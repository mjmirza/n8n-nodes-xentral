import type { INodeProperties } from 'n8n-workflow';

export const shipmentFields: INodeProperties[] = [
	// ----------------------------------
	//         shipment:create
	// ----------------------------------
	{
		displayName: 'Shipment Type',
		name: 'shipmentType',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		description: 'The shipment type (must match a type configured in your Xentral instance)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Sales Order ID',
				name: 'salesOrderId',
				type: 'string',
				default: '',
				description: 'The ID of the related sales order',
			},
			{
				displayName: 'Carrier',
				name: 'carrier',
				type: 'string',
				default: '',
				description: 'The carrier/shipping provider (e.g. DHL, DPD)',
			},
			{
				displayName: 'Tracking Number',
				name: 'trackingNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Weight',
				name: 'weight',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'The weight in kg',
			},
		],
	},

	// ----------------------------------
	//         shipment:get
	// ----------------------------------
	{
		displayName: 'Shipment ID',
		name: 'shipmentId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['get'],
			},
		},
		description: 'The ID of the shipment',
	},

	// ----------------------------------
	//         shipment:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['shipment'],
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
				resource: ['shipment'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
];
