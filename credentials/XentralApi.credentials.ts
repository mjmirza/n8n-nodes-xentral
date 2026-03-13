import type {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class XentralApi implements ICredentialType {
	name = 'xentralApi';
	displayName = 'Xentral API';
	documentationUrl = 'https://developer.xentral.com/docs';
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
}
