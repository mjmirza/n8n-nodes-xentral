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
- The source of the published 1.0.8 and 1.0.9 releases, which had not been pushed to this repository.## [1.2.0] - 2026-11-01

### Added
- Custom API Call resource. Calls any of the 573 operations in the Xentral public API with the saved credential, including retries and Xentral error details. Paths are checked against the resources in the Xentral specs, and full URLs, `..`, query strings in the path and unfilled placeholders are rejected.
- Ten resources generated from the Xentral OpenAPI specs: Customer Address, Customer Delivery Address, Product Category, Product Free Field, Product Media, Product Merchandise Group, Product Option, Report, Supplier Invoice and User.
- Product operations Get Purchase Prices, Get Sales Prices, Get Stock, Get Storage Locations and Get Texts.
- 89 trigger events from the Xentral AsyncAPI catalogue, including offers, proforma invoices, liabilities, picklists, POS, shipments, tickets and DATEV export. The trigger now offers 162 events.
- Endpoints Xentral marks as beta show a notice in the node.

### Changed
- Product Create and Update now use the V2 endpoints, because Xentral deprecated the V1 ones. The category field is sent as `categories`. A write that sets Shop Price Display stays on V1, because V2 has no such field.
- Product Get, Get Many and Search use V2 on node version 2. Nodes saved before this release are version 1 and keep the V1 reads, because the V2 response has different fields.
- Purchase Price Create, Get Many and Update moved from the deprecated V1 endpoints to V2, which takes the same fields.
- The Xentral specs in `specs/` were refreshed to the public versions from 2026-10-26.
- Dedicated operations now cover 244 of the 542 non-deprecated Xentral operations, up from 177. Custom API Call covers the rest.

### Not changed
- Supplier Update still uses the deprecated V1 tag endpoint. Its only replacement is a Xentral beta endpoint.
- Every parameter name, operation value, default and option from 1.1.0 is unchanged, so saved workflows keep working.


