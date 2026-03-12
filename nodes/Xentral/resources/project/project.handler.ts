import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { xentralRequest, xentralV1PageGetAll } from '../../transport';

export async function handleProject(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const name = this.getNodeParameter('name', itemIndex) as string;
		const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = { name };

		if (additionalFields.description) body.description = additionalFields.description;
		if (additionalFields.customerId) body.customerId = additionalFields.customerId;
		if (additionalFields.startDate) body.startDate = additionalFields.startDate;
		if (additionalFields.endDate) body.endDate = additionalFields.endDate;
		if (additionalFields.status) body.status = additionalFields.status;
		if (additionalFields.budget) body.budget = additionalFields.budget;

		return xentralRequest.call(this, 'POST', 'projects', body, {}, 'v1');
	}

	if (operation === 'get') {
		const projectId = this.getNodeParameter('projectId', itemIndex) as string;
		return xentralRequest.call(this, 'GET', `projects/${projectId}`, {}, {}, 'v1');
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
		const limit = returnAll ? undefined : (this.getNodeParameter('limit', itemIndex) as number);
		return xentralV1PageGetAll.call(this, 'projects', {}, limit);
	}

	if (operation === 'update') {
		const projectId = this.getNodeParameter('projectId', itemIndex) as string;
		const updateFields = this.getNodeParameter('updateFields', itemIndex, {}) as IDataObject;

		const body: IDataObject = {};

		if (updateFields.name) body.name = updateFields.name;
		if (updateFields.description) body.description = updateFields.description;
		if (updateFields.customerId) body.customerId = updateFields.customerId;
		if (updateFields.startDate) body.startDate = updateFields.startDate;
		if (updateFields.endDate) body.endDate = updateFields.endDate;
		if (updateFields.status) body.status = updateFields.status;
		if (updateFields.budget) body.budget = updateFields.budget;

		return xentralRequest.call(this, 'PATCH', `projects/${projectId}`, body, {}, 'v1');
	}

	if (operation === 'delete') {
		const projectId = this.getNodeParameter('projectId', itemIndex) as string;
		return xentralRequest.call(this, 'DELETE', `projects/${projectId}`, {}, {}, 'v1');
	}

	throw new Error(`Unknown project operation: ${operation}`);
}
