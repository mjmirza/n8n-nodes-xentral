# Changelog

## [1.4.2] - 2026-11-01

### Security
- The instance URL may not contain user info (`@`), backslashes or whitespace. `https://127.0.0.1\@acme.xentral.com` passed the 1.4.1 credential test, which read the host after the `@` while the HTTP client went to 127.0.0.1. Both the credential test and every request refuse such URLs.

### Fixed
- Sales Order Commission Consignment Warehouse ID sends `commissionConsignmentWarehouse` again, as up to 1.4.0. 1.4.1 sent it as a storage location id, which changed the meaning of saved values. The new Commission Consignment Storage Location ID field sends `commissionConsignmentStorageLocation`, the field the Sales Order API declares.
- Liability status is sent as `open` or `paid`, the only values Xentral accepts. Saved values map: Pending and Partially Paid to open, Paid to paid. Cancelled has no Xentral equivalent and now fails with a clear message instead of an invalid request.
- Customer Auto-Create Documents sends `both` when on, instead of a boolean the API rejects. The new Auto-Create Documents Type field (both, delivery_note, invoice) picks one and overrides it.
- Contact groups are sent as a list of id strings (`["17","22"]`), as the API requires, instead of `[{"id":"17"}]`.
- Sales Price Valid From and Expires At are sent as YYYY-MM-DD.
- Employee and Webhook Get Many make one request without page parameters. Those endpoints are not paginated, so the old pager repeated the same list.
- A Retry-After of up to 120 seconds is honoured (HTTP date too), instead of being cut to 30 seconds. Retries stay bounded at three.
- Validation errors whose `messages` is an object of arrays show each field message, in the error message and as its description.

## [1.4.1] - 2026-11-01

### Security
- The credential test blocks any instance host with characters outside letters, digits, dots, hyphens and underscores. A percent-encoded host such as `%31%32%37.0.0.1` or a full-width or ideographic-dot spelling of an internal address passed the 1.4.0 check, while the HTTP client decoded it to `127.0.0.1`. The transport also decodes and normalizes the host before its check.

### Fixed
- Page-based V1 and V2 lists (products, purchase prices, addresses and others) request 50 records per page, the documented maximum. They asked for 150, Xentral returned 50, and Return All stopped after the first page, silently dropping the rest.
- A saved line item update that sets only the old Sort option no longer fails with "No fields provided". It returns `success: true, changed: false` without a request, because Xentral V3 ignores a numeric sort. 1.4.0 broke these workflows.
- Hidden on PDF on line items of all eight document resources is sent as `printSettings.hidden`. A root-level `hiddenOnPdf` was ignored, so hidden lines stayed visible.
- Custom API Call sends a body with DELETE when one is given, so bulk deletes that take an ID list work. An empty body is still not sent.
- Customer Address Create with type Master Data sends only the fields that schema allows. Name, contact and delivery fields were always sent and the request was rejected. Name is no longer required in the UI and is still enforced for billing and delivery addresses.
- Shipping Method Carrier Credentials JSON is sent as an object. It was sent as a quoted string. Invalid JSON now gives a clear error.
- Sales Order Create and Update send `commissionConsignmentStorageLocation`, the field the Sales Order API declares. They sent `commissionConsignmentWarehouse`, which only Delivery Notes accept.

## [1.4.0] - 2026-11-01

### Security
- Internal address blocking now canonicalizes the host first. Decimal, hex, octal and short IPv4 forms (`2130706433`, `0x7f000001`, `0177.0.0.1`, `127.1`), trailing dots (`localhost.`), `*.localhost`, IPv6 literals and the CGNAT, multicast and reserved ranges are blocked, in every request and in the credential test. The node blocks literal addresses only and does not resolve DNS. The README says so.
- The trigger adopts an existing Xentral webhook only when the stored signing key was issued for that exact webhook id. A key saved for another registration made every delivery fail with 401. The webhook is now replaced instead.

### Fixed
- Retries and error details work with the errors n8n actually throws. n8n's HTTP helper raises Axios errors with `response.status` and `response.data`, and the node read `statusCode` and `body`, so a 429 was never retried and Xentral's error message and HTTP code were lost. Both shapes are now read. The regression test that mocked the wrong shape now uses the real one.
- Return Create and Update send `isReturnOrderToSupplier`, the field Xentral accepts. The node option keeps its saved name.
- The Customer ID and Created After filters on Offer, Sales Order, Invoice, Credit Note, Delivery Note, Proforma Invoice, Return and Purchase Order now send `address.id`, `createdAt` and `greaterThanOrEquals`, the keys and operator the Xentral spec declares. A test checks every list filter against the spec.
- Offer Create and Update send the payment method as `financials.paymentMethod`. A root-level `paymentMethod` was ignored.
- V3 lists stop on `links.next: null`. A complete result whose last page held exactly 50 items no longer fails as truncated.
- Custom API Call accepts every documented path. Roots that the spec writes with a parameter (`{documentType}/{id}/files`, `{resource}TagAssignments`) are expanded from their enums, so paths such as `/api/v2/salesOrders/7/files` pass validation.
- Text responses keep their content as `data` instead of being replaced by `success: true`.

### Added
- Custom API Call Response Format: JSON, Text or File. File returns a download such as an accounting CSV or ZIP export as binary data, with the file name taken from the response.
- Position After Line Item ID on the line item update of all eight document resources. It sends `position.afterLineItem`, which is how Xentral V3 orders line items.

### Changed
- The line item Sort option is kept so saved workflows still load, but it is no longer sent. Xentral V3 has no numeric sort and ignored it. Its description now points to Position After Line Item ID.

## [1.3.0] - 2026-11-01

### Security
- The trigger now fails closed. A delivery is rejected with 401 when no signing key is known, when the signature is wrong, or when its timestamp is more than five minutes away from the server clock. Before, a missing key skipped verification and an old signed request could be replayed.
- When the trigger finds an existing Xentral webhook for its URL but does not hold that webhook's signing key, it removes it and registers a new one instead of adopting it unverified.
- The credential test no longer reaches internal, loopback, link-local or private addresses, or plain http. Those resolve to an unroutable host, the same block list every operation uses.
- POST, PATCH and PUT are no longer retried after a 502, 503 or 504, because the write may already have been committed. They retry only on 429. GET and DELETE keep their retries.

### Fixed
- Attach File on all ten document resources and Liability Upload Document now send the JSON body Xentral requires (keyword, fileName, base64 fileContent). They sent multipart form data, which the API does not accept.
- Creates that answer with an empty body and a Location header (Product, Customer, Purchase Price) now return the new id, so `$json.id` works downstream.
- A bare 40 character token that starts with a digit is sent unchanged. The node used to strip its leading digits. Leading digits are now removed only from a Sanctum id glued to a 40 character key, and the credential applies the same rule.
- Customer Search now asks Xentral for exact matches on customer number, name and email. The stable customer API does not support partial matching, so the old `contains` filter could not work.
- Report Execute Query and any other write whose spec declares query parameters now passes them, so the free preview mode can be requested.
- Cursor pagination no longer reports truncation when the last allowed page was also the final page.
- Purchase Price Create no longer requires Valid From and Expires At, matching the V2 schema, and sends dates as YYYY-MM-DD.
- Customer Address Create shows a required body with the address fields every schema variant needs.

### Docs
- README says that only the action node is usable as an AI agent tool, describes Customer Search as exact matching, and documents the trigger's fail-closed behavior.

## [1.2.0] - 2026-11-01

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
