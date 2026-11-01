#!/usr/bin/env bash
# Runs n8n's community package scanner on a version that was just published.
# Usage: scan-published.sh <package> <version>. Exits non-zero if the version never appears or the scan fails.
set -euo pipefail

name="${1:?package name required}"
version="${2:?version required}"
attempts="${SCAN_WAIT_ATTEMPTS:-20}"
pause="${SCAN_WAIT_SECONDS:-15}"
scanner="@n8n/scan-community-package@0.41.1"

# The registry can take a few minutes to serve a fresh publish.
live=""
for _ in $(seq 1 "$attempts"); do
	live="$(npm view "${name}@${version}" version 2>/dev/null || true)"
	if [ "$live" = "$version" ]; then
		break
	fi
	sleep "$pause"
done
if [ "$live" != "$version" ]; then
	echo "${name}@${version} did not appear on the registry, scan not run" >&2
	exit 2
fi

# The scanner prints its verdict and exits 0 even when checks fail, so the verdict line decides.
set +e
output="$(npx -y "$scanner" "${name}@${version}" 2>&1)"
status=$?
set -e
echo "$output"
if [ "$status" -ne 0 ] || ! grep -q "has passed all security checks" <<<"$output"; then
	echo "n8n scanner did not pass ${name}@${version}" >&2
	exit 1
fi
