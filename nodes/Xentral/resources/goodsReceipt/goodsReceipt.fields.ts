import type { INodeProperties } from 'n8n-workflow';

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
		displayName: 'Additional Fields',
		name: 'additionalFields',
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
				displayName: 'Date',
				name: 'date',
				type: 'string',
				default: '',
				description: 'The goods receipt date (ISO 8601 date string)',
			},
			{
				displayName: 'Positions (JSON)',
				name: 'positionsJson',
				type: 'json',
				default: '[]',
				description: 'Positions as a JSON array. Each position names a product, a quantity, and its stock movements per storage location. The hint below shows the exact shape.',
				hint: 'Example value [{"product": {"id": "123"}, "quantity": 5, "stockMovements": [{"storageLocation": {"id": "789"}, "quantity": 5}]}]',
			},
		],
	},

	// ----------------------------------
	//         goodsReceipt:createForReturn
	// ----------------------------------
	{
		displayName: 'Return Order ID',
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
		description: 'The ID of the return order to create a goods receipt for',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['goodsReceipt'],
				operation: ['createForReturn'],
			},
		},
		options: [
			{
				displayName: 'Date',
				name: 'date',
				type: 'string',
				default: '',
				description: 'The goods receipt date (ISO 8601 date string)',
			},
			{
				displayName: 'Positions (JSON)',
				name: 'positionsJson',
				type: 'json',
				default: '[]',
				description: 'Positions as a JSON array. Each position names a product, a quantity, and its stock movements per storage location. The hint below shows the exact shape.',
				hint: 'Example value [{"product": {"id": "123"}, "quantity": 5, "stockMovements": [{"storageLocation": {"id": "789"}, "quantity": 5}]}]',
			},
		],
	},
];
