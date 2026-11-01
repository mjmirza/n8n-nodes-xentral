import { API_ROOTS } from './apiRoots';

export interface ResolvedPath {
	version: string;
	path: string;
}

/**
 * Validates a Custom API Call path. It must be relative to the Xentral API and start with a
 * resource that exists in the Xentral OpenAPI specs. A pasted "/api/v2/..." path sets the version.
 */
export function resolveCustomPath(selectedVersion: string, rawPath: string): ResolvedPath {
	let path = String(rawPath ?? '').trim();
	if (!path) throw new Error('Path is required');
	if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith('//')) {
		throw new Error('Path must be relative to the Xentral API, not a full URL');
	}
	if (path.includes('..') || path.includes('\\')) {
		throw new Error('Path must not contain ".." or backslashes');
	}
	if (/[?#]/.test(path)) {
		throw new Error('Put query parameters in the Query Parameters field, not in the path');
	}
	if (/[{}]/.test(path)) {
		throw new Error('Replace every {placeholder} in the path with a real value');
	}
	path = path.replace(/^\/+/, '');
	let version = selectedVersion;
	const prefixed = /^api\/(v\d)\/(.*)$/.exec(path);
	if (prefixed) {
		version = prefixed[1];
		path = prefixed[2];
	}
	const roots = API_ROOTS[version];
	if (!roots) throw new Error(`Unknown API version: ${version}`);
	const first = path.split('/')[0];
	if (!roots.includes(first)) {
		throw new Error(`"${first}" is not a Xentral ${version} resource. Check the path against the Xentral API reference.`);
	}
	return { version, path };
}
