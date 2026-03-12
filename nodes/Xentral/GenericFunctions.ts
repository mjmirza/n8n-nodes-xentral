import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

/**
 * Make an authenticated API request to Xentral
 */
export async function xentralApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
	apiVersion?: string,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('xentralApi');
	const instanceUrl = (credentials.instanceUrl as string).replace(/\/$/, '');
	const version = apiVersion || (credentials.apiVersion as string) || 'v1';

	const options: IHttpRequestOptions = {
		method,
		url: `${instanceUrl}/api/${version}${endpoint}`,
		headers: {
			Authorization: `Bearer ${credentials.accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		qs: query,
		json: true,
	};

	if (Object.keys(body).length > 0 && method !== 'GET') {
		options.body = body;
	}

	try {
		const response = await this.helpers.httpRequest(options);
		return response as IDataObject;
	} catch (error: unknown) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an API request and return all results (handles pagination)
 */
export async function xentralApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
	apiVersion?: string,
): Promise<IDataObject[]> {
	const allItems: IDataObject[] = [];
	let page = 1;
	const perPage = 100;

	query.per_page = perPage;

	let hasMorePages = true;
	while (hasMorePages) {
		query.page = page;

		const response = await xentralApiRequest.call(
			this,
			method,
			endpoint,
			body,
			query,
			apiVersion,
		);

		const data = (response.data as IDataObject[]) || [];
		allItems.push(...data);

		// Check if there are more pages
		const meta = response.meta as IDataObject | undefined;
		const extra = response.extra as IDataObject | undefined;

		if (meta && typeof meta.totalResults === 'number') {
			hasMorePages = allItems.length < meta.totalResults;
		} else if (extra && extra.pagination) {
			const pagination = extra.pagination as IDataObject;
			hasMorePages = !!pagination.next;
		} else {
			hasMorePages = data.length === perPage;
		}

		page++;

		// Safety limit
		if (page > 100) break;
	}

	return allItems;
}

/**
 * Make a V3 API request (convenience wrapper)
 */
export async function xentralApiRequestV3(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
): Promise<IDataObject> {
	return xentralApiRequest.call(this, method, endpoint, body, query, 'v3');
}

/**
 * Parse Xentral RFC 9457 Problem Details error response
 */
function parseXentralError(error: unknown): string {
	if (error && typeof error === 'object') {
		const err = error as Record<string, unknown>;

		// RFC 9457 Problem Details format
		if (err.title) {
			let message = err.title as string;

			if (err.violations && Array.isArray(err.violations)) {
				const details = (err.violations as Array<Record<string, string>>)
					.map((v) => `${v.propertyPath}: ${v.message}`)
					.join('; ');
				message += ` - ${details}`;
			}

			if (err.messages && Array.isArray(err.messages)) {
				message += ` - ${(err.messages as string[]).join('; ')}`;
			}

			return message;
		}

		// Generic error
		if (err.message) {
			return err.message as string;
		}
	}

	return 'An unknown error occurred while communicating with Xentral';
}
