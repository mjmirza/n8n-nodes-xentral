import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmpty } from '../../transport';

export async function handlePaymentTermsGroup(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const key = assertNonEmpty(this.getNodeParameter('key', itemIndex) as string, 'Key');
		const name = assertNonEmpty(this.getNodeParameter('name', itemIndex) as string, 'Name');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			key,
			name,
		};

		if (additionalFields.comment !== undefined) body.comment = additionalFields.comment;
		if (additionalFields.isActive !== undefined) body.isActive = additionalFields.isActive;

		if (additionalFields.category !== undefined) {
			if (typeof additionalFields.category === 'string') {
				try {
					body.category = JSON.parse(additionalFields.category as string);
				} catch {
					throw new NodeOperationError(this.getNode(), 'Invalid JSON in category. Please provide valid JSON.');
				}
			} else {
				body.category = additionalFields.category;
			}
		}

		if (additionalFields.paymentTerms !== undefined) {
			if (typeof additionalFields.paymentTerms === 'string') {
				try {
					body.paymentTerms = JSON.parse(additionalFields.paymentTerms as string);
				} catch {
					throw new NodeOperationError(this.getNode(), 'Invalid JSON in paymentTerms. Please provide valid JSON.');
				}
			} else {
				body.paymentTerms = additionalFields.paymentTerms;
			}
		}

		// Project object ref
		if (additionalFields.projectId || additionalFields.projectId === null) {
			body.project = { id: additionalFields.projectId };
		}

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
