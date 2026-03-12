import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handlePaymentMethod(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') {
		const paymentMethodId = this.getNodeParameter('paymentMethodId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `paymentMethods/${paymentMethodId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'paymentMethods', {}, limit);
	}

	throw new Error(`Unknown paymentMethod operation: ${operation}`);
}
