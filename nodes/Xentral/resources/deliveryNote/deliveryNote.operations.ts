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
				name: 'Create',
				value: 'create',
				description: 'Create a new delivery note (Lieferschein)',
				action: 'Create a delivery note',
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
				name: 'Update',
				value: 'update',
				description: 'Update a delivery note',
				action: 'Update a delivery note',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a delivery note',
				action: 'Delete a delivery note',
			},
			{
				name: 'Add Line Item',
				value: 'addLineItem',
				description: 'Add a product line item to a delivery note',
				action: 'Add line item to delivery note',
			},
	{
				name: 'Update Line Item',
				value: 'updateLineItem',
				description: 'Update a line item of a delivery note',
				action: 'Update line item of delivery note',
			},
			{
				name: 'Delete Line Item',
				value: 'deleteLineItem',
				description: 'Delete a line item from a delivery note',
				action: 'Delete line item from delivery note',
			},
		],
		default: 'create',
	},
];
