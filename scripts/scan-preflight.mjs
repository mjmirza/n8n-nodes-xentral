// Lints a source checkout and an unpacked tarball with n8n's community package scanner.
// Usage: node scan-preflight.mjs <scanner.mjs> <source-dir> <package-dir>
import { pathToFileURL } from 'node:url';

const [scannerPath, sourceDir, packageDir] = process.argv.slice(2);
if (!scannerPath || !sourceDir || !packageDir) {
	process.stderr.write('Usage: node scan-preflight.mjs <scanner.mjs> <source-dir> <package-dir>\n');
	process.exit(2);
}

const { analyzePackage, SOURCE_FILE_PATTERNS } = await import(pathToFileURL(scannerPath).href);
if (typeof analyzePackage !== 'function' || !Array.isArray(SOURCE_FILE_PATTERNS)) {
	process.stderr.write('The installed scanner does not expose analyzePackage, so the preflight cannot run.\n');
	process.exit(2);
}

// The same two legs the registry scan runs, with the same file patterns.
const legs = [
	['source', await analyzePackage(sourceDir, SOURCE_FILE_PATTERNS)],
	['tarball', await analyzePackage(packageDir, ['**/*.js', 'package.json'])],
];

let failed = false;
for (const [name, result] of legs) {
	if (result.passed && result.message !== 'No files found to analyze') {
		process.stdout.write(`preflight ${name}: passed\n`);
		continue;
	}
	failed = true;
	process.stderr.write(`preflight ${name}: failed. ${result.message ?? ''}\n`);
	if (result.details) process.stderr.write(`${result.details}\n`);
}

if (failed) process.exit(1);
process.stdout.write('Preflight scan passed all security checks\n');
