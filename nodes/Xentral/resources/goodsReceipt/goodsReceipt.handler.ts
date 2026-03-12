import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest } from '../../transport';

export async function handleGoodsReceipt(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'createForPurchaseOrder') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		const receivedItems = this.getNodeParameter('receivedItems', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (receivedItems.items) body.items = receivedItems.items;

		return xentralRequest.call(this, 'POST', `purchaseOrders/${purchaseOrderId}/goods-receipt`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'createForReturn') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;

		return xentralRequest.call(this, 'POST', `returns/${returnId}/goods-receipt`, {} as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown goodsReceipt operation: ${operation}`);
}
