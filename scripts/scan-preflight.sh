#!/usr/bin/env bash
# Scans a packed tarball and its source with n8n's scanner BEFORE publish. Usage: scan-preflight.sh <tgz> [src].
# Provenance needs a published version, so scan-published.sh still runs afterwards.
set -euo pipefail

tarball="${1:?packed tarball required}"
source_dir="${2:-.}"
scanner_version="0.41.1"

if [ ! -f "$tarball" ]; then
	echo "tarball not found: $tarball" >&2
	exit 2
fi

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# SCANNER_DIR lets a machine reuse an installed copy, otherwise the pinned version is installed.
scanner_dir="${SCANNER_DIR:-}"
if [ -z "$scanner_dir" ]; then
	npm install --no-save --no-audit --no-fund --ignore-scripts --prefix "$work/scanner" \
		"@n8n/scan-community-package@${scanner_version}" >/dev/null
	scanner_dir="$work/scanner/node_modules/@n8n/scan-community-package"
fi

mkdir -p "$work/package"
tar -xzf "$tarball" -C "$work/package" --strip-components=1

node "$(dirname "$0")/scan-preflight.mjs" "$scanner_dir/scanner/scanner.mjs" "$(cd "$source_dir" && pwd)" "$work/package"
