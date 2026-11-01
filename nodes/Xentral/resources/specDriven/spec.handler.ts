import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
	assertSafeId,
	xentralRequest,
	xentralV1CursorGetAll,
	xentralV1PageGetAll,
	xentralV3GetAll,
} from '../../transport';
import { SPEC_CATALOG } from './spec.catalog';
import { ExecutionItemResult } from '../executionItem';
import type { SpecOperation } from './spec.types';
import { acceptsQuery } from './spec.types';

export function findSpecOperation(resource: string, operation: string): SpecOperation | undefined {
	return SPEC_CATALOG.find((r) => r.resource === resource)?.ops.find((o) => o.value === operation);
}

export function parseJsonParameter(
	ctx: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): IDataObject {
	if (value === undefined || value === null || value === '') return {};
	if (typeof value === 'object') return value as IDataObject;
	try {
		const parsed = JSON.parse(String(value));
		if (parsed === null || typeof parsed !== 'object') {
			throw new Error('not an object');
		}
		return parsed as IDataObject;
	} catch {
		throw new NodeOperationError(ctx.getNode(), `${label} must be valid JSON`, { itemIndex });
	}
}

export function buildSpecPath(op: SpecOperation, values: Record<string, string>): string {
	return op.path.replace(/\{([A-Za-z]+)\}/g, (_, name: string) => {
		const value = String(values[name] ?? '').trim();
		if (!value) throw new Error(`${name} is required`);
		assertSafeId(value, name);
		return value;
	});
}

export async function runSpecOperation(
	this: IExecuteFunctions,
	resource: string,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const op = findSpecOperation(resource, operation);
	if (!op) {
		throw new NodeOperationError(this.getNode(), `Unknown ${resource} operation: ${operation}`, { itemIndex });
	}

	const values: Record<string, string> = {};
	for (const name of op.pathParams) {
		values[name] = this.getNodeParameter(name, itemIndex) as string;
	}
	let endpoint: string;
	try {
		endpoint = buildSpecPath(op, values);
	} catch (error) {
		throw new NodeOperationError(this.getNode(), (error as Error).message, { itemIndex });
	}

	const query =
		acceptsQuery(op)
			? parseJsonParameter(this, this.getNodeParameter('queryParameters', itemIndex, '{}'), 'Query Parameters', itemIndex)
			: {};

	if (op.pager !== 'none') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex, 50) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		if (op.pager === 'v3') return xentralV3GetAll.call(this, endpoint, query, limit, maxPages);
		if (op.pager === 'v1cursor') return xentralV1CursorGetAll.call(this, endpoint, query, limit, maxPages, op.version);
		return xentralV1PageGetAll.call(this, endpoint, query, limit, maxPages, op.version);
	}

	const body =
		op.body === 'none'
			? {}
			: parseJsonParameter(this, this.getNodeParameter('body', itemIndex, '{}'), 'Body', itemIndex);
	const headers = op.contentType === 'application/json' ? undefined : { 'Content-Type': op.contentType };
	const result = await xentralRequest.call(this, op.method, endpoint, body, query, op.version, headers);
	if (this.getNodeParameter('fullResponse', itemIndex, false) === true) {
		const json = result !== null && typeof result === 'object' && !Array.isArray(result) ? (result as IDataObject) : { data: result };
		return new ExecutionItemResult({ json }) as unknown as IDataObject;
	}
	return result;
}
