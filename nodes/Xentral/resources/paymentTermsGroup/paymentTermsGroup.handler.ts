import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId } from '../../transport';

export async function handlePaymentTermsGroup(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('paymentTermsGroupName', itemIndex) as string;
		const key = this.getNodeParameter('paymentTermsGroupKey', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			name,
			key,
		};

		if (additionalFields.days !== undefined) body.days = additionalFields.days;
		if (additionalFields.discountDays !== undefined) body.discountDays = additionalFields.discountDays;
		if (additionalFields.discountPercent !== undefined) body.discountPercent = additionalFields.discountPercent;

		return xentralRequest.call(this, 'POST', 'paymentTermsGroups', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const paymentTermsGroupId = this.getNodeParameter('paymentTermsGroupId', itemIndex) as string;
		assertSafeId(paymentTermsGroupId, 'paymentTermsGroupId');
		return xentralRequest.call(this, 'GET', `paymentTermsGroups/${paymentTermsGroupId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'paymentTermsGroups', {}, limit, maxPages);
	}

	throw new Error(`Unknown paymentTermsGroup operation: ${operation}`);
}
