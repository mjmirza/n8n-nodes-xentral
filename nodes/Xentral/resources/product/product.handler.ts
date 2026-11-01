import type { INode, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll, assertSafeId, assertNonEmpty, assertNonEmptyBody } from '../../transport';
import { runProductSearch } from './product.search';

/**
 * Build the product body from a flat field map (used for both create and update).
 * Handles object refs (project, category, manufacturer, standardSupplier, variantOf),
 * measurements object, tags array, freeFields JSON, and discount object.
 */
function buildProductBody(node: INode, fields: IDataObject): IDataObject {
	const body: IDataObject = {};

	// Simple string/boolean/number fields that map 1:1 to the API
	const directFields = [
		'ageRating',
		'allowPurchaseFromAllSuppliers',
		'countryOfOrigin',
		'customsTariffNumber',
		'description',
		'disabledReason',
		'ean',
		'hasBatches',
		'hasBestBeforeDate',
		'hasBillOfMaterials',
		'hideJustInTimeItemsOnDocuments',
		'hidePriceOnDocuments',
		'internalComment',
		'isAssembledJustInTime',
		'isDisabled',
		'isExternallyProduced',
		'isMatrixProduct',
		'isProductionProduct',
		'isShippingCostsProduct',
		'isStockItem',
		'isStockTakingDisabled',
		'minimumOrderQuantity',
		'minimumStorageQuantity',
		'name',
		'number',
		'regionOfOrigin',
		'salesTax',
		'serialNumbersMode',
		'shopPriceDisplay',
		'shortDescription',
	];

	for (const key of directFields) {
		if (fields[key] !== undefined && fields[key] !== '') {
			body[key] = fields[key];
		}
	}

	// Object refs
	if (fields.projectId !== undefined && fields.projectId !== '') {
		body.project = { id: fields.projectId };
	}
	if (fields.categoryId !== undefined && fields.categoryId !== '') {
		body.category = { id: fields.categoryId };
	}
	if (fields.standardSupplierId !== undefined && fields.standardSupplierId !== '') {
		body.standardSupplier = { id: fields.standardSupplierId };
	}
	if (fields.variantOfId !== undefined && fields.variantOfId !== '') {
		body.variantOf = { id: fields.variantOfId };
	}

	// Manufacturer object
	if (fields.manufacturerName !== undefined && fields.manufacturerName !== ''
		|| fields.manufacturerNumber !== undefined && fields.manufacturerNumber !== ''
		|| fields.manufacturerLink !== undefined && fields.manufacturerLink !== '') {
		const manufacturer: IDataObject = {};
		if (fields.manufacturerName !== undefined && fields.manufacturerName !== '') {
			manufacturer.name = fields.manufacturerName;
		}
		if (fields.manufacturerNumber !== undefined && fields.manufacturerNumber !== '') {
			manufacturer.number = fields.manufacturerNumber;
		}
		if (fields.manufacturerLink !== undefined && fields.manufacturerLink !== '') {
			manufacturer.link = fields.manufacturerLink;
		}
		body.manufacturer = manufacturer;
	}

	// Measurements object (weight, width, height, length, netWeight) -- each as { value, unit }
	const weight = fields.weight as number | undefined;
	const width = fields.width as number | undefined;
	const height = fields.height as number | undefined;
	const length = fields.length as number | undefined;
	const netWeight = fields.netWeight as number | undefined;
	if (weight !== undefined || width !== undefined || height !== undefined || length !== undefined || netWeight !== undefined) {
		const measurements: IDataObject = {};
		if (weight !== undefined) {
			measurements.weight = {
				value: weight,
				unit: (fields.weightUnit as string) || 'kg',
			};
		}
		if (width !== undefined) {
			measurements.width = {
				value: width,
				unit: (fields.widthUnit as string) || 'cm',
			};
		}
		if (height !== undefined) {
			measurements.height = {
				value: height,
				unit: (fields.heightUnit as string) || 'cm',
			};
		}
		if (length !== undefined) {
			measurements.length = {
				value: length,
				unit: (fields.lengthUnit as string) || 'cm',
			};
		}
		if (netWeight !== undefined) {
			measurements.netWeight = {
				value: netWeight,
				unit: (fields.netWeightUnit as string) || 'kg',
			};
		}
		body.measurements = measurements;
	}

	// Discount object
	if (fields.discountPercentage !== undefined || fields.isDiscountProduct !== undefined) {
		const discount: IDataObject = {};
		if (fields.discountPercentage !== undefined) {
			discount.discountPercentage = fields.discountPercentage;
		}
		if (fields.isDiscountProduct !== undefined) {
			discount.isDiscountProduct = fields.isDiscountProduct;
		}
		body.discount = discount;
	}

	// Tags: comma-separated string to array of objects (V1 API expects { name: string } at minimum)
	if (fields.tags !== undefined && fields.tags !== '') {
		const tagString = fields.tags as string;
		body.tags = tagString.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '').map((t: string) => ({ name: t }));
	}

	// Free fields: JSON string to array
	if (fields.freeFields !== undefined && fields.freeFields !== '') {
		try {
			body.freeFields = JSON.parse(fields.freeFields as string);
		} catch {
			throw new NodeOperationError(node, 'Free Fields must be valid JSON (expected an array)');
		}
	}

	// Calculated purchase price object
	if (fields.hasCalculatedPurchasePrice !== undefined
		|| fields.calculatedPurchasePriceAmount !== undefined
		|| fields.calculatedPurchasePriceCurrency !== undefined) {
		const calculatedPurchasePrice: IDataObject = {};
		if (fields.hasCalculatedPurchasePrice !== undefined) {
			calculatedPurchasePrice.hasCalculatedPurchasePrice = fields.hasCalculatedPurchasePrice;
		}
		if (fields.calculatedPurchasePriceAmount !== undefined || fields.calculatedPurchasePriceCurrency !== undefined) {
			const price: IDataObject = {};
			if (fields.calculatedPurchasePriceAmount !== undefined) {
				price.amount = fields.calculatedPurchasePriceAmount;
			}
			if (fields.calculatedPurchasePriceCurrency !== undefined && fields.calculatedPurchasePriceCurrency !== '') {
				price.currency = fields.calculatedPurchasePriceCurrency;
			}
			calculatedPurchasePrice.price = price;
		}
		body.calculatedPurchasePrice = calculatedPurchasePrice;
	}

	// Stock taking object
	if (fields.hasStockTakingValue !== undefined || fields.stockTakingValue !== undefined) {
		const stockTaking: IDataObject = {};
		if (fields.hasStockTakingValue !== undefined) {
			stockTaking.hasStockTakingValue = fields.hasStockTakingValue;
		}
		if (fields.stockTakingValue !== undefined) {
			stockTaking.stockTakingValue = fields.stockTakingValue;
		}
		body.stockTaking = stockTaking;
	}

	// Options: JSON string to array (matrix product options)
	if (fields.options !== undefined && fields.options !== '') {
		try {
			body.options = JSON.parse(fields.options as string);
		} catch {
			throw new NodeOperationError(node, 'Options must be valid JSON (expected an array)');
		}
	}

	// Variants: JSON string to array (create only)
	if (fields.variants !== undefined && fields.variants !== '') {
		try {
			body.variants = JSON.parse(fields.variants as string);
		} catch {
			throw new NodeOperationError(node, 'Variants must be valid JSON (expected an array)');
		}
	}

	// Selected options: JSON string to array (update only)
	if (fields.selectedOptions !== undefined && fields.selectedOptions !== '') {
		try {
			body.selectedOptions = JSON.parse(fields.selectedOptions as string);
		} catch {
			throw new NodeOperationError(node, 'Selected Options must be valid JSON (expected an array)');
		}
	}

	return body;
}

export async function handleProduct(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = assertNonEmpty(this.getNodeParameter('name', itemIndex) as string, 'Product Name');
		const projectId = assertNonEmpty(this.getNodeParameter('projectId', itemIndex) as string, 'Project ID');
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body = buildProductBody(this.getNode(), { name, projectId, ...additionalFields });
		return xentralRequest.call(this, 'POST', 'products', body as IDataObject, {}, 'v1');
	}

	if (operation === 'get') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
		return xentralRequest.call(this, 'GET', `products/${productId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		return xentralV1PageGetAll.call(this, 'products', {}, limit, maxPages);
	}

	if (operation === 'update') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body = buildProductBody(this.getNode(), updateFields);
		assertNonEmptyBody(body, 'product update');
		return xentralRequest.call(this, 'PATCH', `products/${productId}`, body as IDataObject, {}, 'v1');
	}

	if (operation === 'delete') {
		const productId = this.getNodeParameter('productId', itemIndex) as string;
		assertSafeId(productId, 'productId');
		return xentralRequest.call(this, 'DELETE', `products/${productId}`, {}, {}, 'v1');
	}

	if (operation === 'search') {
		const searchTerm = (this.getNodeParameter('searchTerm', itemIndex) as string).trim();
		if (!searchTerm) {
			return [];
		}
		const returnAll = this.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex, 50) as number);
		const maxPages = returnAll ? (this.getNodeParameter('maxPages', itemIndex, 1000) as number) : undefined;
		// Matches article number, EAN and name, as the field description promises.
		return runProductSearch(
			(query, pageLimit) => xentralV1PageGetAll.call(this, 'products', query, pageLimit, maxPages),
			searchTerm,
			limit,
		);
	}

	throw new Error(`Unknown product operation: ${operation}`);
}
