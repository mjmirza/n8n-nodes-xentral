import type { INodeProperties } from 'n8n-workflow';

export const returnOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['return'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new return order (Retoure)',
				action: 'Create a return order',
			},
			{
				name: 'Create from Delivery Note',
				value: 'createFromDeliveryNote',
				description: 'Create a return order from an existing delivery note',
				action: 'Create return order from delivery note',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a return order by ID',
				action: 'Get a return order',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many return orders',
				action: 'Get many return orders',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a return order',
				action: 'Update a return order',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a return order',
				action: 'Delete a return order',
			},
			{
				name: 'Add Line Item',
				value: 'addLineItem',
				description: 'Add a product line item to a return order',
				action: 'Add line item to return order',
			},
			{
				name: 'Update Line Item',
				value: 'updateLineItem',
				description: 'Update a line item of a return order',
				action: 'Update line item of return order',
			},
			{
				name: 'Delete Line Item',
				value: 'deleteLineItem',
				description: 'Delete a line item from a return order',
				action: 'Delete line item from return order',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release a return order',
				action: 'Release a return order',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a return order',
				action: 'Cancel a return order',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send a return order',
				action: 'Send a return order',
			},
			{
				name: 'Log Activity',
				value: 'logActivity',
				description: 'Log an activity on a return order',
				action: 'Log activity on return order',
			},
			{
				name: 'Set Write Protection',
				value: 'setWriteProtection',
				description: 'Set write protection on a return order',
				action: 'Set write protection on return order',
			},
			{
				name: 'Remove Write Protection',
				value: 'removeWriteProtection',
				description: 'Remove write protection from a return order',
				action: 'Remove write protection from return order',
			},
			{
				name: 'Attach File',
				value: 'attachFile',
				description: 'Attach a file to a return order',
				action: 'Attach file to return order',
			},
		],
		default: 'getAll',
	},
];
