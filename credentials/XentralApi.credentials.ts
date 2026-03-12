import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class XentralApi implements ICredentialType {
	name = 'xentralApi';
	displayName = 'Xentral API';
	documentationUrl = 'https://developer.xentral.com/reference/authentication';

	properties: INodeProperties[] = [
		{
			displayName: 'Instance URL',
			name: 'instanceUrl',
			type: 'string',
			default: '',
			placeholder: 'https://yourcompany.xentral.biz',
			description: 'The URL of your Xentral instance (e.g. https://yourcompany.xentral.biz)',
			required: true,
		},
		{
			displayName: 'Personal Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Personal Access Token from Xentral (Administration > Account Settings > Developer Settings)',
			required: true,
		},
		{
			displayName: 'API Version',
			name: 'apiVersion',
			type: 'options',
			options: [
				{
					name: 'V1 (Stable)',
					value: 'v1',
				},
				{
					name: 'V3 (Latest - requires feature flags)',
					value: 'v3',
				},
			],
			default: 'v1',
			description: 'The API version to use. V3 offers newer endpoints but requires feature flags enabled on your instance.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.accessToken}}',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.instanceUrl}}',
			url: '/api/v1/customers?cursor%5Bsize%5D=10',
			method: 'GET',
		},
	};
}
