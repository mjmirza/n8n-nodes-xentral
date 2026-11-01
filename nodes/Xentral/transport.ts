import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, sleep } from 'n8n-workflow';

// ---------- helpers ----------

export function normalizeUrl(raw: string): string {
	let url = raw.trim().replace(/\/+$/, '');
	// Enforce HTTPS: reject explicit http:// and auto-add https:// if missing
	if (/^http:\/\//i.test(url)) {
		throw new Error('HTTP is not allowed - only HTTPS connections are supported for security');
	}
	if (!/^https:\/\//i.test(url)) {
		url = `https://${url}`;
	}

	// SSRF protection: block internal/reserved IP ranges and localhost
	let hostname = '';
	try {
		hostname = new URL(url).hostname.toLowerCase();
	} catch {
		hostname = '';
	}
	if (!hostname) {
		throw new Error('Invalid Xentral instance URL. Please check the format (e.g. https://yourcompany.xentral.com).');
	}
	if (
		hostname === 'localhost' ||
		hostname === '0.0.0.0' ||
		hostname === '0' ||
		/^127\./.test(hostname) ||
		/^10\./.test(hostname) ||
		/^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
		/^192\.168\./.test(hostname) ||
		/^169\.254\./.test(hostname) ||
		/^0+\./.test(hostname) ||
		hostname === '::1' ||
		hostname.startsWith('[') ||
		/^fc00:/i.test(hostname) ||
		/^fe80:/i.test(hostname) ||
		/^::ffff:/i.test(hostname)
	) {
		throw new Error('Connections to internal or reserved network addresses are not allowed');
	}

	return url;
}

function getBaseUrl(instanceUrl: string, apiVersion: string): string {
	const base = normalizeUrl(instanceUrl);
	return `${base}/api/${apiVersion}`;
}

async function getCredentials(ctx: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions) {
	return ctx.getCredentials('xentralApi');
}

/**
 * Normalize a Xentral API token. Must match the credential's authenticate expression.
 * Strips quotes, a pasted "Bearer " prefix and whitespace. A Sanctum "<id>|<hash>" token
 * is kept whole, Xentral accepts it. Leading digits are only removed when exactly a
 * 40-character Sanctum hash remains, so a valid bare token that starts with a digit is untouched.
 */
export function normalizeToken(raw: string): string {
	let token = raw.trim();
	token = token.replace(/^["'`]+|["'`]+$/g, '');
	token = token.replace(/^Bearer\s+/i, '');
	token = token.replace(/\s/g, '');
	token = token.replace(/^\d{1,4}(?=[A-Za-z0-9]{40}$)/, '');
	return token;
}

function handleXentralError(
	node: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	error: any,
): never {
	if (error.response?.body) {
		let errorBody: any;
		try {
			errorBody = typeof error.response.body === 'string'
				? JSON.parse(error.response.body)
				: error.response.body;
		} catch {
			errorBody = { detail: String(error.response.body) };
		}
		const message = parseXentralError(errorBody);
		const safeError: Record<string, any> = {
			message: error.message,
			statusCode: error.response?.statusCode || error.statusCode,
		};
		throw new NodeApiError(node.getNode(), safeError as JsonObject, { message });
	}
	const safeError: Record<string, any> = {
		message: error.message || 'Unknown error',
	};
	throw new NodeApiError(node.getNode(), safeError as JsonObject);
}

function parseXentralError(responseBody: any): string {
	if (!responseBody) return 'Unknown Xentral API error';
	if (typeof responseBody === 'string') return responseBody;
	const parts: string[] = [];
	if (responseBody.title) parts.push(responseBody.title);
	if (responseBody.detail) parts.push(responseBody.detail);
	if (responseBody.message && !responseBody.title) parts.push(responseBody.message);
	if (responseBody.error) parts.push(String(responseBody.error));
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
	if (responseBody.errors) {
		const e = responseBody.errors;
		if (Array.isArray(e)) {
			parts.push(...e.map(String));
		} else if (typeof e === 'object') {
			for (const [key, msgs] of Object.entries(e)) {
				const msgStr = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
				parts.push(`${key}: ${msgStr}`);
			}
		}
	}
	if (responseBody.messages && Array.isArray(responseBody.messages)) {
		parts.push(...responseBody.messages.map(String));
	}
	return parts.length > 0 ? parts.join(' | ') : JSON.stringify(responseBody);
}

// ---------- ID sanitization ----------

export function assertSafeId(id: string, paramName: string): void {
	if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
		throw new Error(`Invalid ${paramName}: contains disallowed characters`);
	}
}

// ---------- input validation ----------

export function assertNonEmpty(value: string, fieldName: string): string {
	const trimmed = value.trim();
	if (!trimmed) {
		throw new Error(`${fieldName} is required and cannot be empty`);
	}
	return trimmed;
}

export function assertNonEmptyBody(body: IDataObject, operationName: string): void {
	if (Object.keys(body).length === 0) {
		throw new Error(`No fields provided for ${operationName}. Select at least one field to update.`);
	}
}

// ---------- endpoint sanitization ----------

function sanitizeEndpoint(endpoint: string): string {
	// Remove leading slashes and prevent path traversal
	let clean = endpoint.replace(/^\/+/, '');
	// Block path traversal attempts
	if (/\.\.[\\/]/.test(clean) || clean.includes('..')) {
		throw new Error('Invalid endpoint: path traversal is not allowed');
	}
	// Only allow safe URL characters in endpoint path segments (no query string chars)
	if (!/^[a-zA-Z0-9\-_/.[\]]+$/.test(clean)) {
		throw new Error('Invalid endpoint: contains disallowed characters');
	}
	return clean;
}

// ---------- core request ----------

export async function xentralRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject | IDataObject[] = {},
	query: IDataObject = {},
	apiVersion: string = 'v1',
	extraHeaders?: Record<string, string>,
): Promise<any> {
	const credentials = await getCredentials(this);
	const instanceUrl = credentials.instanceUrl as string;
	const accessToken = normalizeToken(credentials.accessToken as string || '');
	if (!accessToken) {
		throw new NodeApiError(this.getNode(), { message: 'No access token configured' } as JsonObject, { message: 'Xentral access token is empty. Please configure your credentials.' });
	}
	const safeEndpoint = sanitizeEndpoint(endpoint);

	const options: IHttpRequestOptions = {
		method,
		url: `${getBaseUrl(instanceUrl, apiVersion)}/${safeEndpoint}`,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...(extraHeaders ?? {}),
		},
		json: true,
		timeout: 30000,
	};

	if (Object.keys(query).length > 0) {
		options.qs = query;
	}

	if (['POST', 'PATCH', 'PUT'].includes(method) && body) {
		options.body = body;
	}

	// Read Location so a create that answers with an empty body still yields its new id.
	options.returnFullResponse = true;

	// Retries. Safe methods retry on 429, 502, 503 and 504. A write (POST, PATCH, PUT) may already
	// have been committed when a gateway fails, so it only retries on 429, where Xentral did not process it.
	const maxRetries = 3;
	const safeMethod = ['GET', 'HEAD', 'DELETE', 'OPTIONS'].includes(method);
	const retryableStatuses = safeMethod ? [429, 502, 503, 504] : [429];
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			const response = await this.helpers.httpRequest(options);
			return unwrapResponse(method, response);
		} catch (error: any) {
			const statusCode = error.response?.statusCode || error.statusCode;
			if (retryableStatuses.includes(statusCode) && attempt < maxRetries) {
				const retryAfter = error.response?.headers?.['retry-after'];
				const parsed = retryAfter ? parseInt(retryAfter, 10) : NaN;
				const baseMs = Number.isFinite(parsed)
					? Math.min(parsed * 1000, 30000)
					: Math.min(1000 * Math.pow(2, attempt), 10000);
				const jitter = Math.floor(Math.random() * baseMs * 0.25);
				await sleep(baseMs + jitter);
				continue;
			}
			handleXentralError(this, error);
		}
	}
}

function isFullResponse(response: any): boolean {
	return (
		response !== null &&
		typeof response === 'object' &&
		'body' in response &&
		'headers' in response &&
		('statusCode' in response || 'status' in response)
	);
}

/** Returns the body. For a create with an empty body, returns the id from the Location header. */
export function unwrapResponse(method: string, response: any): any {
	if (!isFullResponse(response)) return response;
	const body = response.body;
	const empty = body === undefined || body === null || body === '' || (typeof body === 'object' && Object.keys(body).length === 0);
	if (method === 'POST' && empty) {
		const location = response.headers?.location ?? response.headers?.Location;
		if (typeof location === 'string' && location) {
			const id = location.split('?')[0].replace(/\/+$/, '').split('/').pop();
			return { success: true, id, location };
		}
	}
	return body;
}

// ---------- V1 cursor pagination (customers) ----------

export async function xentralV1CursorGetAll(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	endpoint: string,
	query: IDataObject = {},
	limit?: number,
	maxPages?: number,
	apiVersion: string = 'v1',
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	const cursorSize = 50;
	let nextCursor: string | undefined;
	let iterations = 0;
	const maxIterations = maxPages && maxPages > 0 ? maxPages : 1000;

	do {
		const qs: IDataObject = {
			...query,
			'cursor[size]': cursorSize,
		};
		if (nextCursor) {
			qs['cursor[nextCursor]'] = nextCursor;
		}

		const response = await xentralRequest.call(this, 'GET', endpoint, {}, qs, apiVersion);
		const items = response.data || [];
		returnData.push(...items);

		// Stop if page returned no items (empty result set or end of data)
		if (items.length === 0) break;

		nextCursor = response?.extra?.cursor?.nextCursor;
		iterations++;

		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}
	} while (nextCursor && iterations < maxIterations);

	if (nextCursor && iterations >= maxIterations) {
		throw new NodeApiError(
			this.getNode(),
			{ message: 'Pagination limit reached' } as JsonObject,
			{ message: `Results truncated at ${returnData.length} records. The API has more data available. Consider adding filters to reduce the result set.` },
		);
	}

	return limit ? returnData.slice(0, limit) : returnData;
}

// ---------- V1 page pagination (products) ----------

export async function xentralV1PageGetAll(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	endpoint: string,
	query: IDataObject = {},
	limit?: number,
	maxPages?: number,
	apiVersion: string = 'v1',
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	const pageSize = 150;
	let pageNumber = 1;
	let iterations = 0;
	const maxIterations = maxPages && maxPages > 0 ? maxPages : 1000;

	do {
		const qs: IDataObject = {
			...query,
			'page[number]': pageNumber,
			'page[size]': pageSize,
		};

		const response = await xentralRequest.call(this, 'GET', endpoint, {}, qs, apiVersion);
		const items = response.data || [];
		returnData.push(...items);

		// Stop if page returned fewer items than requested (last page or empty)
		if (items.length < pageSize) break;

		// Stop if API provides totalCount and we've reached it
		const totalCount = response?.extra?.totalCount;
		if (totalCount !== undefined && returnData.length >= totalCount) break;

		pageNumber++;
		iterations++;

		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}
	} while (iterations < maxIterations);

	if (iterations >= maxIterations) {
		throw new NodeApiError(
			this.getNode(),
			{ message: 'Pagination limit reached' } as JsonObject,
			{ message: `Results truncated at ${returnData.length} records. The API has more data available. Consider adding filters to reduce the result set.` },
		);
	}

	return limit ? returnData.slice(0, limit) : returnData;
}

// ---------- file attachments (JSON with base64 content) ----------

/**
 * Attaches an n8n binary to a Xentral document. The /files (v3) and /documents (v1) endpoints
 * take JSON with keyword, fileName and base64 fileContent, not multipart form data.
 */
export async function xentralFileUpload(
	this: IExecuteFunctions,
	endpoint: string,
	binaryPropertyName: string,
	itemIndex: number,
	apiVersion: string = 'v3',
	keyword: string = 'attachment',
	title?: string,
): Promise<any> {
	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const dataBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
	const body: IDataObject = {
		keyword,
		fileName: binaryData.fileName || 'file',
		fileContent: dataBuffer.toString('base64'),
	};
	if (title) body.title = title;
	return xentralRequest.call(this, 'POST', endpoint, body, {}, apiVersion);
}

// ---------- V3 page pagination (offers, invoices, etc) ----------

export async function xentralV3GetAll(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	endpoint: string,
	query: IDataObject = {},
	limit?: number,
	maxPages?: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	const perPage = 50;
	let page = 1;
	let iterations = 0;
	const maxIterations = maxPages && maxPages > 0 ? maxPages : 1000;

	do {
		const qs: IDataObject = {
			...query,
			page,
			perPage,
		};

		const response = await xentralRequest.call(this, 'GET', endpoint, {}, qs, 'v3');
		const items = response.data || [];
		returnData.push(...items);

		// Stop immediately if page returned no items
		if (items.length === 0) break;

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

	if (iterations >= maxIterations) {
		throw new NodeApiError(
			this.getNode(),
			{ message: 'Pagination limit reached' } as JsonObject,
			{ message: `Results truncated at ${returnData.length} records. The API has more data available. Consider adding filters to reduce the result set.` },
		);
	}

	return limit ? returnData.slice(0, limit) : returnData;
}
