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

	// Internal hosts map to an unroutable .invalid host. Same canonical rules as isBlockedHost in transport.ts:
	// decimal, hex, octal and short IPv4 forms, trailing dots, IPv6 literals and *.localhost are blocked.
	test: ICredentialTestRequest = {
		request: {
			baseURL:
				'={{ (() => { const raw = $credentials.instanceUrl.trim().replace(/\\/+$/, ""); if (/[@\\s\\\\]/.test(raw)) return "https://blocked.invalid"; if (/^http:\\/\\//i.test(raw)) return "https://blocked.invalid"; const url = (/^https:\\/\\//i.test(raw) ? "" : "https://") + raw; const m = url.match(/^https:\\/\\/(?:[^@\\/]*@)?(\\[[^\\]]*\\]|[^\\/:?#]+)/i); const host = ((m || [])[1] || "").toLowerCase().replace(/\\.+$/, ""); const parts = host.split("."); let ip; if (parts.length <= 4 && parts.every((p) => /^(0x[0-9a-f]*|[0-9]+)$/i.test(p))) { const n = parts.map((p) => (/^0x/i.test(p) ? (p.length === 2 ? 0 : parseInt(p.slice(2), 16)) : /^0[0-9]+$/.test(p) ? (/^0[0-7]+$/.test(p) ? parseInt(p, 8) : NaN) : parseInt(p, 10))); const last = n.pop(); ip = n.some((x) => !(x <= 255)) || !(last < Math.pow(256, 4 - n.length)) ? NaN : n.reduce((acc, x, i) => acc + x * Math.pow(256, 3 - i), 0) + last; } const a = Math.floor(ip / 16777216); const b = Math.floor(ip / 65536) % 256; const internal = !host || /[^a-z0-9._-]/.test(host) || host === "localhost" || host.endsWith(".localhost") || host.startsWith("[") || host.includes(":") || (ip !== undefined && (Number.isNaN(ip) || a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127))); return internal ? "https://blocked.invalid" : url; })() }}',
			url: '/api/v1/products',
			qs: { 'page[number]': 1, 'page[size]': 1 },
			method: 'GET',
			// A redirect could carry the token to plain http or an internal host, so it is never followed.
			disableFollowRedirect: true,
			maxRedirects: 0,
		},
	};
}
