import type { INodeProperties } from 'n8n-workflow';

export const customApiCallOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['customApiCall'] } },
		options: [
			{
				name: 'Make an API Call',
				value: 'request',
				description: 'Call any Xentral API endpoint with your saved credential',
				action: 'Make an API call',
			},
		],
		default: 'request',
	},
];

const show = { show: { resource: ['customApiCall'], operation: ['request'] } };

export const customApiCallFields: INodeProperties[] = [
	{
		displayName: 'Method',
		name: 'method',
		type: 'options',
		options: [
			{ name: 'DELETE', value: 'DELETE' },
			{ name: 'GET', value: 'GET' },
			{ name: 'PATCH', value: 'PATCH' },
			{ name: 'POST', value: 'POST' },
			{ name: 'PUT', value: 'PUT' },
		],
		default: 'GET',
		displayOptions: show,
		description: 'HTTP method of the Xentral endpoint',
	},
	{
		displayName: 'API Version',
		name: 'apiVersion',
		type: 'options',
		options: [
			{ name: 'V1', value: 'v1' },
			{ name: 'V2', value: 'v2' },
			{ name: 'V3', value: 'v3' },
		],
		default: 'v1',
		displayOptions: show,
		description: 'API version of the endpoint. A path that starts with /api/v2/ or similar overrides this.',
	},
	{
		displayName: 'Path',
		name: 'path',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'analytics/report',
		displayOptions: show,
		description: 'Path after /api/{version}/, for example posJournals or /api/v3/supplierInvoices',
	},
	{
		displayName: 'Query Parameters',
		name: 'queryParameters',
		type: 'json',
		default: '{}',
		displayOptions: show,
		description: 'Query parameters as JSON, for example {"filter[0][key]":"name","filter[0][op]":"contains","filter[0][value]":"Acme"}',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'json',
		default: '{}',
		displayOptions: { show: { resource: ['customApiCall'], operation: ['request'], method: ['PATCH', 'POST', 'PUT'] } },
		description: 'JSON request body',
	},
	{
		displayName: 'Content Type',
		name: 'contentType',
		type: 'string',
		default: 'application/json',
		displayOptions: show,
		description: 'Content-Type header. Some Xentral endpoints need a vendor type such as application/vnd.xentral.minimal+JSON.',
	},
];
