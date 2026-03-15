import type { INodeProperties } from 'n8n-workflow';

export const shipmentFields: INodeProperties[] = [
	// ----------------------------------
	//         shipment:create
	// ----------------------------------
	{
		displayName: 'Delivery Note ID',
		name: 'deliveryNoteId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['shipment'],
				operation: ['create'],
			},
		},
		description: 'The ID of the delivery note this shipment belongs to',
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
				displayName: 'Parcel Count',
				name: 'parcelCount',
				type: 'number',
				default: 1,
				typeOptions: { minValue: 1 },
				description: 'The number of parcels in this shipment',
			},
			{
				displayName: 'Send Tracking Mail',
				name: 'sendTrackingMail',
				type: 'boolean',
				default: false,
				description: 'Whether to send a tracking email to the customer',
			},
			{
				displayName: 'Sent At',
				name: 'sentAt',
				type: 'dateTime',
				default: '',
				description: 'The date/time the shipment was sent',
			},
			{
				displayName: 'Shipping Method ID',
				name: 'shippingMethodId',
				type: 'string',
				default: '',
				description: 'The ID of the shipping method (nullable)',
			},
			{
				displayName: 'Tracking Link',
				name: 'trackingLink',
				type: 'string',
				default: '',
				description: 'Full URL for tracking the shipment',
			},
			{
				displayName: 'Tracking Number',
				name: 'trackingNumber',
				type: 'string',
				default: '',
				description: 'The carrier tracking number for this shipment',
			},
			{
				displayName: 'Update Delivery Note Shipping Method',
				name: 'updateDeliveryNoteShippingMethod',
				type: 'boolean',
				default: false,
				description: 'Whether to update the shipping method on the delivery note',
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
];
