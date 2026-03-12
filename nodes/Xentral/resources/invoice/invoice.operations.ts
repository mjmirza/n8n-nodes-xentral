import { INodeProperties } from 'n8n-workflow';

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
				name: 'Create',
				value: 'create',
				description: 'Create a new invoice (Rechnung)',
				action: 'Create an invoice',
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
				name: 'Update',
				value: 'update',
				description: 'Update an invoice',
				action: 'Update an invoice',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an invoice',
				action: 'Delete an invoice',
			},
			{
				name: 'Add Line Item',
				value: 'addLineItem',
				description: 'Add a product line item to an invoice',
				action: 'Add line item to invoice',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release an invoice (freigeben)',
				action: 'Release an invoice',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send an invoice to the customer',
				action: 'Send an invoice',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel an invoice',
				action: 'Cancel an invoice',
			},
			{
				name: 'Get Line Items',
				value: 'getLineItems',
				description: 'Get all line items of an invoice',
				action: 'Get line items of invoice',
			},
			{
				name: 'Update Line Item',
				value: 'updateLineItem',
				description: 'Update a line item of an invoice',
				action: 'Update line item of invoice',
			},
			{
				name: 'Delete Line Item',
				value: 'deleteLineItem',
				description: 'Delete a line item from an invoice',
				action: 'Delete line item from invoice',
			},
			{
				name: 'Log Activity',
				value: 'logActivity',
				description: 'Log an activity on an invoice',
				action: 'Log activity on invoice',
			},
			{
				name: 'Set Write Protection',
				value: 'setWriteProtection',
				description: 'Set write protection on an invoice',
				action: 'Set write protection on invoice',
			},
			{
				name: 'Remove Write Protection',
				value: 'removeWriteProtection',
				description: 'Remove write protection from an invoice',
				action: 'Remove write protection from invoice',
			},
			{
				name: 'Attach File',
				value: 'attachFile',
				description: 'Attach a file to an invoice',
				action: 'Attach file to invoice',
			},
		],
		default: 'create',
	},
];
