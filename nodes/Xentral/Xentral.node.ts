import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	xentralApiRequest,
	xentralApiRequestAllItems,
	xentralApiRequestV3,
} from './GenericFunctions';

import { customerOperations } from './resources/customer/customer.operations';
import { customerFields } from './resources/customer/customer.fields';
import { productOperations } from './resources/product/product.operations';
import { productFields } from './resources/product/product.fields';
import { offerOperations } from './resources/offer/offer.operations';
import { offerFields } from './resources/offer/offer.fields';

export class Xentral implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Xentral',
		name: 'xentral',
		icon: 'file:xentral.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Xentral ERP API',
		defaults: {
			name: 'Xentral',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'xentralApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Offer (Angebot)',
						value: 'offer',
					},
					{
						name: 'Product',
						value: 'product',
					},
				],
				default: 'offer',
			},
			// Customer
			...customerOperations,
			...customerFields,
			// Product
			...productOperations,
			...productFields,
			// Offer
			...offerOperations,
			...offerFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ==========================================
				//              CUSTOMER
				// ==========================================
				if (resource === 'customer') {
					if (operation === 'create') {
						const companyName = this.getNodeParameter('companyName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						// Xentral V1 customer schema: {type, general: {name, address: {...}}}
						const body: IDataObject = {
							type: 'company',
							general: {
								name: companyName,
								address: {
									street: additionalFields.street || '',
									zip: additionalFields.zipCode || '',
									city: additionalFields.city || '',
									country: additionalFields.country || 'DE',
								},
							},
						};

						responseData = await xentralApiRequest.call(this, 'POST', '/customers', body);

					} else if (operation === 'get') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						responseData = await xentralApiRequest.call(this, 'GET', `/customer/${customerId}`);

					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							const items = await xentralApiRequestAllItems.call(this, 'GET', '/customers');
							responseData = items;
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await xentralApiRequest.call(
								this, 'GET', '/customers', {}, { per_page: limit },
							);
						}

					} else if (operation === 'search') {
						const searchTerm = this.getNodeParameter('searchTerm', i) as string;
						responseData = await xentralApiRequest.call(
							this, 'GET', '/customers', {}, { 'filter[name]': searchTerm },
						);

					} else if (operation === 'update') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await xentralApiRequest.call(
							this, 'PATCH', `/customer/${customerId}`, updateFields,
						);

					} else if (operation === 'delete') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						responseData = await xentralApiRequest.call(this, 'DELETE', `/customer/${customerId}`);
					}
				}

				// ==========================================
				//              PRODUCT
				// ==========================================
				else if (resource === 'product') {
					if (operation === 'create') {
						const productName = this.getNodeParameter('productName', i) as string;
						const articleNumber = this.getNodeParameter('articleNumber', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name: productName,
							...(articleNumber && { articleNumber }),
							...additionalFields,
						};

						responseData = await xentralApiRequest.call(this, 'POST', '/products', body);

					} else if (operation === 'get') {
						const productId = this.getNodeParameter('productId', i) as string;
						responseData = await xentralApiRequest.call(this, 'GET', `/product/${productId}`);

					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							const items = await xentralApiRequestAllItems.call(this, 'GET', '/products');
							responseData = items;
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await xentralApiRequest.call(
								this, 'GET', '/products', {}, { per_page: limit },
							);
						}

					} else if (operation === 'search') {
						const searchTerm = this.getNodeParameter('searchTerm', i) as string;
						responseData = await xentralApiRequest.call(
							this, 'GET', '/products', {}, { 'filter[name]': searchTerm },
						);

					} else if (operation === 'update') {
						const productId = this.getNodeParameter('productId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await xentralApiRequest.call(
							this, 'PATCH', `/product/${productId}`, updateFields,
						);

					} else if (operation === 'delete') {
						const productId = this.getNodeParameter('productId', i) as string;
						responseData = await xentralApiRequest.call(this, 'DELETE', `/product/${productId}`);

					} else if (operation === 'getStock') {
						const productId = this.getNodeParameter('productId', i) as string;
						responseData = await xentralApiRequest.call(this, 'GET', `/product/${productId}/stock`);
					}
				}

				// ==========================================
				//              OFFER (Angebot) - V3 API
				// ==========================================
				else if (resource === 'offer') {
					if (operation === 'create') {
						const customerId = this.getNodeParameter('customerId', i) as string;
						const language = this.getNodeParameter('language', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							address: { id: customerId },
							language,
							...additionalFields,
						};

						responseData = await xentralApiRequestV3.call(this, 'POST', '/offers', body);

					} else if (operation === 'get') {
						const offerId = this.getNodeParameter('offerId', i) as string;
						responseData = await xentralApiRequestV3.call(this, 'GET', `/offers/${offerId}`);

					} else if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const query: IDataObject = { ...filters };

						if (returnAll) {
							const items = await xentralApiRequestAllItems.call(
								this, 'GET', '/offers', {}, query, 'v3',
							);
							responseData = items;
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.per_page = limit;
							responseData = await xentralApiRequestV3.call(this, 'GET', '/offers', {}, query);
						}

					} else if (operation === 'update') {
						const offerId = this.getNodeParameter('offerId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						responseData = await xentralApiRequestV3.call(
							this, 'PATCH', `/offers/${offerId}`, updateFields,
						);

					} else if (operation === 'delete') {
						const offerId = this.getNodeParameter('offerId', i) as string;
						responseData = await xentralApiRequestV3.call(this, 'DELETE', `/offers/${offerId}`);

					} else if (operation === 'addLineItem') {
						const offerId = this.getNodeParameter('offerId', i) as string;
						const productId = this.getNodeParameter('productId', i) as string;
						const quantity = this.getNodeParameter('quantity', i) as number;
						const lineItemOptions = this.getNodeParameter('lineItemOptions', i, {}) as IDataObject;

						const body: IDataObject = {
							product: { id: productId },
							quantity,
							...lineItemOptions,
						};

						responseData = await xentralApiRequestV3.call(
							this, 'POST', `/offers/${offerId}/lineitems`, body,
						);

					} else if (operation === 'release') {
						const offerId = this.getNodeParameter('offerId', i) as string;
						responseData = await xentralApiRequestV3.call(
							this, 'POST', `/offers/${offerId}/actions/release`, {},
						);

					} else if (operation === 'send') {
						const offerId = this.getNodeParameter('offerId', i) as string;
						responseData = await xentralApiRequestV3.call(
							this, 'POST', `/offers/${offerId}/actions/send`, {},
						);

					} else if (operation === 'cancel') {
						const offerId = this.getNodeParameter('offerId', i) as string;
						responseData = await xentralApiRequestV3.call(
							this, 'POST', `/offers/${offerId}/actions/cancel`, {},
						);
					}
				}

				// Format output
				const executionData = Array.isArray(responseData)
					? responseData.map((item) => ({ json: item }))
					: [{ json: responseData as IDataObject }];

				returnData.push(...executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
