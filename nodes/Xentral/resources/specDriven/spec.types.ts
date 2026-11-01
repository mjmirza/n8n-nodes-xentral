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
	beta: boolean;
	summary: string;
}

export interface SpecResource {
	resource: string;
	displayName: string;
	extendsExisting: boolean;
	ops: SpecOperation[];
}
