import type { IDataObject, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { xentralRequest } from '../../transport';
import { parseJsonParameter } from '../specDriven/spec.handler';
import { resolveCustomPath } from './customApiCall.path';

const METHODS = ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'];

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
	const body = ['PATCH', 'POST', 'PUT'].includes(method)
		? parseJsonParameter(this, this.getNodeParameter('body', itemIndex, '{}'), 'Body', itemIndex)
		: {};
	const contentType = String(this.getNodeParameter('contentType', itemIndex, 'application/json') || '').trim();
	if (contentType && !/^[a-z]+\/[a-z0-9.+-]+$/i.test(contentType)) {
		throw new NodeOperationError(this.getNode(), `Invalid content type: ${contentType}`, { itemIndex });
	}
	const headers = contentType && contentType !== 'application/json' ? { 'Content-Type': contentType } : undefined;
	return xentralRequest.call(this, method as IHttpRequestMethods, resolved.path, body, query, resolved.version, headers);
}
