import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, assertSafeId } from '../../transport';

export async function handleGoodsReceipt(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'createForPurchaseOrder') {
		const purchaseOrderId = this.getNodeParameter('purchaseOrderId', itemIndex) as string;
		assertSafeId(purchaseOrderId, 'purchaseOrderId');
		const receivedItems = this.getNodeParameter('receivedItems', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};
		if (receivedItems.items !== undefined) body.items = receivedItems.items;

		return xentralRequest.call(this, 'POST', `purchaseOrders/${purchaseOrderId}/goodsReceipts`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'createForReturn') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');

		return xentralRequest.call(this, 'POST', `returns/${returnId}/goodsReceipts`, {} as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown goodsReceipt operation: ${operation}`);
}
