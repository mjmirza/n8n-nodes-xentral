import type { IBinaryData, IDataObject, IExecuteFunctions, IHttpRequestMethods, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { xentralRequest } from '../../transport';
import { parseJsonParameter } from '../specDriven/spec.handler';
import { resolveCustomPath } from './customApiCall.path';

const METHODS = ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'];

/** A finished output item, for example one carrying binary data. The node passes it through unchanged. */
export class ExecutionItemResult {
	constructor(public readonly item: INodeExecutionData) {}
}

function headerValue(headers: IDataObject | undefined, name: string): string | undefined {
	if (!headers) return undefined;
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === name) return Array.isArray(value) ? String(value[0]) : value == null ? undefined : String(value);
	}
	return undefined;
}

function toBuffer(body: unknown): Buffer {
	if (Buffer.isBuffer(body)) return body;
	if (body instanceof ArrayBuffer) return Buffer.from(body);
	if (ArrayBuffer.isView(body)) return Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	if (body === undefined || body === null) return Buffer.alloc(0);
	return Buffer.from(typeof body === 'string' ? body : JSON.stringify(body), 'utf8');
}

function fileNameFrom(disposition: string | undefined, path: string): string {
	const match = disposition ? /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition) : null;
	if (match) {
		try {
			return decodeURIComponent(match[1].trim());
		} catch {
			return match[1].trim();
		}
	}
	return path.split('/').filter(Boolean).pop() || 'download';
}

export async function handleCustomApiCall(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation !== 'request') {
		throw new NodeOperationError(this.getNode(), `Unknown custom API call operation: ${operation}`, { itemIndex });
	}
	const method = this.getNodeParameter('method', itemIndex) as string;
	if (!METHODS.includes(method)) {
		throw new NodeOperationError(this.getNode(), `Unsupported method: ${method}`, { itemIndex });
	}
	let resolved;
	try {
		resolved = resolveCustomPath(
			this.getNodeParameter('apiVersion', itemIndex, 'v1') as string,
			this.getNodeParameter('path', itemIndex) as string,
		);
	} catch (error) {
		throw new NodeOperationError(this.getNode(), (error as Error).message, { itemIndex });
	}
	const query = parseJsonParameter(this, this.getNodeParameter('queryParameters', itemIndex, '{}'), 'Query Parameters', itemIndex);
	// n8n's HTTP helper drops a GET body, so GET never reads one and a saved Body is not parsed.
	const body = ['DELETE', 'PATCH', 'POST', 'PUT'].includes(method)
		? parseJsonParameter(this, this.getNodeParameter('body', itemIndex, '{}'), 'Body', itemIndex)
		: {};
	const contentType = String(this.getNodeParameter('contentType', itemIndex, 'application/json') || '').trim();
	if (contentType && !/^[a-z]+\/[a-z0-9.+-]+$/i.test(contentType)) {
		throw new NodeOperationError(this.getNode(), `Invalid content type: ${contentType}`, { itemIndex });
	}
	const accept = String(this.getNodeParameter('accept', itemIndex, '') || '').trim();
	if (accept && !/^[a-z*]+\/[a-z0-9.+*-]+$/i.test(accept)) {
		throw new NodeOperationError(this.getNode(), `Invalid accept type: ${accept}`, { itemIndex });
	}
	const headerMap: Record<string, string> = {};
	if (contentType && contentType !== 'application/json') headerMap['Content-Type'] = contentType;
	if (accept) headerMap.Accept = accept;
	const headers = Object.keys(headerMap).length > 0 ? headerMap : undefined;
	const responseFormat = this.getNodeParameter('responseFormat', itemIndex, 'json') as string;
	if (responseFormat !== 'text' && responseFormat !== 'file') {
		return xentralRequest.call(this, method as IHttpRequestMethods, resolved.path, body, query, resolved.version, headers);
	}

	const response = await xentralRequest.call(
		this, method as IHttpRequestMethods, resolved.path, body, query, resolved.version, headers, true,
	);
	const responseHeaders = (response?.headers ?? {}) as IDataObject;
	const buffer = toBuffer(response?.body);
	const mimeType = (headerValue(responseHeaders, 'content-type') || 'application/octet-stream').split(';')[0].trim();
	if (responseFormat === 'text') {
		return { data: buffer.toString('utf8') };
	}
	const binaryPropertyName = String(this.getNodeParameter('binaryPropertyName', itemIndex, 'data') || 'data').trim();
	const fileName = fileNameFrom(headerValue(responseHeaders, 'content-disposition'), resolved.path);
	const binary: IBinaryData = await this.helpers.prepareBinaryData(buffer, fileName, mimeType);
	return new ExecutionItemResult({
		json: { fileName, mimeType, fileSize: buffer.length },
		binary: { [binaryPropertyName]: binary },
	}) as unknown as IDataObject;
}
