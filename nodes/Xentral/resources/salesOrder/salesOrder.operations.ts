import type { INodeProperties } from 'n8n-workflow';

export const salesOrderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['salesOrder'],
			},
		},
		options: [
			{
				name: 'Add Line Item',
				value: 'addLineItem',
				description: 'Add a product line item to a sales order',
				action: 'Add line item to sales order',
			},
			{
				name: 'Attach File',
				value: 'attachFile',
				description: 'Attach a file to a sales order',
				action: 'Attach file to sales order',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a sales order',
				action: 'Cancel a sales order',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new sales order (Auftrag)',
				action: 'Create a sales order',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a sales order',
				action: 'Delete a sales order',
			},
			{
				name: 'Delete Line Item',
				value: 'deleteLineItem',
				description: 'Delete a line item from a sales order',
				action: 'Delete line item from sales order',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a sales order by ID',
				action: 'Get a sales order',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many sales orders',
				action: 'Get many sales orders',
			},
			{
				name: 'Log Activity',
				value: 'logActivity',
				description: 'Log an activity on a sales order',
				action: 'Log activity on sales order',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release a sales order (freigeben)',
				action: 'Release a sales order',
			},
			{
				name: 'Remove Write Protection',
				value: 'removeWriteProtection',
				description: 'Remove write protection from a sales order',
				action: 'Remove write protection from sales order',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send a sales order to the customer',
				action: 'Send a sales order',
			},
			{
				name: 'Set Write Protection',
				value: 'setWriteProtection',
				description: 'Set write protection on a sales order',
				action: 'Set write protection on sales order',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a sales order',
				action: 'Update a sales order',
			},
			{
				name: 'Update Line Item',
				value: 'updateLineItem',
				description: 'Update a line item of a sales order',
				action: 'Update line item of sales order',
			},
		],
		default: 'create',
	},
];
