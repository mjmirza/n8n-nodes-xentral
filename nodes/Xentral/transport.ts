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

/**
 * Parses an IPv4 literal the way WHATWG URL and inet_aton do. Accepts decimal, hex (0x) and
 * octal (leading 0) parts and the 1 to 4 part short forms. Returns the 32 bit value, NaN when
 * the host looks numeric but is malformed, or undefined when it is a domain name.
 */
export function parseIpv4(host: string): number | undefined {
	const parts = host.split('.');
	if (parts.length > 4 || !parts.every((p) => /^(0x[0-9a-f]*|[0-9]+)$/i.test(p))) return undefined;
	const nums = parts.map((p) => {
		if (/^0x/i.test(p)) return p.length === 2 ? 0 : parseInt(p.slice(2), 16);
		if (/^0[0-9]+$/.test(p)) return /^0[0-7]+$/.test(p) ? parseInt(p, 8) : NaN;
		return parseInt(p, 10);
	});
	if (nums.some((n) => !Number.isFinite(n))) return NaN;
	const last = nums.pop() as number;
	if (nums.some((n) => n > 255) || last >= Math.pow(256, 4 - nums.length)) return NaN;
	return nums.reduce((acc, n, i) => acc + n * Math.pow(256, 3 - i), 0) + last;
}

/**
 * True for hosts that must never receive the credential: localhost names, every IPv6 literal,
 * and IPv4 addresses in loopback, private, link-local, CGNAT, multicast or reserved ranges.
 * Literal addresses only. A public name that resolves to an internal address needs an n8n egress policy.
 */
export function isBlockedHost(rawHost: string): boolean {
	let decoded = String(rawHost || '');
	if (decoded.includes('%')) {
		try {
			decoded = decodeURIComponent(decoded);
		} catch {
			return true;
		}
	}
	const host = decoded.normalize('NFKC').replace(/[\u3002\uff0e\uff61]/g, '.').trim().toLowerCase().replace(/\.+$/, '');
	if (/[^a-z0-9._:\[\]-]/.test(host)) return true;
	if (!host) return true;
	if (host === 'localhost' || host.endsWith('.localhost')) return true;
	if (host.startsWith('[') || host.includes(':')) return true;
	const ip = parseIpv4(host);
	if (ip === undefined) return false;
	if (Number.isNaN(ip)) return true;
	const a = Math.floor(ip / 16777216);
	const b = Math.floor(ip / 65536) % 256;
	return (
		a === 0 || a === 10 || a === 127 || a >= 224 ||
		(a === 169 && b === 254) ||
		(a === 172 && b >= 16 && b <= 31) ||
		(a === 192 && b === 168) ||
		(a === 100 && b >= 64 && b <= 127)
	);
}


export function normalizeUrl(raw: string): string {
	let url = raw.trim().replace(/\/+$/, '');
	// Userinfo, backslashes and whitespace let a parser and a validator disagree about the host.
	if (/[@\s\\]/.test(url)) {
		throw new Error('User info, backslashes and spaces are not allowed in the Xentral instance URL');
	}
	// Enforce HTTPS: reject explicit http:// and auto-add https:// if missing
	if (/^http:\/\//i.test(url)) {
		throw new Error('HTTP is not allowed - only HTTPS connections are supported for security');
	}
	if (!/^https:\/\//i.test(url)) {
		url = `https://${url}`;
	}

	// SSRF protection: block internal and reserved hosts after canonicalizing them.
	let hostname = '';
	try {
		hostname = new URL(url).hostname;
	} catch {
		hostname = '';
	}
	if (!hostname) {
		throw new Error('Invalid Xentral instance URL. Please check the format (e.g. https://yourcompany.xentral.com).');
	}
	if (isBlockedHost(hostname)) {
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

/** HTTP status of a failed request. n8n's helper throws AxiosErrors (response.status), older paths use statusCode. */
export function errorStatus(error: any): number | undefined {
	const raw = error?.response?.status ?? error?.response?.statusCode ?? error?.statusCode ?? error?.httpCode;
	const status = typeof raw === 'string' ? parseInt(raw, 10) : raw;
	return typeof status === 'number' && Number.isFinite(status) ? status : undefined;
}

/** Response body of a failed request. AxiosErrors carry it in response.data, older paths in response.body. */
function errorBody(error: any): any {
	const response = error?.response;
	if (!response) return undefined;
	if (response.data !== undefined && response.data !== null && response.data !== '') return response.data;
	if (response.body !== undefined && response.body !== null && response.body !== '') return response.body;
	return undefined;
}

function handleXentralError(
	node: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	error: any,
): never {
	const status = errorStatus(error);
	let raw = errorBody(error);
	if (raw instanceof ArrayBuffer) raw = Buffer.from(raw);
	if (Buffer.isBuffer(raw)) raw = raw.toString('utf8');
	if (raw !== undefined) {
		let parsedBody: any;
		try {
			parsedBody = typeof raw === 'string' ? JSON.parse(raw) : raw;
		} catch {
			parsedBody = { detail: String(raw) };
		}
		const message = parseXentralError(parsedBody);
		// The per-field details without the title, so the n8n UI shows them under the headline.
		const details = parsedBody && typeof parsedBody === 'object' && parsedBody.title
			? parseXentralError({ ...parsedBody, title: undefined })
			: message;
		const safeError: Record<string, any> = {
			message: error.message,
			statusCode: status,
		};
		throw new NodeApiError(node.getNode(), safeError as JsonObject, {
			message,
			description: details,
			httpCode: status !== undefined ? String(status) : undefined,
		});
	}
	const safeError: Record<string, any> = {
		message: error.message || 'Unknown error',
	};
	throw new NodeApiError(node.getNode(), safeError as JsonObject, {
		httpCode: status !== undefined ? String(status) : undefined,
	});
}

/**
 * Field messages at any depth, as "path: message". Nested objects and arrays keep their path, for example
 * positions.0.price: Must be non-negative. A "_" key means a message without a field.
 */
function flattenMessages(value: unknown, path: string, parts: string[], depth = 0): void {
	if (value === undefined || value === null) return;
	if (depth > 8) {
		parts.push(path ? `${path}: ${JSON.stringify(value)}` : JSON.stringify(value));
		return;
	}
	if (Array.isArray(value)) {
		value.forEach((item, index) => {
			const nested = item !== null && typeof item === 'object';
			flattenMessages(item, nested ? (path ? `${path}.${index}` : String(index)) : path, parts, depth + 1);
		});
		return;
	}
	if (typeof value === 'object') {
		for (const [key, inner] of Object.entries(value as Record<string, unknown>)) {
			const next = key === '_' ? path : path ? `${path}.${key}` : key;
			flattenMessages(inner, next, parts, depth + 1);
		}
		return;
	}
	parts.push(path ? `${path}: ${String(value)}` : String(value));
}

function parseXentralError(responseBody: any): string {
	if (!responseBody) return 'Unknown Xentral API error';
	if (typeof responseBody === 'string') return responseBody;
	const parts: string[] = [];
	if (responseBody.title) parts.push(responseBody.title);
	if (responseBody.detail) parts.push(responseBody.detail);
	if (responseBody.message && !responseBody.title) parts.push(responseBody.message);
	if (responseBody.error) parts.push(String(responseBody.error));
	for (const key of ['violations', 'errors', 'messages']) {
		if (responseBody[key] !== undefined && responseBody[key] !== null) flattenMessages(responseBody[key], '', parts);
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

/**
 * Line item placement for V3 documents. Xentral orders line items with position.afterLineItem.
 * The legacy numeric Sort option is never sent, V3 ignores it.
 */
export function applyLineItemPosition(body: IDataObject, fields: IDataObject): void {
	const after = fields.afterLineItemId;
	if (after === undefined || after === null || String(after).trim() === '') return;
	const id = String(after).trim();
	assertSafeId(id, 'afterLineItemId');
	body.position = { afterLineItem: { id } };
}

/** Hidden on PDF for V3 line items. Xentral reads printSettings.hidden, a root hiddenOnPdf is ignored. */
export function applyLineItemHidden(body: IDataObject, fields: IDataObject): void {
	if (fields.hiddenOnPdf === undefined) return;
	const existing = (body.printSettings as IDataObject | undefined) ?? {};
	body.printSettings = { ...existing, hidden: fields.hiddenOnPdf };
}

/**
 * Price for a V3 line item update. Amount and currency are both optional in LineItemFinancials, so a
 * currency set on its own is sent too. Returns undefined when neither was set.
 */
export function lineItemUpdatePrice(fields: IDataObject): IDataObject | undefined {
	const hasAmount = fields.priceAmount !== undefined && fields.priceAmount !== null && fields.priceAmount !== '';
	const hasCurrency = typeof fields.priceCurrency === 'string' ? fields.priceCurrency.trim() !== '' : !!fields.priceCurrency;
	if (!hasAmount && !hasCurrency) return undefined;
	const net: IDataObject = {};
	if (hasAmount) net.amount = fields.priceAmount;
	if (hasCurrency) net.currency = fields.priceCurrency;
	return { net };
}

/** Salutation types the V3 document address schemas accept. */
export const DOCUMENT_ADDRESS_TYPES = ['mrs', 'mr', 'company', 'other'];

/**
 * A document address override as Xentral expects it. An empty Type or Country is left out,
 * a set Type must be mrs, mr, company or other, a set Country a two-letter code.
 */
export function documentAddress(address: IDataObject): IDataObject;
export function documentAddress(address: IDataObject | null): IDataObject | null;
export function documentAddress(address: IDataObject | null): IDataObject | null {
	// An explicit null clears the override on update, as the schema allows.
	if (address === null) return null;
	const result: IDataObject = { ...address };
	const type = result.type;
	if (type === null) {
		// An explicit null clears it on update, as the schema allows.
	} else if (type === undefined || String(type).trim() === '') {
		delete result.type;
	} else {
		const normalized = String(type).trim().toLowerCase();
		if (!DOCUMENT_ADDRESS_TYPES.includes(normalized)) {
			throw new Error(`Invalid address Type "${String(type)}". Use one of: ${DOCUMENT_ADDRESS_TYPES.join(', ')}, or leave it empty.`);
		}
		result.type = normalized;
	}
	// Country must match ^[A-Z]{2}$, so an empty one is left out and a set one is upper-cased.
	const country = result.country;
	if (country === null) {
		// An explicit null clears it on update, as the schema allows.
	} else if (country === undefined || String(country).trim() === '') {
		delete result.country;
	} else {
		const code = String(country).trim().toUpperCase();
		if (!/^[A-Z]{2}$/.test(code)) {
			throw new Error(`Invalid address Country "${String(country)}". Use a two-letter ISO code such as DE.`);
		}
		result.country = code;
	}
	return result;
}

/**
 * A V3 line item create has no product number field, so a saved Product Number option is not sent.
 */
export function lineItemAddBody(body: IDataObject): IDataObject {
	delete body.number;
	return body;
}

/**
 * A V3 line item update cannot change the product or the product number, and ignores a numeric Sort.
 * Those saved options are left out. When nothing else was set, nothing is sent and the item says why.
 */
export function sortOnlyLineItemUpdate(body: IDataObject, fields: IDataObject): IDataObject | undefined {
	delete body.product;
	delete body.number;
	if (Object.keys(body).length > 0) return undefined;
	const ignored: string[] = [];
	if (fields.sort !== undefined) ignored.push('Sort');
	if (fields.productId !== undefined && fields.productId !== '') ignored.push('Product ID');
	if (fields.number !== undefined && fields.number !== '') ignored.push('Product Number');
	if (ignored.length === 0) return undefined;
	const notes: string[] = [];
	if (ignored.includes('Sort')) notes.push('Use Position After Line Item ID to move a line item.');
	if (ignored.includes('Product ID')) notes.push('To change the product, delete the line item and add a new one.');
	return {
		success: true,
		changed: false,
		message: `${ignored.join(', ')} ${ignored.length > 1 ? 'are' : 'is'} not accepted by Xentral V3 on a line item update, so nothing was sent. ${notes.join(' ')}`.trim(),
	};
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

/** Retry settings. maxRetryAfterMs bounds a single Retry-After wait. */
export const RETRY_CONFIG = { maxRetryAfterMs: 120000 };

/** Honours Retry-After (seconds or HTTP date) up to the cap, otherwise backs off exponentially. */
export function retryAfterMs(header: unknown, attempt: number): number {
	const raw = Array.isArray(header) ? header[0] : header;
	if (raw !== undefined && raw !== null && String(raw).trim() !== '') {
		const value = String(raw).trim();
		const ms = /^\d+$/.test(value) ? Number(value) * 1000 : Date.parse(value) - Date.now();
		if (Number.isFinite(ms)) return Math.min(Math.max(0, ms), RETRY_CONFIG.maxRetryAfterMs);
	}
	return Math.min(1000 * Math.pow(2, attempt), 10000);
}

function redirectError(
	ctx: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	status: number,
	headers: any,
): NodeApiError {
	const location = headers?.location ?? headers?.Location ?? 'an unknown location';
	const message = `Xentral answered ${status} with a redirect to ${String(location)}. Redirects are not followed; check the instance URL.`;
	return new NodeApiError(ctx.getNode(), { message } as JsonObject, { message, httpCode: String(status) });
}

/** The v2 and v3 date fields use format date. n8n date pickers produce full ISO timestamps. */
export function toApiDate(value: string | undefined): string {
	const v = (value || '').trim();
	if (!v) return '';
	return /^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : v;
}

const DOCUMENT_DATE_KEYS = ['documentDate', 'deliveryDate', 'desiredDeliveryDate', 'confirmedDeliveryDate'];

/** Trims the date picker timestamps in a document or line item body to YYYY-MM-DD. */
export function apiDates(body: IDataObject): IDataObject {
	for (const key of DOCUMENT_DATE_KEYS) {
		if (typeof body[key] === 'string' && body[key] !== '') body[key] = toApiDate(body[key] as string);
	}
	return body;
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
	raw: boolean = false,
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
		// A redirect could leave HTTPS or reach an internal host after the URL checks, so never follow one.
		disableFollowRedirect: true,
		maxRedirects: 0,
	};

	if (Object.keys(query).length > 0) {
		options.qs = query;
	}

	const hasBody = Array.isArray(body) ? body.length > 0 : body !== null && typeof body === 'object' && Object.keys(body).length > 0;
	// GET and DELETE carry a body only when one was given, for example the product label download options.
	if ((['POST', 'PATCH', 'PUT'].includes(method) && body) || ((method === 'DELETE' || method === 'GET') && hasBody)) {
		options.body = body;
	}

	// Read Location so a create that answers with an empty body still yields its new id.
	options.returnFullResponse = true;

	// Raw mode returns the bytes and headers untouched, for downloads such as CSV or ZIP exports.
	if (raw) {
		options.json = false;
		options.encoding = 'arraybuffer';
		options.headers = { ...options.headers, Accept: extraHeaders?.Accept ?? '*/*' };
	}

	// Retries. Safe methods retry on 429, 502, 503 and 504. A write (POST, PATCH, PUT) may already
	// have been committed when a gateway fails, so it only retries on 429, where Xentral did not process it.
	const maxRetries = 3;
	const safeMethod = ['GET', 'HEAD', 'DELETE', 'OPTIONS'].includes(method);
	const retryableStatuses = safeMethod ? [429, 502, 503, 504] : [429];
	for (let attempt = 0; attempt <= maxRetries; attempt++) {
		let response: any;
		try {
			response = await this.helpers.httpRequest(options);
		} catch (error: any) {
			const statusCode = errorStatus(error);
			if (statusCode !== undefined && statusCode >= 300 && statusCode < 400) {
				throw redirectError(this, statusCode, error.response?.headers);
			}
			if (statusCode !== undefined && retryableStatuses.includes(statusCode) && attempt < maxRetries) {
				const baseMs = retryAfterMs(error.response?.headers?.['retry-after'], attempt);
				const jitter = Math.floor(Math.random() * baseMs * 0.25);
				await sleep(baseMs + jitter);
				continue;
			}
			handleXentralError(this, error);
		}
		const redirectStatus = Number(response?.statusCode ?? response?.status);
		if (redirectStatus >= 300 && redirectStatus < 400) throw redirectError(this, redirectStatus, response?.headers);
		return raw ? response : unwrapResponse(method, response);
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
	// Xentral documents a page size between 10 and 50. A larger request is capped to 50 by the API,
	// which made a full 50 record page look like the last one.
	const pageSize = 50;
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
	let complete = false;
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
		iterations++;

		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}

		// The last page: an empty page, an explicit links.next of null, the reported last page,
		// or (without pagination links) a short page.
		const links = response?.links;
		const hasLinks = links !== null && typeof links === 'object' && 'next' in links;
		const lastPage = response?.meta?.lastPage;
		if (
			items.length === 0 ||
			(hasLinks && links.next == null) ||
			(lastPage && page >= lastPage) ||
			(!hasLinks && items.length < perPage)
		) {
			complete = true;
			break;
		}

		page++;
	} while (iterations < maxIterations);

	if (!complete) {
		throw new NodeApiError(
			this.getNode(),
			{ message: 'Pagination limit reached' } as JsonObject,
			{ message: `Results truncated at ${returnData.length} records. The API has more data available. Consider adding filters to reduce the result set.` },
		);
	}

	return limit ? returnData.slice(0, limit) : returnData;
}
