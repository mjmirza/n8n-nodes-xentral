import type { INodeProperties } from 'n8n-workflow';

export const creditNoteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['creditNote'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new credit note (Gutschrift)',
				action: 'Create a credit note',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a credit note by ID',
				action: 'Get a credit note',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many credit notes',
				action: 'Get many credit notes',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a credit note',
				action: 'Update a credit note',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a credit note',
				action: 'Delete a credit note',
			},
			{
				name: 'Add Line Item',
				value: 'addLineItem',
				description: 'Add a product line item to a credit note',
				action: 'Add line item to credit note',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release a credit note (freigeben)',
				action: 'Release a credit note',
			},
			{
				name: 'Update Line Item',
				value: 'updateLineItem',
				description: 'Update a line item of a credit note',
				action: 'Update line item of credit note',
			},
			{
				name: 'Delete Line Item',
				value: 'deleteLineItem',
				description: 'Delete a line item from a credit note',
				action: 'Delete line item from credit note',
			},
			{
				name: 'Log Activity',
				value: 'logActivity',
				description: 'Log an activity on a credit note',
				action: 'Log activity on credit note',
			},
			{
				name: 'Set Write Protection',
				value: 'setWriteProtection',
				description: 'Set write protection on a credit note',
				action: 'Set write protection on credit note',
			},
			{
				name: 'Remove Write Protection',
				value: 'removeWriteProtection',
				description: 'Remove write protection from a credit note',
				action: 'Remove write protection from credit note',
			},
			{
				name: 'Attach File',
				value: 'attachFile',
				description: 'Attach a file to a credit note',
				action: 'Attach file to credit note',
			},
		],
		default: 'create',
	},
];
