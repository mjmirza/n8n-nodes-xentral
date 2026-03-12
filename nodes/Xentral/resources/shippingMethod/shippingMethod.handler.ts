import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleShippingMethod(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') {
		const shippingMethodId = this.getNodeParameter('shippingMethodId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `shippingMethods/${shippingMethodId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'shippingMethods', {}, limit);
	}

	throw new Error(`Unknown shippingMethod operation: ${operation}`);
}
