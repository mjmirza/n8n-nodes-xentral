// Copies node and credential icons and node codex files next to the compiled output.
import { cpSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function copySvgs(srcDir, outDir) {
	for (const entry of readdirSync(srcDir)) {
		const src = join(srcDir, entry);
		if (statSync(src).isDirectory()) copySvgs(src, join(outDir, entry));
		else if (entry.endsWith('.svg') || entry.endsWith('.node.json')) cpSync(src, join(outDir, entry));
	}
}

copySvgs('nodes', 'dist/nodes');
copySvgs('credentials', 'dist/credentials');
