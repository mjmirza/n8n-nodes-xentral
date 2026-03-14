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

function normalizeUrl(raw: string): string {
	let url = raw.trim().replace(/\/+$/, '');
	// Enforce HTTPS: reject explicit http:// and auto-add https:// if missing
	if (/^http:\/\//i.test(url)) {
		throw new Error('HTTP is not allowed - only HTTPS connections are supported for security');
	}
	if (!/^https:\/\//i.test(url)) {
		url = `https://${url}`;
	}

	// SSRF protection: block internal/reserved IP ranges and localhost
	try {
		const parsed = new URL(url);
		const hostname = parsed.hostname.toLowerCase();
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
	} catch (e: any) {
		if (e.message.includes('not allowed')) throw e;
		throw new Error('Invalid Xentral instance URL. Please check the format (e.g. https://yourcompany.xentral.com).');
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
 * Normalize a Xentral API token for maximum compatibility.
 * Xentral PATs use the Laravel Sanctum format: "<id>|<hash>" (e.g. "2|wQ5So...").
 * Users may paste the full token, just the hash, or include accidental extras.
 * This function handles all variations so users never have to manually edit the token.
 */
function normalizeToken(raw: string): string {
	let token = raw.trim();
	// Remove surrounding quotes (copy-paste from docs or JSON)
	token = token.replace(/^["'`]+|["'`]+$/g, '');
	// Strip accidental "Bearer " prefix (copy-paste from curl/docs)
	token = token.replace(/^Bearer\s+/i, '');
	// Remove all whitespace (spaces, newlines, tabs from copy-paste)
	token = token.replace(/\s/g, '');
	// Strip Laravel Sanctum "<id>|<hash>" prefix
	// If pipe is present, strip everything before and including it
	if (token.includes('|')) {
		token = token.substring(token.indexOf('|') + 1);
	} else {
		// n8n silently strips "|" from credential values, so "2|wQ5So..." becomes "2wQ5So..."
		// Sanctum hashes are exactly 40 chars ([a-zA-Z0-9]). Strip minimal leading digits.
		// Only strip 1-4 leading digits (Sanctum IDs are small sequential integers)
		token = token.replace(/^\d{1,4}(?=[a-zA-Z])/, '');
	}
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

	// Retry loop for transient errors with exponential backoff + jitter
	const maxRetries = 3;
	const retryableStatuses = [429, 502, 503, 504];
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		try {
			const response = await this.helpers.httpRequest(options);
			return response;
		} catch (error: any) {
			const statusCode = error.response?.statusCode || error.statusCode;
			if (retryableStatuses.includes(statusCode) && attempt < maxRetries) {
				const retryAfter = error.response?.headers?.['retry-after'];
				const baseMs = retryAfter
					? Math.min(parseInt(retryAfter, 10) * 1000, 30000)
					: Math.min(1000 * Math.pow(2, attempt), 10000);
				// Add jitter (0-25% of base) to prevent thundering herd
				const jitter = Math.floor(Math.random() * baseMs * 0.25);
				await new Promise((resolve) => setTimeout(resolve, baseMs + jitter));
				continue;
			}
			handleXentralError(this, error);
		}
	}
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

	if (iterations >= maxIterations) {
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

// ---------- V3 file upload (multipart/form-data) ----------

export async function xentralFileUpload(
	this: IExecuteFunctions,
	endpoint: string,
	binaryPropertyName: string,
	itemIndex: number,
	apiVersion: string = 'v3',
): Promise<any> {
	const credentials = await getCredentials(this);
	const instanceUrl = credentials.instanceUrl as string;
	const accessToken = normalizeToken(credentials.accessToken as string || '');
	if (!accessToken) {
		throw new NodeApiError(this.getNode(), { message: 'No access token configured' } as JsonObject, { message: 'Xentral access token is empty. Please configure your credentials.' });
	}
	const safeEndpoint = sanitizeEndpoint(endpoint);

	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const dataBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	try {
		const response = await this.helpers.httpRequest({
			method: 'POST',
			url: `${getBaseUrl(instanceUrl, apiVersion)}/${safeEndpoint}`,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
			},
			body: {
				file: {
					value: dataBuffer,
					options: {
						filename: binaryData.fileName || 'file',
						contentType: binaryData.mimeType || 'application/octet-stream',
					},
				},
			},
			json: true,
		});
		return response;
	} catch (error: any) {
		handleXentralError(this, error);
	}
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
