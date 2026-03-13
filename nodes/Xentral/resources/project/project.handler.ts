import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralV1PageGetAll } from '../../transport';

export async function handleProject(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'projects', {}, limit);
	}

	throw new Error(`Unknown project operation: ${operation}`);
}
