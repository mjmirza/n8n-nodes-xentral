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
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		if (additionalFields.date !== undefined && (additionalFields.date as string) !== '') {
			body.date = additionalFields.date;
		}

		if (additionalFields.positionsJson !== undefined) {
			const val = additionalFields.positionsJson;
			if (typeof val === 'string' && val.trim() !== '' && val.trim() !== '[]') {
				try {
					body.positions = JSON.parse(val);
				} catch {
					throw new Error('Invalid JSON in positions. Please provide valid JSON.');
				}
			} else if (Array.isArray(val)) {
				body.positions = val;
			}
		}

		return xentralRequest.call(this, 'POST', `purchaseOrders/${purchaseOrderId}/goodsReceipts`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'createForReturn') {
		const returnId = this.getNodeParameter('returnId', itemIndex) as string;
		assertSafeId(returnId, 'returnId');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		if (additionalFields.date !== undefined && (additionalFields.date as string) !== '') {
			body.date = additionalFields.date;
		}

		if (additionalFields.positionsJson !== undefined) {
			const val = additionalFields.positionsJson;
			if (typeof val === 'string' && val.trim() !== '' && val.trim() !== '[]') {
				try {
					body.positions = JSON.parse(val);
				} catch {
					throw new Error('Invalid JSON in positions. Please provide valid JSON.');
				}
			} else if (Array.isArray(val)) {
				body.positions = val;
			}
		}

		return xentralRequest.call(this, 'POST', `returns/${returnId}/goodsReceipts`, body as IDataObject, {}, 'v1');
	}

	throw new Error(`Unknown goodsReceipt operation: ${operation}`);
}
