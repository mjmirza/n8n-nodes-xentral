# Changelog

## [1.4.5] - 2026-11-01

### Fixed
- Address overrides (Document Address, Deviating Ship-To Address) on Sales Order, Purchase Order, Offer, Invoice, Credit Note, Proforma Invoice, Delivery Note and Return no longer send an empty Type. Xentral accepts only mrs, mr, company or other. A set Type is trimmed and lower-cased, an unknown one fails before the request.
- Proforma Invoice Get Many sends the Created After filter as `createdAt greaterThanOrEquals`. It was ignored.
- Line item updates that set only Price Currency send it on Sales Order, Purchase Order, Offer, Invoice, Credit Note and Proforma Invoice. They failed with "No fields provided" or dropped the currency.
- Product Create and Update send the calculated purchase price amount as a string and the currency in upper case, as the v1 Money schema declares.
- The trigger keeps its webhook ID and signing key when the webhook delete fails, so a later deactivation can retry it. A 404 or 410 still clears them.
- The trigger removes a webhook kept from a failed delete before it registers a new one, and only on the Xentral instance it was registered on, so a stored ID never removes another registration. A webhook stored by an older version is read back first and removed only when it still points at this node's URL. A registration on another instance is never adopted with the stored signing key. If that removal fails (anything but 404 or 410), activation stops with a clear error instead of leaving two active registrations.
- Address overrides leave an empty Country out, and still send an explicit `null` to clear it on update. A set Country is upper-cased and must be a two-letter code, as the schema's `^[A-Z]{2}$` requires.
- Delivery Date on Offer, Invoice, Credit Note and Proforma Invoice line item updates, and on Invoice and Proforma Invoice updates, is cleared by an expression that returns null. An empty value is ignored, as before, so saved workflows with an empty fallback keep their dates. The help text no longer says "empty to clear". Proforma Invoice no longer sends an empty string as the date, which Xentral rejected.
- Hand-written operations whose endpoint Xentral marks beta (Production, Proforma Invoice, Delivery Note, Return writes, Invoice Create From Sales Order) show the beta notice.

- The trigger stops activation when a matching webhook it does not own cannot be deleted, instead of registering a second one beside it.
- Product Age Rating None sends the empty rating, which the API accepts, so it clears an existing rating.
- Product Options turns a plain text option value into `{"name": value}`, as the schema requires. The Free Fields and Options help text now shows the shapes Xentral accepts.
- Liability Status no longer offers Cancelled, which Xentral does not have and which always failed. A saved Cancelled still fails with the same clear message.
- Line item updates on all eight documents no longer send Product ID or Product Number, and line item adds no longer send Product Number. The V3 schemas accept neither, so Xentral ignored them. The options stay, marked as ignored, and an update that sets only them returns `changed: false` with a note instead of a request.
- Purchase Price and Sales Price send `null` for Valid From or Expires At when an expression returns null, so the boundary can be removed. 1.4.4 sent the text "null".
- The trigger starts the workflow only for deliveries of its own event type. A delivery of another type is answered 200 and dropped. A delivery without a type still runs, as before.
- Return Create From Delivery Note checks that each line item has the delivery note line item `id`, a numeric `quantity` and a `returnReason` with an `id`, and that there is at least one, before the request. The help text described a `product` shape Xentral rejects.
- An address override set to `null` by an expression clears it again, as in 1.4.4. Offer Update clears its ship-to override the same way.
- With a configured Signature Key, the trigger stops activation when it cannot list webhooks, because an unseen older registration with the same key would run every event twice. With a generated key it still creates a new registration, as before.
- The trigger adopts the registration it owns when several exist for its URL and event, and removes the others. Before, it could delete its own registration's sibling, forget its own, and create a third.
- The Sent filter on Sales Order and Return uses `isDocumentSent`, because their status has no `sent` value.
- When the trigger adopts a registration stored by a version before 1.4.5, it writes the stored signing key to it first, so deliveries verify even if the credential now points at another tenant with the same webhook ID. If that write fails, the registration is replaced.
- JSON fields on Product (Free Fields, Options, Variants, Selected Options), Customer (Custom Fields, Additional Contact Data), Credit Note (Debt Status) and Invoice (Dunning Settings) accept an expression that already resolved to an object or array. They threw "must be valid JSON".
- Xentral validation errors keep nested field paths, for example `positions.0.price: Must be non-negative`, instead of `[object Object]`.

### Added
- Product Update has a Clear Empty Fields option. When on, an empty Description, Short Description, Internal Comment, EAN, Customs Tariff Number, Disabled Reason or Region of Origin clears the field, and an empty Country of Origin is sent as null. Off by default, so saved workflows keep ignoring empty values.
- Custom API Call has a Full Response option that returns the whole JSON body as one item, keeping pagination cursors and meta such as `totalResults`. Off by default, so the data array is still split into items.
- Custom API Call has an Accept option, for example `application/pdf` to download a document PDF in File mode.

### Release
- The publish workflow packs the tarball, runs n8n's community package scanner on it and on the source, and only then publishes that same tarball. CI runs the same preflight on every push and pull request. The post-publish scan stays for the provenance check.

## [1.4.4] - 2026-11-01

### Security
- The credential test no longer follows redirects. n8n forwards the Authorization header on a redirect, so a redirecting host could have received the token or pointed the test at plain http or an internal address.

### Fixed
- Line item updates on Sales Order, Purchase Order, Offer, Invoice, Credit Note and Proforma Invoice send a currency only when you set one. An amount-only update sent EUR and could change the line's currency. Adding a line item still defaults to EUR.
- A saved Return Reason of `null` sends JSON `null` again and clears the reason, as in 1.4.2. 1.4.3 sent `{"id":"null"}`. An empty value is still not sent.
- Customer Fixed Payment Terms and the SEPA flags (Company SEPA, Initial, Mandate Reference Change) are sent as JSON booleans. The text values `true` and `false` were sent as strings.
- Purchase Price Create and Sales Price Create and Update send `price.amount` as a string, as their schemas declare. Purchase Price Update keeps a number, which its schema declares.

### Release
- The publish workflow runs n8n's community package scanner on Node 22 against the version it just published, and marks the release failed if the scan does not pass.

## [1.4.3] - 2026-11-01

### Security
- Redirects are no longer followed. A Xentral host, or anything posing as one, could redirect to plain http or an internal address after the URL checks. A 3xx answer now fails with the redirect target in the error.

### Fixed
- Purchase Price and Sales Price updates with only an amount no longer send EUR as the currency, which changed the currency of existing non-EUR prices. Create still defaults to EUR.
- Tag Get Many pages through the list (50 per page) instead of returning only the first page.
- Sales Order, Delivery Note and Purchase Order send Document Date, Delivery Date, Desired Delivery Date and Confirmed Delivery Date as YYYY-MM-DD, as the spec requires.
- Return line item Return Reason is sent as `{"id": "..."}`. Saved values as an id, a number or a JSON object all map to that shape.
- Customer Address Update no longer sends Type, which no update schema accepts. The option stays and is marked as ignored on update.
- Customer Address Create no longer requires a ZIP code. No address schema requires one.
- Tag colour is sent as #RRGGBB. A bare six digit hex value gets the # added, and the help text no longer says to omit it.

### Note for 1.4.1 users
- 1.4.1 briefly sent Sales Order Commission Consignment Warehouse ID as `commissionConsignmentStorageLocation`. 1.4.2 restored the long-standing `commissionConsignmentWarehouse` and added Commission Consignment Storage Location ID for the storage location. If you edited a sales order with 1.4.1, re-check that field and move a storage location id to the new field.

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
