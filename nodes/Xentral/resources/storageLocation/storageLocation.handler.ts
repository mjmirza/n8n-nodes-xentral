import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralV1PageGetAll } from '../../transport';

export async function handleStorageLocation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'storageLocations', {}, limit);
	}

	throw new Error(`Unknown storageLocation operation: ${operation}`);
}
