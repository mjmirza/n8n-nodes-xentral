import type { INodeProperties } from 'n8n-workflow';

export const deliveryNoteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deliveryNote'],
			},
		},
		options: [
			{
				name: 'Add Line Item',
				value: 'addLineItem',
				description: 'Add a product line item to a delivery note',
				action: 'Add line item to delivery note',
			},
			{
				name: 'Attach File',
				value: 'attachFile',
				description: 'Attach a file to a delivery note',
				action: 'Attach file to delivery note',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a delivery note',
				action: 'Cancel a delivery note',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new delivery note (Lieferschein)',
				action: 'Create a delivery note',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a delivery note',
				action: 'Delete a delivery note',
			},
			{
				name: 'Delete Line Item',
				value: 'deleteLineItem',
				description: 'Delete a line item from a delivery note',
				action: 'Delete line item from delivery note',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a delivery note by ID',
				action: 'Get a delivery note',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many delivery notes',
				action: 'Get many delivery notes',
			},
			{
				name: 'Log Activity',
				value: 'logActivity',
				description: 'Log an activity on a delivery note',
				action: 'Log activity on delivery note',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release a delivery note (freigeben)',
				action: 'Release a delivery note',
			},
			{
				name: 'Remove Write Protection',
				value: 'removeWriteProtection',
				description: 'Remove write protection from a delivery note',
				action: 'Remove write protection from delivery note',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send a delivery note to the customer',
				action: 'Send a delivery note',
			},
			{
				name: 'Set Write Protection',
				value: 'setWriteProtection',
				description: 'Set write protection on a delivery note',
				action: 'Set write protection on delivery note',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a delivery note',
				action: 'Update a delivery note',
			},
			{
				name: 'Update Line Item',
				value: 'updateLineItem',
				description: 'Update a line item of a delivery note',
				action: 'Update line item of delivery note',
			},
		],
		default: 'create',
	},
];
