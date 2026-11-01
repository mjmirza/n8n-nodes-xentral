import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { SPEC_CATALOG } from './spec.catalog';
import type { SpecOperation, SpecResource } from './spec.types';
import { acceptsQuery } from './spec.types';

const BETA_NOTICE =
	'Xentral marks this endpoint as beta. It may change without notice, so test it before you rely on it in production.';

function titleCase(id: string): string {
	return id
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/\bId\b/, 'ID')
		.replace(/\bUuid\b/, 'UUID')
		.replace(/^./, (c) => c.toUpperCase());
}

function plural(displayName: string): string {
	const lower = displayName.toLowerCase();
	if (lower.endsWith('y')) return `${lower.slice(0, -1)}ies`;
	if (lower.endsWith('s') || lower.endsWith('media')) return lower;
	return `${lower}s`;
}

function actionFor(resource: SpecResource, op: SpecOperation): string {
	if (op.value === 'getAll') return `Get many ${plural(resource.displayName)}`;
	const verb = op.name.split(' ')[0];
	const rest = op.name.split(' ').slice(1).join(' ').toLowerCase();
	const noun = resource.displayName.toLowerCase();
	return rest ? `${verb} ${noun} ${rest}` : `${verb} a ${noun}`;
}

export function specOperationOptions(resource: SpecResource): INodePropertyOptions[] {
	return resource.ops
		.map((op) => ({
			name: op.name,
			value: op.value,
			description: `${op.summary} via ${op.method} /api/${op.version}/${op.path}`,
			action: actionFor(resource, op),
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

function bodySkeleton(op: SpecOperation): string {
	const skeleton: Record<string, string> = {};
	for (const key of op.requiredKeys) skeleton[key] = '';
	return JSON.stringify(skeleton, null, 2);
}

function show(resource: string, ops: string[]) {
	return { show: { resource: [resource], operation: ops } };
}

export function specFields(resource: SpecResource): INodeProperties[] {
	const fields: INodeProperties[] = [];
	const betaOps = resource.ops.filter((o) => o.beta).map((o) => o.value);
	if (betaOps.length > 0) {
		fields.push({
			displayName: BETA_NOTICE,
			name: 'betaNotice',
			type: 'notice',
			default: '',
			displayOptions: show(resource.resource, betaOps),
		});
	}

	const params = [...new Set(resource.ops.flatMap((o) => o.pathParams))];
	for (const param of params) {
		fields.push({
			displayName: titleCase(param),
			name: param,
			type: 'string',
			required: true,
			default: '',
			displayOptions: show(
				resource.resource,
				resource.ops.filter((o) => o.pathParams.includes(param)).map((o) => o.value),
			),
			description: `The ${titleCase(param)} used in the request path`,
		});
	}

	const bodyOps = resource.ops.filter((o) => o.body !== 'none');
	if (bodyOps.length > 0) {
		for (const op of bodyOps) {
			fields.push({
				displayName: 'Body',
				name: 'body',
				type: 'json',
				required: op.requiredKeys.length > 0,
				default: bodySkeleton(op),
				displayOptions: show(resource.resource, [op.value]),
				description: op.requiredKeys.length
					? `JSON request body. Required keys are ${op.requiredKeys.join(', ')}. See the Xentral API reference for all fields.`
					: 'JSON request body. See the Xentral API reference for all fields.',
			});
		}
	}

	const listOps = resource.ops.filter((o) => o.pager !== 'none').map((o) => o.value);
	if (listOps.length > 0) {
		fields.push(
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				displayOptions: show(resource.resource, listOps),
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				typeOptions: { minValue: 1 },
				displayOptions: { show: { resource: [resource.resource], operation: listOps, returnAll: [false] } },
				description: 'Max number of results to return',
			},
		);
	}

	// GET operations, plus writes that declare query parameters (for example Report Execute Query preview).
	const getOps = resource.ops.filter((o) => acceptsQuery(o)).map((o) => o.value);
	if (getOps.length > 0) {
		fields.push({
			displayName: 'Query Parameters',
			name: 'queryParameters',
			type: 'json',
			default: '{}',
			displayOptions: show(resource.resource, getOps),
			description:
				'Optional query parameters as JSON, for example {"filter[0][key]":"name","filter[0][op]":"contains","filter[0][value]":"Acme"}',
		});
	}
	return fields;
}

export const SPEC_RESOURCES = SPEC_CATALOG.filter((r) => !r.extendsExisting);
export const SPEC_PRODUCT_EXTRAS = SPEC_CATALOG.find((r) => r.resource === 'product' && r.extendsExisting);

export const specResourceOptions: INodePropertyOptions[] = SPEC_RESOURCES.map((r) => ({
	name: r.displayName,
	value: r.resource,
}));

function defaultOperation(r: SpecResource): string {
	return r.ops.some((o) => o.value === 'getAll') ? 'getAll' : r.ops[0].value;
}

export const specOperations: INodeProperties[] = SPEC_RESOURCES.map((r) => ({
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: [r.resource] } },
	options: specOperationOptions(r),
	default: defaultOperation(r),
}));

export const specFieldsAll: INodeProperties[] = SPEC_CATALOG.flatMap((r) => specFields(r));
