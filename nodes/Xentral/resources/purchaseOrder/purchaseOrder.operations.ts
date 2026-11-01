import type { INodeProperties } from 'n8n-workflow';

export const purchaseOrderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['purchaseOrder'],
			},
		},
		options: [
			{
				name: 'Add Line Item',
				value: 'addLineItem',
				description: 'Add a product line item to a purchase order',
				action: 'Add line item to purchase order',
			},
			{
				name: 'Attach File',
				value: 'attachFile',
				description: 'Attach a file to a purchase order',
				action: 'Attach file to purchase order',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a purchase order',
				action: 'Cancel a purchase order',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new purchase order (Bestellung)',
				action: 'Create a purchase order',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a purchase order',
				action: 'Delete a purchase order',
			},
			{
				name: 'Delete Line Item',
				value: 'deleteLineItem',
				description: 'Delete a line item from a purchase order',
				action: 'Delete line item from purchase order',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a purchase order by ID',
				action: 'Get a purchase order',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many purchase orders',
				action: 'Get many purchase orders',
			},
			{
				name: 'Log Activity',
				value: 'logActivity',
				description: 'Log an activity on a purchase order',
				action: 'Log activity on purchase order',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release a purchase order (freigeben)',
				action: 'Release a purchase order',
			},
			{
				name: 'Remove Write Protection',
				value: 'removeWriteProtection',
				description: 'Remove write protection from a purchase order',
				action: 'Remove write protection from purchase order',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send a purchase order to the supplier',
				action: 'Send a purchase order',
			},
			{
				name: 'Set Write Protection',
				value: 'setWriteProtection',
				description: 'Set write protection on a purchase order',
				action: 'Set write protection on purchase order',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a purchase order',
				action: 'Update a purchase order',
			},
			{
				name: 'Update Line Item',
				value: 'updateLineItem',
				description: 'Update a line item of a purchase order',
				action: 'Update line item of purchase order',
			},
		],
		default: 'create',
	},
];
