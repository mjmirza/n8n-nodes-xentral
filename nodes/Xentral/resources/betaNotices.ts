import type { INodeProperties } from 'n8n-workflow';

export const BETA_NOTICE =
	'Xentral marks this endpoint as beta. It may change without notice, so test it before you rely on it in production.';

/** Hand-written operations whose endpoint Xentral marks x-beta. A test checks this against the specs. */
export const HANDWRITTEN_BETA_OPERATIONS: Record<string, string[]> = {
	deliveryNote: ['addLineItem', 'create', 'update', 'updateLineItem'],
	invoice: ['createFromSalesOrder'],
	production: ['create', 'get', 'getAll'],
	proformaInvoice: ['addLineItem', 'create', 'get', 'getAll', 'update', 'updateLineItem'],
	return: ['addLineItem', 'create', 'createFromDeliveryNote', 'update', 'updateLineItem'],
};

export const handwrittenBetaNotices: INodeProperties[] = Object.entries(HANDWRITTEN_BETA_OPERATIONS).map(
	([resource, operations]) => ({
		displayName: BETA_NOTICE,
		name: 'betaNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: [resource], operation: operations } },
	}),
);
