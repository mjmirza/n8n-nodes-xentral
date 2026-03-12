import { INodeProperties } from 'n8n-workflow';

export const paymentMethodFields: INodeProperties[] = [
	// ----------------------------------
	//         paymentMethod:get
	// ----------------------------------
	{
		displayName: 'Payment Method ID',
		name: 'paymentMethodId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['paymentMethod'],
				operation: ['get'],
			},
		},
		description: 'The ID of the payment method',
	},

	// ----------------------------------
	//         paymentMethod:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['paymentMethod'],
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
				resource: ['paymentMethod'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
];
