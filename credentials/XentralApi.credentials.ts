import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class XentralApi implements ICredentialType {
	name = 'xentralApi';
	displayName = 'Xentral API';
	documentationUrl = 'https://developer.xentral.com/reference/authentication';

	icon: Icon = { light: 'file:xentral.svg', dark: 'file:xentral.dark.svg' };
	properties: INodeProperties[] = [
		{
			displayName: 'Instance URL',
			name: 'instanceUrl',
			type: 'string',
			default: '',
			placeholder: 'https://yourcompany.xentral.com',
			required: true,
			description: 'The URL of your Xentral instance (e.g. https://yourcompany.xentral.com)',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			placeholder: '2|wQ5SodU2fx0mSNWvpvV0uZVhA...',
			description: 'Paste your Personal Access Token exactly as shown in Xentral (Administration > Developer Settings). Both the full token (e.g. 2|abc...xyz) and just the key part work.',
		},
	];

	// Strips quotes, a pasted Bearer prefix, and whitespace. Xentral accepts both the full token and the key part.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization:
					'=Bearer {{ $credentials.accessToken.trim().replace(/^["\'`]+|["\'`]+$/g, "").replace(/^Bearer\\s+/i, "").replace(/\\s/g, "") }}',
				Accept: 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL:
				'={{ (/^https:\\/\\//i.test($credentials.instanceUrl.trim()) ? "" : "https://") + $credentials.instanceUrl.trim().replace(/\\/+$/, "") }}',
			url: '/api/v1/products',
			qs: { 'page[number]': 1, 'page[size]': 1 },
			method: 'GET',
		},
	};
}
