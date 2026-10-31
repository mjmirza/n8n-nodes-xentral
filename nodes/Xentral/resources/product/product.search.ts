import type { IDataObject } from 'n8n-workflow';

/**
 * Xentral v1 filters combine with AND, so each field is queried separately and merged.
 * Keys come from the v1 "List products" reference. Article number first, it is the precise match.
 */
export const PRODUCT_SEARCH_FILTERS: ReadonlyArray<{ key: string; op: string }> = [
	{ key: 'number', op: 'contains' },
	{ key: 'ean', op: 'equals' },
	{ key: 'name', op: 'contains' },
];

export function buildProductSearchQuery(key: string, op: string, term: string): IDataObject {
	return {
		'filter[0][key]': key,
		'filter[0][op]': op,
		'filter[0][value]': term,
	};
}

export type ProductPageFetcher = (query: IDataObject, limit?: number) => Promise<IDataObject[]>;

export function mergeUniqueById(lists: IDataObject[][], limit?: number): IDataObject[] {
	const seen = new Set<string>();
	const merged: IDataObject[] = [];
	for (const items of lists) {
		for (const item of items) {
			const id = item.id === undefined || item.id === null ? undefined : String(item.id);
			if (id !== undefined) {
				if (seen.has(id)) continue;
				seen.add(id);
			}
			merged.push(item);
			if (limit !== undefined && merged.length >= limit) {
				return merged;
			}
		}
	}
	return merged;
}

export async function runProductSearch(
	fetchAll: ProductPageFetcher,
	rawTerm: string,
	limit?: number,
): Promise<IDataObject[]> {
	const term = rawTerm.trim();
	if (!term) {
		return [];
	}
	const lists = await Promise.all(
		PRODUCT_SEARCH_FILTERS.map(({ key, op }) => fetchAll(buildProductSearchQuery(key, op, term), limit)),
	);
	return mergeUniqueById(lists, limit);
}
