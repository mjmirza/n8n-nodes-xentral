export type SpecPager = 'none' | 'v1page' | 'v1cursor' | 'v3';

export interface SpecOperation {
	value: string;
	name: string;
	method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
	version: string;
	path: string;
	pathParams: string[];
	pager: SpecPager;
	body: 'none' | 'optional' | 'required';
	contentType: string;
	requiredKeys: string[];
	queryKeys: string[];
	beta: boolean;
	summary: string;
}

export interface SpecResource {
	resource: string;
	displayName: string;
	extendsExisting: boolean;
	ops: SpecOperation[];
}

/** GET operations take query parameters, and so does any write whose spec declares them. */
export function acceptsQuery(op: SpecOperation): boolean {
	return op.method === 'GET' || (op.queryKeys ?? []).length > 0;
}
