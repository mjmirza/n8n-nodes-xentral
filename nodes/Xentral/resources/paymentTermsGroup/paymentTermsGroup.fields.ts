import type { INodeProperties } from 'n8n-workflow';

export const paymentTermsGroupFields: INodeProperties[] = [
	// ----------------------------------
	//         paymentTermsGroup:create
	// ----------------------------------
	{
		displayName: 'Key',
		name: 'key',
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
		displayName: 'Name',
		name: 'name',
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
				displayName: 'Category (JSON)',
				name: 'category',
				type: 'json',
				default: '{}',
				description: 'Category object for this payment terms group',
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				description: 'A comment or note for this payment terms group',
			},
			{
				displayName: 'Is Active',
				name: 'isActive',
				type: 'boolean',
				default: true,
				description: 'Whether this payment terms group is active',
			},
			{
				displayName: 'Payment Terms (JSON)',
				name: 'paymentTerms',
				type: 'json',
				default: '{}',
				description: 'Payment terms configuration as JSON object',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'ID of the project to associate with this payment terms group',
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
