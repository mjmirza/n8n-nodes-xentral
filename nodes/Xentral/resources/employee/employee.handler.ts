import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest } from '../../transport';

export async function handleEmployee(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		// Not paginated in the spec. One request returns the whole list, so Max Pages has no effect.
		const response = await xentralRequest.call(this, 'GET', 'employees', {}, {}, 'v1');
		const rows = (Array.isArray(response) ? response : response?.data ?? []) as IDataObject[];
		return limit ? rows.slice(0, limit) : rows;
	}

	throw new Error(`Unknown employee operation: ${operation}`);
}
