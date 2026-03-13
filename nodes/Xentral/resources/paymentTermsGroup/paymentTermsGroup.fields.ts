import type { INodeProperties } from 'n8n-workflow';

export const paymentTermsGroupFields: INodeProperties[] = [
	// ----------------------------------
	//         paymentTermsGroup:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'paymentTermsGroupName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['paymentTermsGroup'],
				operation: ['create'],
			},
		},
		description: 'The name of the payment terms group',
	},
	{
		displayName: 'Key',
		name: 'paymentTermsGroupKey',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['paymentTermsGroup'],
				operation: ['create'],
			},
		},
		description: 'A unique key identifier for this payment terms group',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['paymentTermsGroup'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Days',
				name: 'days',
				type: 'number',
				default: 0,
				description: 'Number of days for payment',
			},
			{
				displayName: 'Discount Days',
				name: 'discountDays',
				type: 'number',
				default: 0,
				description: 'Number of days for early payment discount',
			},
			{
				displayName: 'Discount Percent',
				name: 'discountPercent',
				type: 'number',
				default: 0,
				typeOptions: { numberPrecision: 2 },
				description: 'Early payment discount percentage',
			},
		],
	},

	// ----------------------------------
	//         paymentTermsGroup:get
	// ----------------------------------
	{
		displayName: 'Payment Terms Group ID',
		name: 'paymentTermsGroupId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['paymentTermsGroup'],
				operation: ['get'],
			},
		},
		description: 'The ID of the payment terms group',
	},

	// ----------------------------------
	//         paymentTermsGroup:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['paymentTermsGroup'],
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
				resource: ['paymentTermsGroup'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
];
