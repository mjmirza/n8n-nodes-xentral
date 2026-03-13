import type { INodeProperties } from 'n8n-workflow';

export const offerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['offer'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new offer (Angebot)',
				action: 'Create an offer',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an offer by ID',
				action: 'Get an offer',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many offers',
				action: 'Get many offers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an offer',
				action: 'Update an offer',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an offer',
				action: 'Delete an offer',
			},
			{
				name: 'Add Line Item',
				value: 'addLineItem',
				description: 'Add a product line item to an offer',
				action: 'Add line item to offer',
			},
			{
				name: 'Release',
				value: 'release',
				description: 'Release an offer (freigeben) - makes it ready for review',
				action: 'Release an offer',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send an offer to the customer',
				action: 'Send an offer',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel an offer',
				action: 'Cancel an offer',
			},
			{
				name: 'Update Line Item',
				value: 'updateLineItem',
				description: 'Update a line item of an offer',
				action: 'Update line item of offer',
			},
			{
				name: 'Delete Line Item',
				value: 'deleteLineItem',
				description: 'Delete a line item from an offer',
				action: 'Delete line item from offer',
			},
			{
				name: 'Log Activity',
				value: 'logActivity',
				description: 'Log an activity on an offer',
				action: 'Log activity on offer',
			},
			{
				name: 'Set Write Protection',
				value: 'setWriteProtection',
				description: 'Set write protection on an offer',
				action: 'Set write protection on offer',
			},
			{
				name: 'Remove Write Protection',
				value: 'removeWriteProtection',
				description: 'Remove write protection from an offer',
				action: 'Remove write protection from offer',
			},
			{
				name: 'Attach File',
				value: 'attachFile',
				description: 'Attach a file to an offer',
				action: 'Attach file to offer',
			},
		],
		default: 'create',
	},
];
