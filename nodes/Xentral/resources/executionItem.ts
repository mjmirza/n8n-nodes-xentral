import type { INodeExecutionData } from 'n8n-workflow';

/** A finished output item, for example one carrying binary data. The node passes it through unchanged. */
export class ExecutionItemResult {
	constructor(public readonly item: INodeExecutionData) {}
}
