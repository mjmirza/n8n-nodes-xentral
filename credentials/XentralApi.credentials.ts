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

	// Same rule as normalizeToken in transport.ts. Leading digits go only when exactly a 40 char key remains.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization:
					'=Bearer {{ $credentials.accessToken.trim().replace(/^["\'`]+|["\'`]+$/g, "").replace(/^Bearer\\s+/i, "").replace(/\\s/g, "").replace(/^\\d{1,4}(?=[A-Za-z0-9]{40}$)/, "") }}',
				Accept: 'application/json',
			},
		},
	};

	// Internal, loopback, link-local and private hosts map to an unroutable .invalid host, the same block list as normalizeUrl in transport.ts.
	test: ICredentialTestRequest = {
		request: {
			baseURL:
				'={{ (() => { const raw = $credentials.instanceUrl.trim().replace(/\\/+$/, ""); if (/^http:\\/\\//i.test(raw)) return "https://blocked.invalid"; const url = (/^https:\\/\\//i.test(raw) ? "" : "https://") + raw; const host = ((url.match(/^https:\\/\\/(?:[^@/]*@)?([^/:?#]+)/i) || [])[1] || "").toLowerCase(); const internal = !host || host === "localhost" || host === "0" || host === "0.0.0.0" || host.startsWith("[") || /^(127|10)\\./.test(host) || /^172\\.(1[6-9]|2\\d|3[01])\\./.test(host) || /^192\\.168\\./.test(host) || /^169\\.254\\./.test(host) || /^0+\\./.test(host); return internal ? "https://blocked.invalid" : url; })() }}',
			url: '/api/v1/products',
			qs: { 'page[number]': 1, 'page[size]': 1 },
			method: 'GET',
		},
	};
}
