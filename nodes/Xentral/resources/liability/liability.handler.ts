import type { IExecuteFunctions, IDataObject, INode } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, xentralFileUpload, assertSafeId } from '../../transport';

// Xentral accepts open or paid. Saved workflows hold the old uppercase values, mapped here;
// a partially paid liability is still open.
function liabilityStatus(node: INode, value: unknown): string {
	const v = String(value ?? '').trim();
	const mapped: Record<string, string> = { PENDING: 'open', PARTIALLY_PAID: 'open', PAID: 'paid', OPEN: 'open', open: 'open', paid: 'paid' };
	if (mapped[v]) return mapped[v];
	// CANCELLED was offered before 1.4.5 but Xentral has no cancelled status, so it still stops here.
	throw new NodeOperationError(node, `Liability status "${v}" is not supported. Xentral accepts open or paid.`);
}

export async function handleLiability(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const supplierId = this.getNodeParameter('supplierId', itemIndex) as string;
		assertSafeId(supplierId, 'supplierId');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {
			supplier: { id: supplierId },
		};

		// Simple fields
		const simpleFields = [
			'bookingText', 'clarificationCase', 'clarificationReason', 'date',
			'internalComment', 'invoiceRelease', 'receiptDate', 'release',
			'serviceDate', 'status', 'supplierInvoiceNumber',
		];
		for (const field of simpleFields) {
			if (additionalFields[field] !== undefined) body[field] = additionalFields[field];
		}
		if (body.status !== undefined) body.status = liabilityStatus(this.getNode(), body.status);

		// Project ref
		if (additionalFields.projectId !== undefined) {
			assertSafeId(additionalFields.projectId as string, 'projectId');
			body.project = { id: additionalFields.projectId };
		}

		// JSON fields (complex objects passed as JSON strings)
		const jsonFields: Array<[string, string]> = [
			['financialsJson', 'financials'],
			['paymentJson', 'payment'],
			['paymentTermsJson', 'paymentTerms'],
			['positionsJson', 'positions'],
			['accountingJson', 'accounting'],
			['assignedPurchaseOrdersJson', 'assignedPurchaseOrders'],
		];
		for (const [paramName, apiField] of jsonFields) {
			if (additionalFields[paramName] !== undefined) {
				const val = additionalFields[paramName];
				if (typeof val === 'string' && val.trim() !== '' && val.trim() !== '{}' && val.trim() !== '[]') {
					try {
						body[apiField] = JSON.parse(val);
					} catch {
						throw new NodeOperationError(this.getNode(), `Invalid JSON in ${apiField}. Please provide valid JSON.`);
					}
				} else if (typeof val === 'object') {
					body[apiField] = val;
				}
			}
		}

		return xentralRequest.call(this, 'POST', 'liabilities', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const liabilityId = this.getNodeParameter('liabilityId', itemIndex) as string;
		assertSafeId(liabilityId, 'liabilityId');
		return xentralRequest.call(this, 'GET', `liabilities/${liabilityId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'liabilities', {}, limit, maxPages);
	}

	if (operation === 'release') {
		const liabilityId = this.getNodeParameter('liabilityId', itemIndex) as string;
		assertSafeId(liabilityId, 'liabilityId');
		return xentralRequest.call(this, 'PATCH', `liabilities/${liabilityId}/actions/release`, {} as IDataObject, {}, 'v1');
	}

	if (operation === 'uploadDocument') {
		const liabilityId = this.getNodeParameter('liabilityId', itemIndex) as string;
		assertSafeId(liabilityId, 'liabilityId');
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
		return xentralFileUpload.call(this, `liabilities/${liabilityId}/documents`, binaryPropertyName, itemIndex, 'v1');
	}

	throw new Error(`Unknown liability operation: ${operation}`);
}
