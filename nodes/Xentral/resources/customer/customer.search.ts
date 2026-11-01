import type { IDataObject } from 'n8n-workflow';
import { mergeUniqueById } from '../product/product.search';

/**
 * The stable v2 customer list only supports exact operators (equals, in, ...), not contains.
 * So search runs one exact query per field and merges the results by id.
 */
export const CUSTOMER_SEARCH_KEYS: ReadonlyArray<string> = ['number', 'name', 'email'];

export function buildCustomerSearchQuery(key: string, term: string): IDataObject {
	return {
		'filter[0][key]': key,
		'filter[0][op]': 'equals',
		'filter[0][value]': term,
	};
}

export type CustomerPageFetcher = (query: IDataObject, limit?: number) => Promise<IDataObject[]>;

export async function runCustomerSearch(
	fetchAll: CustomerPageFetcher,
	rawTerm: string,
	limit?: number,
): Promise<IDataObject[]> {
	const term = rawTerm.trim();
	if (!term) return [];
	const lists = await Promise.all(
		CUSTOMER_SEARCH_KEYS.map((key) => fetchAll(buildCustomerSearchQuery(key, term), limit)),
	);
	return mergeUniqueById(lists, limit);
}
