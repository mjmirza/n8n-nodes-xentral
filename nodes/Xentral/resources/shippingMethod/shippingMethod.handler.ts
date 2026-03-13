import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId } from '../../transport';

export async function handleShippingMethod(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') {
		const shippingMethodId = this.getNodeParameter('shippingMethodId', itemIndex) as string;
		assertSafeId(shippingMethodId, 'shippingMethodId');
		return xentralRequest.call(this, 'GET', `shippingMethods/${shippingMethodId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'shippingMethods', {}, limit, maxPages);
	}

	throw new Error(`Unknown shippingMethod operation: ${operation}`);
}
