import { INodeProperties } from 'n8n-workflow';

export const goodsReceiptFields: INodeProperties[] = [
	// ----------------------------------
	//         goodsReceipt:createForPurchaseOrder
	// ----------------------------------
	{
		displayName: 'Purchase Order ID',
		name: 'purchaseOrderId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['goodsReceipt'],
				operation: ['createForPurchaseOrder'],
			},
		},
		description: 'The ID of the purchase order to create a goods receipt for',
	},
	{
		displayName: 'Received Items',
		name: 'receivedItems',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['goodsReceipt'],
				operation: ['createForPurchaseOrder'],
			},
		},
		options: [
			{
				displayName: 'Items (JSON)',
				name: 'items',
				type: 'json',
				default: '[]',
				description: 'JSON array of received items with productId and quantity',
			},
		],
	},

	// ----------------------------------
	//         goodsReceipt:createForReturn
	// ----------------------------------
	{
		displayName: 'Return ID',
		name: 'returnId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['goodsReceipt'],
				operation: ['createForReturn'],
			},
		},
		description: 'The ID of the return to create a goods receipt for',
	},
];
