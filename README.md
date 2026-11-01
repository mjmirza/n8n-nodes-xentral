<p align="center">
  <img src="https://raw.githubusercontent.com/mjmirza/n8n-nodes-xentral/master/docs/assets/xentral-icon.png" alt="Xentral node icon" width="80" height="80" />
</p>

# n8n-nodes-xentral

Connect Xentral ERP to n8n. 41 resources, 257 operations, a Custom API Call that reaches every Xentral endpoint, and a webhook trigger for 162 Xentral events.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-xentral?label=npm)](https://www.npmjs.com/package/n8n-nodes-xentral)
[![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-xentral?label=downloads)](https://www.npmjs.com/package/n8n-nodes-xentral)
[![CI](https://img.shields.io/github/actions/workflow/status/mjmirza/n8n-nodes-xentral/ci.yml?branch=master&label=CI)](https://github.com/mjmirza/n8n-nodes-xentral/actions/workflows/ci.yml)
[![License MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Signed with npm provenance](https://img.shields.io/badge/npm-provenance%20signed-2ea44f)](https://www.npmjs.com/package/n8n-nodes-xentral#provenance)

## What is this?

Xentral is an ERP used by e-commerce, wholesale and manufacturing teams to run orders, invoices, stock and shipping. This package adds two nodes to n8n so those records can move between Xentral and every other tool you use, without writing code.

It is for operations teams and automation builders who already run Xentral and want orders, documents and stock to flow on their own.

## What you get

- **Orders that create themselves.** A web shop order, a form or an email turns into a Xentral sales order, offer or invoice without anyone typing it in.
- **Documents that leave on time.** Release and send offers, invoices, delivery notes and purchase orders the moment the data is complete, with line items and attachments.
- **Stock you can act on.** Read and update products, prices, warehouses and storage locations, and book goods receipts against purchase orders or returns.
- **Reactions within seconds.** The Xentral Trigger starts a workflow when an order is created, a delivery note is sent or a product changes, so nothing waits for a nightly export.
- **Searches that find the right product.** Product search matches the article number, the EAN and the name, with article number matches first.
- **Customer lookup by exact value.** Customer Search finds a customer by its exact customer number, name or email. Xentral's customer API does not support partial matches, so the node does not pretend to.
- **Safe defaults.** HTTPS only, literal internal addresses (localhost, private, loopback and link-local IPs in any decimal, hex or octal spelling, and IPv6 literals) blocked for every request including the credential test, IDs validated before they reach a URL, writes never retried after a gateway error, and Xentral error details shown in the n8n UI. Hosts with percent-encoding or non-ASCII characters, and URLs with user info (`@`), backslashes or spaces, are refused, and redirects are never followed. The node does not resolve DNS, so a public hostname that points at an internal address is not caught here. Use your n8n instance's egress or network policy for that.
- **Trigger that fails closed.** Every delivery is checked against its HMAC signature and must be no older than five minutes. Anything unverifiable is rejected with 401 and never starts the workflow.
- **Every endpoint within reach.** Custom API Call sends any request in the Xentral API with your saved credential, so a rare accounting, tax or POS endpoint never needs a separate HTTP Request node.
- **Works with AI agents.** The Xentral action node is marked as a tool, so an n8n AI Agent can call Xentral operations directly. The trigger starts workflows and is not a tool.

## From install to first result

1. In n8n open **Settings**, then **Community Nodes**, click **Install**, and enter `n8n-nodes-xentral`.
2. In Xentral create a Personal Access Token under **Administration**, **Account settings**, **Developer Settings**, **Personal Access Tokens** (admin rights required, see the [Xentral authentication guide](https://developer.xentral.com/reference/authentication)).
3. In n8n add a **Xentral API** credential with your instance URL, for example `https://yourcompany.xentral.com`, and paste the token exactly as Xentral shows it. Click **Test** to confirm the connection.
4. Add a **Xentral** node to a workflow, choose **Product** and **Get Many**, and run it.
5. Your Xentral products appear as items in the output panel, and you can filter them, map them or pass them to any other node.

## Nodes

| Node | Type | What it does |
|------|------|--------------|
| Xentral | Action | Create, read, update and delete records across 41 resources, plus Custom API Call for any other endpoint |
| Xentral Trigger | Webhook | Starts a workflow on 162 Xentral events and registers the webhook in Xentral for you |

## Resources and operations

| Resource | Operations |
|----------|------------|
| Address | Create, Get Many, Update, Delete |
| Contact | Create, Delete, Get, Get Many, Update |
| Credit Note | Add Line Item, Attach File, Create, Delete, Delete Line Item, Get, Get Many, Log Activity, Release, Remove Write Protection, Set Write Protection, Update, Update Line Item |
| Custom API Call | Make an API Call |
| Customer | Create, Delete, Get, Get Many, Search, Update |
| Customer Address | Create, Delete, Get, Get Many, Update |
| Customer Delivery Address | Create, Delete, Get, Get Many, Update |
| Delivery Note | Add Line Item, Attach File, Cancel, Create, Delete, Delete Line Item, Get, Get Many, Log Activity, Release, Remove Write Protection, Send, Set Write Protection, Update, Update Line Item |
| Delivery Term | Get Many |
| Employee | Get Many |
| Goods Receipt | Create for Purchase Order, Create for Return |
| Invoice | Add Line Item, Attach File, Create, Create From Sales Order, Delete, Delete Line Item, Get, Get Many, Log Activity, Release, Remove Write Protection, Send, Set Write Protection, Update, Update Line Item |
| Liability | Create, Get, Get Many, Release, Upload Document |
| Offer | Add Line Item, Attach File, Cancel, Create, Delete, Delete Line Item, Get, Get Many, Log Activity, Release, Remove Write Protection, Send, Set Write Protection, Update, Update Line Item |
| Payment Method | Get Many |
| Payment Terms Group | Create, Get, Get Many |
| Product | Create, Delete, Get, Get Many, Get Purchase Prices, Get Sales Prices, Get Stock, Get Storage Locations, Get Texts, Search, Update |
| Product Category | Create, Delete, Get, Get Many, Update |
| Product Free Field | Get, Get Many, Update |
| Product Media | Create, Get, Get Many |
| Product Merchandise Group | Create, Delete, Get, Get Many, Update |
| Product Option | Create, Create Values, Delete Value, Get Many, Get Value, Get Values, Update, Update Value |
| Production | Attach File, Create, Delete, Get, Get Many, Log Activity, Release, Start |
| Proforma Invoice | Add Line Item, Attach File, Create, Delete, Delete Line Item, Get, Get Many, Log Activity, Release, Remove Write Protection, Set Write Protection, Update, Update Line Item |
| Project | Get Many |
| Purchase Order | Add Line Item, Attach File, Cancel, Create, Delete, Delete Line Item, Get, Get Many, Log Activity, Release, Remove Write Protection, Send, Set Write Protection, Update, Update Line Item |
| Purchase Price | Create, Delete, Get, Get Many, Update |
| Report | Create, Create Export, Delete, Execute Query, Get, Get Export, Get Exports, Get Many, Get Schedules, Update |
| Return | Add Line Item, Attach File, Cancel, Create, Create From Delivery Note, Delete, Delete Line Item, Get, Get Many, Log Activity, Release, Remove Write Protection, Send, Set Write Protection, Update, Update Line Item |
| Sales Channel | Get Many |
| Sales Order | Add Line Item, Attach File, Cancel, Create, Delete, Delete Line Item, Get, Get Many, Log Activity, Release, Remove Write Protection, Send, Set Write Protection, Update, Update Line Item |
| Sales Price | Create, Delete, Get, Get Many, Update |
| Shipment | Create, Get |
| Shipping Method | Create, Get, Get Many, Update |
| Storage Location | Create, Get Many, Update, Delete |
| Supplier | Get, Get Many, Search, Update |
| Supplier Invoice | Add Line Item, Assign Purchase Order, Create, Get, Get Many |
| Tag | Create, Get Many |
| User | Create, Delete, Get, Get Many, Get Permissions, Update |
| Warehouse | Create, Get Many, Update, Delete |
| Webhook | Create, Delete, Get, Get Many, Update |

Design decisions behind a few deliberate limits are in [docs/DESIGN-DECISIONS.md](docs/DESIGN-DECISIONS.md).

Operations whose endpoint Xentral marks beta show a notice in the node, because Xentral may change them without warning. That covers Customer Delivery Address, Supplier Invoice and some User reads, Production Create, Get and Get Many, Proforma Invoice Create, Get, Get Many, Update and its line item writes, Delivery Note and Return creates, updates and line item writes, Return Create From Delivery Note, and Invoice Create From Sales Order.

### API coverage

The Xentral public API (specs dated 2026-10-26) has 573 operations, 542 of them not deprecated. This release has dedicated operations for 244 of those 542, up from 177. Custom API Call reaches all 573, which a test checks against every documented path, including parameterized ones such as `/api/v2/salesOrders/{id}/files` and `/api/v2/productsTagAssignments`. The specs the node was built against are in `specs/`.

## Custom API Call

Choose the **Custom API Call** resource to call any Xentral endpoint with your saved credential. Authentication, retries with backoff and Xentral error details work the same as in every other operation.

| Field | Meaning |
|-------|---------|
| Method | GET, POST, PATCH, PUT or DELETE |
| API Version | V1, V2 or V3. A path that starts with `/api/v2/` or similar sets the version |
| Path | The part after `/api/<version>/`, for example `posJournals` |
| Query Parameters | JSON, for example filters or pagination |
| Body | JSON, shown for POST, PATCH, PUT and DELETE. A DELETE sends it only when it is not empty, for bulk deletes. n8n's HTTP helper never sends a body with GET, so a GET endpoint that reads one (the product label download options) runs with its defaults |
| Content Type | `application/json` by default. Some endpoints need a vendor type such as `application/vnd.xentral.minimal+json` |
| Accept | Empty by default, which asks for JSON, or any type in Text and File mode. Set `application/pdf` to download a document such as an invoice as PDF |
| Response Format | JSON by default. Text returns the body in `data`. File keeps a download such as a CSV or ZIP export as binary data in the field you name |

The path must be relative, must start with a resource that exists in the Xentral API, and must not contain `..`, a full URL, a query string or an unfilled `{placeholder}`. Anything else is rejected before a request is sent.

Example, read POS journals, which have no dedicated operation.

```text
Method        GET
API Version   V1
Path          posJournals
Query         {"page[number]": 1, "page[size]": 50}
```

Example, run a report query with a pasted V1 path and a report parameter.

```text
Method        POST
Path          /api/v1/analytics/report/42/query
Body          {"parameters": [{"name": "date", "type": "string", "defaultValue": "2026-01-01"}]}
```

## Deprecated endpoints migrated

Xentral deprecated several V1 endpoints this node used. They now point at the current versions.

| Operation | Before | Now |
|-----------|--------|-----|
| Product Create, Update | `POST`, `PATCH /api/v1/products` | V2. The category field is sent as `categories`. A write that sets Shop Price Display stays on V1, because V2 has no such field |
| Product Get, Get Many, Search | `/api/v1/products` | V2 for new nodes. Nodes saved before this release keep V1, because the V2 response has different fields |
| Purchase Price Create, Get Many, Update | `/api/v1/purchasePrices` | `/api/v2/purchasePrices`, same fields |

Supplier Update still uses the deprecated V1 tag endpoint, because its only replacement is a Xentral beta endpoint.

To move an existing Product node to V2 reads, delete it and add it again. The new node uses node version 2.

## Trigger events

| Object | Events |
|--------|--------|
| Analytics Document Extraction | Applied, Canceled |
| Autoshipment | Dispatched |
| Collective Bill | Created |
| Credit Note | Archived, Canceled, Created (Unverified), Deleted, Protocol Created, Released, Sent, Updated (Unverified) |
| Customer | Created, Deleted, Updated |
| DATEV | Exported |
| Delivery Note | Archived, Canceled, Created, Deleted, Protocol Created, Released, Sent, Updated |
| Dispatch Center | Order Processed |
| Dropshipping Supplier | Order Created |
| Dropshipping Warehouse | Order Created |
| Dunning | Started |
| Exporter | Executed |
| Extended Order Proposal | Executed |
| Goods Receipt | Completed, Created, Deleted, Updated |
| Importer | Executed |
| Incoming Payments | Live Import |
| Invoice | Archived, Canceled, Created (Unverified), Deleted, Protocol Created, Released, Sent (Unverified), Updated (Unverified) |
| Liability | Canceled, Created, Deleted, Protocol Created, Released, Updated |
| Offer | Archived, Canceled, Created, Deleted, Protocol Created, Released, Sent, Updated |
| Order | Fetched |
| Order Proposal | Executed |
| Outgoing Payment | Created, Executed |
| Payment List | Imported |
| Picklist | Created, Generated |
| POS | Card Payment Captured, Order Created, Transaction Created |
| Product | Created, Deleted, Exported, Imported, Properties Created, Properties Deleted, Properties Updated, Pseudo Stock Updated, Sync Started, Tags Replaced, Updated, Variant Created |
| Product Category | Created, Deleted, Updated |
| Product Cross Selling | Created, Deleted, Updated |
| Product Media | Created, Deleted, Updated |
| Product Parts List Position | Created, Deleted, Updated |
| Production | Canceled, Completed, Created, Deleted, Protocol Created, Released, Sent, Started, Updated |
| Proforma Invoice | Archived, Canceled, Created, Deleted, Protocol Created, Released, Sent, Updated |
| Project | Created |
| Purchase Order | Archived, Canceled, Created, Deleted, Goods Received, Protocol Created, Released, Sent, Updated |
| Purchase Price | Created, Deleted, Updated |
| Report | Exported, Viewed |
| Reservation | Changed |
| Return | Archived, Canceled, Created, Deleted, Goods Received, Protocol Created, Released, Sent, Updated |
| Sales Order | Archived, Created, Deleted, Dispatched, Imported, Protocol Created, Released, Sent, Updated |
| Sales Order Position | Created, Deleted, Delivered, Updated |
| Sales Order Reservation | Confirmed, Created, Deleted, Updated |
| Sales Price | Created, Deleted, Updated |
| Shipment | Created, Label Created |
| Stock | Synchronized |
| Storage Item | Movement |
| Ticket | Received, Reply Sent |
| Transfer | Job Error, Job Successful |

Events marked Unverified are listed in the Xentral event catalogue but have not been observed firing on a live instance yet. The event list follows the Xentral AsyncAPI catalogue from 2026-10-26.

## Credentials

The **Xentral API** credential needs two values.

| Field | Where to find it |
|-------|------------------|
| Instance URL | The address you use to open Xentral, for example `https://yourcompany.xentral.com`. HTTPS is required. |
| Access Token | A Personal Access Token from **Administration**, **Account settings**, **Developer Settings**, **Personal Access Tokens**. Paste the full token (`2|abc...`) or only the part after the pipe, both work. |

Creating a token needs admin rights in Xentral. The [Xentral authentication guide](https://developer.xentral.com/reference/authentication) shows each step. The token stays in the n8n credential store and is only sent to your own Xentral instance.

## Technical overview

| Area | Choice |
|------|--------|
| Language | TypeScript, strict mode |
| Runtime dependencies | None. `n8n-workflow` is a peer dependency provided by n8n |
| Xentral APIs | V1, V2 and V3, chosen per operation |
| Pagination | Cursor, page number and V3 pages, handled per endpoint |
| Errors | Xentral problem details (RFC 9457) surfaced through `NodeApiError` |
| Retries | 429, 502, 503 and 504 retried with exponential backoff, jitter and `Retry-After` |
| Lint | The same rule set n8n uses to verify community packages. CI and the release workflow run the n8n verification scanner on the packed tarball before anything is published, and again on the published version |
| Release | Signed npm provenance from GitHub Actions |

### Project structure

```text
credentials/          Xentral API credential, icons, credential test
nodes/Xentral/
  Xentral.node.ts         action node and resource routing
  XentralTrigger.node.ts  webhook trigger with signature checks
  transport.ts            HTTP, pagination, retries, URL and ID validation
  resources/<name>/       operations, fields and handler per resource
  resources/specDriven/   operations generated from the Xentral specs
  resources/customApiCall/  Custom API Call and its path checks
scripts/copy-assets.mjs icon copy step for the build
scripts/gen-spec-catalog.mjs  regenerates the spec driven operations from specs/
specs/                Xentral OpenAPI specs the node is built against
test/                 node test runner suites
docs/assets/          images for this README
```

### Build, test and lint

Requires Node.js 22 or newer.

```bash
npm ci
npm run build   # compile TypeScript and copy icons into dist/
npm test        # build, then run the unit tests
npm run lint    # n8n verification rule set, must report zero problems
```

### Release flow

1. Bump `version` in `package.json` and add a `CHANGELOG.md` entry on a branch.
2. Open a pull request. CI builds, lints and tests it.
3. After merge, tag the merge commit with `v<version>` and push the tag.
4. The Publish workflow checks that the tag matches `package.json`, runs the tests, packs the tarball and scans it with n8n's community package scanner. Only a tarball that passes is published to npm with `--provenance`, which signs the package against that exact commit. The scan runs once more on the published version to check provenance.

## Upgrade notes

### 1.4.5
- Address overrides on documents leave Type out when it is empty. A set Type must be mrs, mr, company or other (any case). Any other value now stops the item with a clear error before the request, where Xentral used to reject it.
- A line item update that sets only Price Currency now sends it. Before, it failed with "No fields provided" or the currency was dropped.
- When the trigger cannot delete its webhook on deactivation (anything but 404 or 410), it keeps the webhook ID and signing key. The next activation adopts the webhook and the next deactivation retries the delete.
- The trigger now remembers which Xentral instance it registered its webhook on, and only deletes it there. A webhook registered by an older version is read back first and deleted only when it still points at this node's URL. A stored webhook from another instance is never adopted with the old signing key.
- On activation the trigger first removes a webhook it kept from such a failed delete. If that removal fails too, activation stops with an error rather than registering a second webhook.
- An empty Country in an address override is left out. A set Country must be a two-letter code (any case).
- An empty Delivery Date in an update now clears the date (sends `null`) on Invoice and Proforma Invoice, and on Offer, Invoice, Credit Note and Proforma Invoice line items.
- The trigger also stops activation when a webhook for the same URL and event that it does not own cannot be deleted.
- Product Age Rating None now clears the rating instead of being ignored.
- Liability Status no longer lists Cancelled. Xentral has no such status and a saved Cancelled always failed. It still fails, with the same message, so pick Pending or Paid.
- Product ID on a line item update and Product Number on a line item add or update are no longer sent, because Xentral V3 accepts neither and ignored them. To change a line item's product, delete it and add a new one.
- Sales Order and Return Get Many with the Sent filter now return documents marked as sent (`isDocumentSent`). Before, the filter asked for a status Xentral does not have.
- The trigger ignores deliveries whose event type is not the one it is set to. Before, a webhook registered with extra events started the workflow for all of them.
- To remove a price's Valid From or Expires At, use an expression that returns null.
- Product Update still ignores empty values. Turn on the new Clear Empty Fields option to clear text fields with an empty value.
- Return Create From Delivery Note now checks its line items before the request. Each needs the delivery note line item id, a quantity and a returnReason id, as Xentral requires.

## Compatibility

| Item | Status |
|------|--------|
| n8n | Built and type checked against `n8n-workflow` 2.45.4, the n8n stable line. Node versions 1 and 2 |
| Self-hosted n8n | Supported |
| n8n Cloud | Available once n8n verifies the package. It passes the n8n community package scanner |
| Node.js | 22 or newer |

## Support

- Bugs and feature requests go to [GitHub issues](https://github.com/mjmirza/n8n-nodes-xentral/issues).
- Other questions, custom workflows or Xentral automation projects go to support@next8n.com.
- More about the maintainers is at [next8n.com](https://next8n.com).

## License

[MIT](LICENSE). Copyright (c) 2026 Mirza Iqbal.

"Xentral" and the Xentral logo are trademarks of Xentral ERP Software GmbH. This project is independent and is not affiliated with or endorsed by Xentral ERP Software GmbH. It talks to Xentral only through the publicly documented REST API.
