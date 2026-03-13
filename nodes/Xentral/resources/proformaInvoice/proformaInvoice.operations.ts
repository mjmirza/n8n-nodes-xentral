import type { INodeProperties } from 'n8n-workflow';

export const proformaInvoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['proformaInvoice'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new proforma invoice',
				action: 'Create a proforma invoice',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a proforma invoice by ID',
				action: 'Get a proforma invoice',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many proforma invoices',
				action: 'Get many proforma invoices',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a proforma invoice',
				action: 'Update a proforma invoice',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a proforma invoice',
				action: 'Delete a proforma invoice',
			},
			{
				name: 'Add Line Item',
				value: 'addLineItem',
				description: 'Add a product line item to a proforma invoice',
				action: 'Add line item to proforma invoice',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release a proforma invoice (freigeben)',
				action: 'Release a proforma invoice',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send a proforma invoice to the customer',
				action: 'Send a proforma invoice',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a proforma invoice',
				action: 'Cancel a proforma invoice',
			},
	{
				name: 'Update Line Item',
				value: 'updateLineItem',
				description: 'Update a line item of a proforma invoice',
				action: 'Update line item of proforma invoice',
			},
			{
				name: 'Delete Line Item',
				value: 'deleteLineItem',
				description: 'Delete a line item from a proforma invoice',
				action: 'Delete line item from proforma invoice',
			},
			{
				name: 'Log Activity',
				value: 'logActivity',
				description: 'Log an activity on a proforma invoice',
				action: 'Log activity on proforma invoice',
			},
			{
				name: 'Set Write Protection',
				value: 'setWriteProtection',
				description: 'Set write protection on a proforma invoice',
				action: 'Set write protection on proforma invoice',
			},
			{
				name: 'Remove Write Protection',
				value: 'removeWriteProtection',
				description: 'Remove write protection from a proforma invoice',
				action: 'Remove write protection from proforma invoice',
			},
			{
				name: 'Attach File',
				value: 'attachFile',
				description: 'Attach a file to a proforma invoice',
				action: 'Attach file to proforma invoice',
			},
		],
		default: 'create',
	},
];
