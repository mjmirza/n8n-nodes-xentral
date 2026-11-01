# Changelog

## 1.1.0 (2026-11-01)

### Changed

- License is now MIT. It was the Fair Use Code License (FUCL), which n8n does not accept for verified community nodes.
- The credential is now tested by a request to the products endpoint defined on the credential itself. Before, the node ran its own test through the deprecated `request` helper, which n8n verification rejects. The connection test no longer checks for internal network addresses, every real operation still does.
- Errors inside handlers are now `NodeOperationError` with the same messages, and errors from the API keep their `NodeApiError` details, so the n8n UI shows them with context.
- Retries wait with the `sleep` helper from `n8n-workflow` instead of `setTimeout`. Timing is unchanged.
- The trigger logs through the n8n logger instead of `console`, and a failed webhook listing is now logged instead of ignored.
- Every output item carries `pairedItem`, so expressions that point back to the input item resolve correctly.
- The Tag color field uses the color picker. Stored values stay hex strings.
- Options and collections are sorted alphabetically, and parameter descriptions follow the n8n style. JSON examples moved to field hints. No parameter names, operation values or resource values changed.
- Light and dark vector icons replace the embedded PNG, and the credential has an icon.
- Build tooling. TypeScript 6.0.3, `n8n-workflow` 2.45.4 for types, gulp replaced by a small copy script, and the n8n verification lint rules added as `npm run lint`, run in CI and before publishing.

### Docs

- README rewritten. Outcome-first overview, a short path from install to first result, generated tables of all operations and trigger events, credential setup, technical overview and compatibility.

## 1.0.10 (2026-10-31)

### Fixed

- Product search now matches the article number and the EAN, not only the product name. The field always promised "name, article number, or EAN", but the search sent a single name filter, so a search by article number returned nothing. The three lookups now run in parallel and are merged with article-number matches first, duplicates removed, and the limit applied to the merged result.

### Added

- Unit tests for product search, run with `npm test`, and a CI workflow that builds and tests every push and pull request.
- The source of the published 1.0.8 and 1.0.9 releases, which had not been pushed to this repository.
