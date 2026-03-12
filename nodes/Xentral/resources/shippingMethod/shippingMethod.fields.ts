import { INodeProperties } from 'n8n-workflow';

export const shippingMethodFields: INodeProperties[] = [
	// ----------------------------------
	//         shippingMethod:get
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
				operation: ['get'],
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
];
