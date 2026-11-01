import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('[r9-1] example multi-item reads cannot fan out into unguarded downstream writes', () => {
	const directory = new URL('../examples/', import.meta.url);
	const files = fs.readdirSync(directory).filter((name) => name.endsWith('.json'));
	assert.ok(files.length > 0, 'Example workflows exist');
	const errors = [];
	for (const file of files) {
		const workflow = JSON.parse(fs.readFileSync(new URL(file, directory)));
		const nodes = new Map(workflow.nodes.map((node) => [node.name, node]));
		const targets = (name) => (workflow.connections[name]?.main ?? []).flat().map((edge) => edge.node);
		for (const source of workflow.nodes) {
			const params = source.parameters ?? {};
			if (!/^(getAll|search|list)/i.test(params.operation ?? '')) continue;
			if (source.executeOnce === true || (params.returnAll === false && params.limit === 1)) continue;
			const pending = [...targets(source.name)];
			const visited = new Set();
			while (pending.length > 0) {
				const name = pending.pop();
				if (visited.has(name)) continue;
				visited.add(name);
				const node = nodes.get(name);
				assert.ok(node, `${file}: connection target ${name} exists`);
				const operation = node.parameters?.operation;
				// Treat every operation other than a read as a write, including release,
				// addLineItem and logActivity, so new write operations are covered too.
				if (operation && !/^(get|search|list)/i.test(operation) && node.executeOnce !== true) {
					errors.push(`${file}: ${source.name} can fan out into ${name} (${operation}) without executeOnce`);
				}
				// Continue through guarded writes and intermediate reads to check every descendant.
				pending.push(...targets(name));
			}
		}
	}
	assert.deepEqual(errors, []);
});
