import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handlePaymentTermsGroup(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('paymentTermsGroupName', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			name,
		};

		if (additionalFields.days) body.days = additionalFields.days;
		if (additionalFields.discountDays) body.discountDays = additionalFields.discountDays;
		if (additionalFields.discountPercent) body.discountPercent = additionalFields.discountPercent;

		return xentralRequest.call(this, 'POST', 'payment-terms-group', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const paymentTermsGroupId = this.getNodeParameter('paymentTermsGroupId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `payment-terms-group/${paymentTermsGroupId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'payment-terms-group', {}, limit);
	}

	throw new Error(`Unknown paymentTermsGroup operation: ${operation}`);
}
