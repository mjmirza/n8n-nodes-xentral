// Generates nodes/Xentral/resources/specDriven/spec.catalog.ts from the Xentral OpenAPI specs in specs/.
// Run with: node scripts/gen-spec-catalog.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const specs = [
	JSON.parse(fs.readFileSync(path.join(root, 'specs/xentral-api.openapi-3.0.0.json'), 'utf8')),
	JSON.parse(fs.readFileSync(path.join(root, 'specs/xentral-documents-api.openapi-3.1.0.json'), 'utf8')),
];

// Resource picks: [operation value, operation name, method, spec path]. Everything else is read from the spec.
const PICKS = {
	customerAddress: {
		displayName: 'Customer Address',
		ops: [
			['create', 'Create', 'post', '/api/v2/customers/{customerId}/addresses'],
			['delete', 'Delete', 'delete', '/api/v2/customers/{customerId}/addresses/{id}'],
			['get', 'Get', 'get', '/api/v2/customers/{customerId}/addresses/{id}'],
			['getAll', 'Get Many', 'get', '/api/v2/customers/{customerId}/addresses'],
			['update', 'Update', 'patch', '/api/v2/customers/{customerId}/addresses/{id}'],
		],
	},
	customerDeliveryAddress: {
		displayName: 'Customer Delivery Address',
		ops: [
			['create', 'Create', 'post', '/api/v3/customers/{customerId}/deliveryAddresses'],
			['delete', 'Delete', 'delete', '/api/v3/customers/{customerId}/deliveryAddresses/{deliveryAddressId}'],
			['get', 'Get', 'get', '/api/v3/customers/{customerId}/deliveryAddresses/{deliveryAddressId}'],
			['getAll', 'Get Many', 'get', '/api/v3/customers/{customerId}/deliveryAddresses'],
			['update', 'Update', 'patch', '/api/v3/customers/{customerId}/deliveryAddresses/{deliveryAddressId}'],
		],
	},
	productCategory: {
		displayName: 'Product Category',
		ops: [
			['create', 'Create', 'post', '/api/v1/productsCategories'],
			['delete', 'Delete', 'delete', '/api/v1/productsCategories/{id}'],
			['get', 'Get', 'get', '/api/v1/productsCategories/{id}'],
			['getAll', 'Get Many', 'get', '/api/v1/productsCategories'],
			['update', 'Update', 'patch', '/api/v1/productsCategories/{id}'],
		],
	},
	productFreeField: {
		displayName: 'Product Free Field',
		ops: [
			['get', 'Get', 'get', '/api/v1/productsFreeFields/{id}'],
			['getAll', 'Get Many', 'get', '/api/v1/productsFreeFields'],
			['update', 'Update', 'patch', '/api/v1/productsFreeFields/{id}'],
		],
	},
	productMedia: {
		displayName: 'Product Media',
		ops: [
			['create', 'Create', 'post', '/api/v1/productMedia'],
			['get', 'Get', 'get', '/api/v1/productMedia/{id}'],
			['getAll', 'Get Many', 'get', '/api/v1/productMedia'],
		],
	},
	productMerchandiseGroup: {
		displayName: 'Product Merchandise Group',
		ops: [
			['create', 'Create', 'post', '/api/v1/productsMerchandiseGroups'],
			['delete', 'Delete', 'delete', '/api/v1/productsMerchandiseGroups/{id}'],
			['get', 'Get', 'get', '/api/v1/productsMerchandiseGroups/{id}'],
			['getAll', 'Get Many', 'get', '/api/v1/productsMerchandiseGroups'],
			['update', 'Update', 'patch', '/api/v1/productsMerchandiseGroups/{id}'],
		],
	},
	productOption: {
		displayName: 'Product Option',
		ops: [
			['create', 'Create', 'post', '/api/v1/products/{id}/options'],
			['createValues', 'Create Values', 'post', '/api/v1/products/{productId}/options/{id}/values'],
			['deleteValue', 'Delete Value', 'delete', '/api/v1/products/{productId}/options/{optionId}/values/{id}'],
			['getAll', 'Get Many', 'get', '/api/v1/products/{id}/options'],
			['getValue', 'Get Value', 'get', '/api/v1/products/{productId}/options/{optionId}/values/{id}'],
			['getValues', 'Get Values', 'get', '/api/v1/products/{productId}/options/{id}/values'],
			['update', 'Update', 'patch', '/api/v1/products/{productId}/options/{id}'],
			['updateValue', 'Update Value', 'patch', '/api/v1/products/{productId}/options/{optionId}/values/{id}'],
		],
	},
	report: {
		displayName: 'Report',
		ops: [
			['create', 'Create', 'post', '/api/v1/analytics/report'],
			['createExport', 'Create Export', 'post', '/api/v1/analytics/report/{id}/export'],
			['delete', 'Delete', 'delete', '/api/v1/analytics/report/{id}'],
			['executeQuery', 'Execute Query', 'post', '/api/v1/analytics/report/{id}/query'],
			['get', 'Get', 'get', '/api/v1/analytics/report/{id}'],
			['getAll', 'Get Many', 'get', '/api/v1/analytics/report'],
			['getExport', 'Get Export', 'get', '/api/v1/analytics/report/{id}/export/{uuid}'],
			['getExports', 'Get Exports', 'get', '/api/v1/analytics/report/{id}/export'],
			['getSchedules', 'Get Schedules', 'get', '/api/v1/analytics/report/{id}/schedule'],
			['update', 'Update', 'patch', '/api/v1/analytics/report/{id}'],
		],
	},
	supplierInvoice: {
		displayName: 'Supplier Invoice',
		ops: [
			['addLineItem', 'Add Line Item', 'post', '/api/v3/supplierInvoices/{id}/lineItems'],
			['assignPurchaseOrder', 'Assign Purchase Order', 'post', '/api/v3/supplierInvoices/{id}/purchaseOrders'],
			['create', 'Create', 'post', '/api/v3/supplierInvoices'],
			['get', 'Get', 'get', '/api/v3/supplierInvoices/{id}'],
			['getAll', 'Get Many', 'get', '/api/v3/supplierInvoices'],
		],
	},
	user: {
		displayName: 'User',
		ops: [
			['create', 'Create', 'post', '/api/v1/users'],
			['delete', 'Delete', 'delete', '/api/v1/users/{id}'],
			['get', 'Get', 'get', '/api/v1/users/{id}'],
			['getAll', 'Get Many', 'get', '/api/v2/users'],
			['getPermissions', 'Get Permissions', 'get', '/api/v1/users/{id}/permissions'],
			['update', 'Update', 'patch', '/api/v1/users/{id}'],
		],
	},
	// Extra read operations appended to the existing Product resource.
	product: {
		displayName: 'Product',
		extendsExisting: true,
		ops: [
			['getPurchasePrices', 'Get Purchase Prices', 'get', '/api/v1/products/{id}/purchasePrices'],
			['getSalesPrices', 'Get Sales Prices', 'get', '/api/v1/products/{id}/salesPrices'],
			['getStock', 'Get Stock', 'get', '/api/v1/products/{id}/stocks'],
			['getStorageLocations', 'Get Storage Locations', 'get', '/api/v1/products/{id}/storageLocations'],
			['getTexts', 'Get Texts', 'get', '/api/v1/products/{id}/texts'],
		],
	},
};

function find(method, p) {
	for (const s of specs) {
		const op = s.paths[p]?.[method];
		if (op) return { s, op, item: s.paths[p] };
	}
	throw new Error(`Not in spec: ${method.toUpperCase()} ${p}`);
}

function resolve(s, x) {
	if (x && x.$ref) {
		let o = s;
		for (const k of x.$ref.slice(2).split('/')) o = o[k];
		return resolve(s, o);
	}
	return x;
}

const SINGULAR = {
	customers: 'customer', deliveryAddresses: 'deliveryAddress', addresses: 'address', productsCategories: 'category',
	productsFreeFields: 'freeField', productMedia: 'media', productsMerchandiseGroups: 'merchandiseGroup',
	products: 'product', options: 'option', values: 'value', report: 'report', export: 'export',
	supplierInvoices: 'supplierInvoice', users: 'user',
};

// Names a path parameter after the segment in front of it, so {id} under options/ becomes optionId.
function paramName(segments, index) {
	const raw = segments[index].slice(1, -1);
	const prev = segments[index - 1];
	const base = SINGULAR[prev] ?? prev;
	return raw.toLowerCase().includes('uuid') ? `${base}Uuid` : `${base}Id`;
}

function pager(params) {
	const names = params.map((p) => p.name);
	if (names.includes('perPage')) return 'v3';
	if (names.includes('cursor')) return 'v1cursor';
	if (names.includes('page')) return 'v1page';
	return 'none';
}

// Required keys of a schema. Top-level required wins, otherwise the keys every anyOf or oneOf branch requires.
function requiredOf(s, schema) {
	if (Array.isArray(schema.required) && schema.required.length) return schema.required;
	const branches = (schema.anyOf || schema.oneOf || []).map((b) => resolve(s, b) || {});
	if (!branches.length) return [];
	const sets = branches.map((b) => new Set(requiredOf(s, b)));
	return [...sets[0]].filter((k) => sets.every((set) => set.has(k)));
}

function branchesAllRequire(s, schema) {
	const branches = (schema.anyOf || schema.oneOf || []).map((b) => resolve(s, b) || {});
	return branches.length > 0 && branches.every((b) => requiredOf(s, b).length > 0);
}

const catalog = [];
for (const [resource, def] of Object.entries(PICKS)) {
	const ops = [];
	for (const [value, name, method, specPath] of def.ops) {
		const { s, op, item } = find(method, specPath);
		const params = [...(item.parameters || []), ...(op.parameters || [])].map((p) => resolve(s, p));
		const segments = specPath.split('/').filter(Boolean); // api, v1, ...
		const version = segments[1];
		const rest = segments.slice(2);
		const pathParams = [];
		const template = rest
			.map((seg, i) => {
				if (seg.startsWith('{')) {
					const n = paramName(rest, i);
					pathParams.push(n);
					return `{${n}}`;
				}
				return seg;
			})
			.join('/');
		let body = 'none';
		let contentType = 'application/json';
		let requiredKeys = [];
		if (op.requestBody) {
			const rb = resolve(s, op.requestBody);
			const types = Object.keys(rb.content || {});
			contentType = types.includes('application/json') ? 'application/json' : types[0];
			const schema = resolve(s, rb.content[contentType].schema) || {};
			requiredKeys = requiredOf(s, schema);
			// A body whose every alternative needs fields is required even when the spec omits requestBody.required.
			body = rb.required || branchesAllRequire(s, schema) ? 'required' : 'optional';
		}
		const queryKeys = params.filter((p) => p.in === 'query').map((p) => p.name);
		const isList = method === 'get' && !specPath.trim().endsWith('}') && pager(params) !== 'none';
		const beta = Boolean(op['x-beta']) || /beta/i.test(op.description || '');
		const summary = String(op.summary || name).replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, ' ').trim();
		ops.push({
			value,
			name,
			method: method.toUpperCase(),
			version,
			path: template,
			pathParams,
			pager: isList ? pager(params) : 'none',
			body,
			contentType,
			requiredKeys,
			queryKeys,
			beta,
			summary,
		});
	}
	catalog.push({ resource, displayName: def.displayName, extendsExisting: Boolean(def.extendsExisting), ops });
}

const out = `// Generated by scripts/gen-spec-catalog.mjs from specs/. Do not edit by hand.
import type { SpecResource } from './spec.types';

export const SPEC_CATALOG: SpecResource[] = ${JSON.stringify(catalog, null, '\t')};
`;
fs.writeFileSync(path.join(root, 'nodes/Xentral/resources/specDriven/spec.catalog.ts'), out);

// Every first path segment per API version, used to validate Custom API Call paths.
// A parameterized first segment such as {documentType} or {resource}TagAssignments is expanded
// with its enum, so documented paths like /api/v2/salesOrders/7/files stay reachable.
function pathParamEnum(s, item, name) {
	const params = [...(item.parameters || [])];
	for (const m of ['get', 'post', 'put', 'patch', 'delete']) if (item[m]) params.push(...(item[m].parameters || []));
	for (const raw of params) {
		const prm = resolve(s, raw);
		if (prm && prm.in === 'path' && prm.name === name) {
			const schema = resolve(s, prm.schema) || {};
			if (Array.isArray(schema.enum) && schema.enum.length > 0) return schema.enum;
		}
	}
	return undefined;
}
const roots = {};
for (const s of specs) {
	for (const [p, item] of Object.entries(s.paths)) {
		const [, , version, first] = p.split('/');
		if (!/^v\d$/.test(version || '') || !first) continue;
		const set = (roots[version] ??= new Set());
		const params = [...first.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
		if (params.length === 0) {
			set.add(first);
			continue;
		}
		if (params.length > 1) throw new Error(`Cannot expand first segment ${first} of ${p}`);
		const values = pathParamEnum(s, item, params[0]);
		if (!values) throw new Error(`Path parameter ${params[0]} in ${p} has no enum to expand`);
		for (const v of values) set.add(first.replace(`{${params[0]}}`, String(v)));
	}
}
const rootsOut = `// Generated by scripts/gen-spec-catalog.mjs from specs/. Do not edit by hand.
export const API_ROOTS: Record<string, string[]> = ${JSON.stringify(
	Object.fromEntries(Object.entries(roots).sort().map(([k, v]) => [k, [...v].sort()])),
	null,
	'\t',
)};
`;
fs.writeFileSync(path.join(root, 'nodes/Xentral/resources/customApiCall/apiRoots.ts'), rootsOut);
process.stdout.write(`catalog: ${catalog.length} resources, ${catalog.reduce((n, r) => n + r.ops.length, 0)} operations\n`);
