import type { INodeProperties } from 'n8n-workflow';

export const goodsReceiptOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['goodsReceipt'],
			},
		},
		options: [
			{
				name: 'Create for Purchase Order',
				value: 'createForPurchaseOrder',
				description: 'Create a goods receipt for a purchase order',
				action: 'Create goods receipt for purchase order',
			},
			{
				name: 'Create for Return',
				value: 'createForReturn',
				description: 'Create a goods receipt for a return order',
				action: 'Create goods receipt for return',
			},
		],
		default: 'createForPurchaseOrder',
	},
];
