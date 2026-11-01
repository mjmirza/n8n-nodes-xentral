import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { SPEC_PRODUCT_EXTRAS, specOperationOptions } from '../specDriven/spec.description';

const baseProductOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['product'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new product',
				action: 'Create a product',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a product',
				action: 'Delete a product',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a product by ID',
				action: 'Get a product',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many products',
				action: 'Get many products',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search products by name or article number',
				action: 'Search products',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a product',
				action: 'Update a product',
			},
			],
		default: 'getAll',
	},
];

/** The base product operations plus the extra read operations generated from the Xentral spec. */
export const productOperations: INodeProperties[] = baseProductOperations.map((property) => ({
	...property,
	options: [
		...((property.options ?? []) as INodePropertyOptions[]),
		...(SPEC_PRODUCT_EXTRAS ? specOperationOptions(SPEC_PRODUCT_EXTRAS) : []),
	].sort((a, b) => a.name.localeCompare(b.name)),
}));
