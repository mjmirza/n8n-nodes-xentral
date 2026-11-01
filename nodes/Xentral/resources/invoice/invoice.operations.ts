import type { INodeProperties } from 'n8n-workflow';

export const invoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
			},
		},
		options: [
			{
				name: 'Add Line Item',
				value: 'addLineItem',
				description: 'Add a product line item to an invoice',
				action: 'Add line item to invoice',
			},
			{
				name: 'Attach File',
				value: 'attachFile',
				description: 'Attach a file to an invoice',
				action: 'Attach file to invoice',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new invoice (Rechnung)',
				action: 'Create an invoice',
			},
			{
				name: 'Create From Sales Order',
				value: 'createFromSalesOrder',
				description: 'Create an invoice from an existing sales order',
				action: 'Create invoice from sales order',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an invoice',
				action: 'Delete an invoice',
			},
			{
				name: 'Delete Line Item',
				value: 'deleteLineItem',
				description: 'Delete a line item from an invoice',
				action: 'Delete line item from invoice',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an invoice by ID',
				action: 'Get an invoice',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many invoices',
				action: 'Get many invoices',
			},
			{
				name: 'Log Activity',
				value: 'logActivity',
				description: 'Log an activity on an invoice',
				action: 'Log activity on invoice',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release an invoice (freigeben)',
				action: 'Release an invoice',
			},
			{
				name: 'Remove Write Protection',
				value: 'removeWriteProtection',
				description: 'Remove write protection from an invoice',
				action: 'Remove write protection from invoice',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send an invoice',
				action: 'Send an invoice',
			},
			{
				name: 'Set Write Protection',
				value: 'setWriteProtection',
				description: 'Set write protection on an invoice',
				action: 'Set write protection on invoice',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an invoice',
				action: 'Update an invoice',
			},
			{
				name: 'Update Line Item',
				value: 'updateLineItem',
				description: 'Update a line item of an invoice',
				action: 'Update line item of invoice',
			},
		],
		default: 'create',
	},
];
