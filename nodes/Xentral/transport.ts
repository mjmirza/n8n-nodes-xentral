import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

// ---------- helpers ----------

function getBaseUrl(instanceUrl: string, apiVersion: string): string {
	const base = instanceUrl.replace(/\/+$/, '');
	return `${base}/api/${apiVersion}`;
}

async function getCredentials(ctx: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions) {
	return ctx.getCredentials('xentralApi');
}

function parseXentralError(responseBody: any): string {
	if (!responseBody) return 'Unknown Xentral API error';
	const parts: string[] = [];
	if (responseBody.title) parts.push(responseBody.title);
	if (responseBody.detail) parts.push(responseBody.detail);
	if (responseBody.violations) {
		const v = responseBody.violations;
		if (typeof v === 'object') {
			for (const [key, msgs] of Object.entries(v)) {
				if (Array.isArray(msgs)) {
					for (const msg of msgs) {
						parts.push(key === '_' ? String(msg) : `${key}: ${msg}`);
					}
				}
			}
		}
	}
	if (responseBody.messages && Array.isArray(responseBody.messages)) {
		parts.push(...responseBody.messages.map(String));
	}
	return parts.length > 0 ? parts.join(' | ') : JSON.stringify(responseBody);
}

// ---------- core request ----------

export async function xentralRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | IDataObject[] = {},
	query: IDataObject = {},
	apiVersion: string = 'v1',
): Promise<any> {
	const credentials = await getCredentials(this);
	const instanceUrl = credentials.instanceUrl as string;
	const accessToken = credentials.accessToken as string;

	const options: IHttpRequestOptions = {
		method,
		url: `${getBaseUrl(instanceUrl, apiVersion)}/${endpoint.replace(/^\/+/, '')}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		json: true,
	};

	if (Object.keys(query).length > 0) {
		options.qs = query;
	}

	if (['POST', 'PATCH', 'PUT'].includes(method) && body) {
		options.body = body;
	}

	try {
		const response = await this.helpers.httpRequest(options);
		return response;
	} catch (error: any) {
		// Try to parse Xentral's RFC 9457 error format
		if (error.response?.body) {
			const errorBody = typeof error.response.body === 'string'
				? JSON.parse(error.response.body)
				: error.response.body;
			const message = parseXentralError(errorBody);
			throw new NodeApiError(this.getNode(), error as JsonObject, { message });
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

// ---------- V1 cursor pagination (customers) ----------

export async function xentralV1CursorGetAll(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	endpoint: string,
	query: IDataObject = {},
	limit?: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	const cursorSize = 250;
	let nextCursor: string | undefined;
	let iterations = 0;
	const maxIterations = 100;

	do {
		const qs: IDataObject = {
			...query,
			'cursor[size]': cursorSize,
		};
		if (nextCursor) {
			qs['cursor[nextCursor]'] = nextCursor;
		}

		const response = await xentralRequest.call(this, 'GET', endpoint, {}, qs, 'v1');
		const items = response.data || [];
		returnData.push(...items);

		nextCursor = response?.extra?.cursor?.nextCursor;
		iterations++;

		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}
	} while (nextCursor && iterations < maxIterations);

	return limit ? returnData.slice(0, limit) : returnData;
}

// ---------- V1 page pagination (products) ----------

export async function xentralV1PageGetAll(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	endpoint: string,
	query: IDataObject = {},
	limit?: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	const pageSize = 250;
	let pageNumber = 1;
	let totalCount = Infinity;
	let iterations = 0;
	const maxIterations = 100;

	do {
		const qs: IDataObject = {
			...query,
			'page[number]': pageNumber,
			'page[size]': pageSize,
		};

		const response = await xentralRequest.call(this, 'GET', endpoint, {}, qs, 'v1');
		const items = response.data || [];
		returnData.push(...items);

		totalCount = response?.extra?.totalCount ?? 0;
		pageNumber++;
		iterations++;

		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}
	} while (returnData.length < totalCount && iterations < maxIterations);

	return limit ? returnData.slice(0, limit) : returnData;
}

// ---------- V3 page pagination (offers, invoices, etc) ----------

export async function xentralV3GetAll(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	endpoint: string,
	query: IDataObject = {},
	limit?: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	const perPage = 50;
	let page = 1;
	let iterations = 0;
	const maxIterations = 100;

	do {
		const qs: IDataObject = {
			...query,
			page,
			perPage,
		};

		const response = await xentralRequest.call(this, 'GET', endpoint, {}, qs, 'v3');
		const items = response.data || [];
		returnData.push(...items);

		const hasNext = response?.links?.next != null;
		const meta = response?.meta || {};
		const lastPage = meta.lastPage;

		if (!hasNext && lastPage && page >= lastPage) break;
		if (!hasNext && items.length < perPage) break;

		page++;
		iterations++;

		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}
	} while (iterations < maxIterations);

	return limit ? returnData.slice(0, limit) : returnData;
}
