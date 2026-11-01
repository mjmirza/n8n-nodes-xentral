// Lints a source checkout and an unpacked tarball with n8n's community package scanner.
// Usage: node scan-preflight.mjs <scanner.mjs> <source-dir> <package-dir>
import { pathToFileURL } from 'node:url';

const [scannerPath, sourceDir, packageDir] = process.argv.slice(2);
if (!scannerPath || !sourceDir || !packageDir) {
	console.error('Usage: node scan-preflight.mjs <scanner.mjs> <source-dir> <package-dir>');
	process.exit(2);
}

const { analyzePackage, SOURCE_FILE_PATTERNS } = await import(pathToFileURL(scannerPath).href);
if (typeof analyzePackage !== 'function' || !Array.isArray(SOURCE_FILE_PATTERNS)) {
	console.error('The installed scanner does not expose analyzePackage, so the preflight cannot run.');
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
		console.log(`preflight ${name}: passed`);
		continue;
	}
	failed = true;
	console.error(`preflight ${name}: failed. ${result.message ?? ''}`);
	if (result.details) console.error(result.details);
}

if (failed) process.exit(1);
console.log('Preflight scan passed all security checks');
