# Xentral n8n Node - Step-by-Step Implementation Plan

This document is the execution roadmap. Each step is atomic and testable. We implement in strict order - no skipping ahead.

---

## Phase 0: Foundation Restructure

Everything in this phase must be completed before writing any resource code. This fixes the architectural issues discovered in the code audit.

### Step 0.1: Migrate Build Tooling
**Goal:** Switch from custom gulp + tsc to official `@n8n/node-cli`

- [ ] Replace `devDependencies` in package.json:
  - Remove: `gulp`, `gulp-sourcemaps`, `ts-node`, custom tsc setup
  - Add: `@n8n/node-cli: "*"`, `eslint: "9.x"`, `prettier: "3.x"`, `release-it: "^19.0.4"`
- [ ] Update `scripts` in package.json:
  ```json
  "build": "n8n-node build",
  "build:watch": "tsc --watch",
  "dev": "n8n-node dev",
  "lint": "n8n-node lint",
  "lint:fix": "n8n-node lint --fix",
  "release": "n8n-node release",
  "prepublishOnly": "n8n-node prerelease"
  ```
- [ ] Add `"strict": true` to `n8n` config in package.json
- [ ] Add `"files": ["dist"]` to package.json
- [ ] Remove `gulpfile.js`
- [ ] Add `eslint.config.mjs` (n8n-node-cli provides defaults)
- [ ] Add `.prettierrc`
- [ ] Add `LICENSE` (MIT)
- [ ] Verify: `npm run build` succeeds

### Step 0.2: Add Codex Metadata
**Goal:** Node appears correctly categorized in n8n's node panel

- [ ] Create `nodes/Xentral/Xentral.node.json`:
  ```json
  {
    "node": "n8n-nodes-xentral.xentral",
    "nodeVersion": "1.0",
    "codexVersion": "1.0",
    "categories": ["Business", "Sales"],
    "resources": {
      "primaryDocumentation": [{ "url": "https://github.com/yourorg/n8n-nodes-xentral" }],
      "credentialDocumentation": [{ "url": "https://help.xentral.com/hc/en-us/articles/6618896113820" }]
    }
  }
  ```
- [ ] Create `nodes/Xentral/XentralTrigger.node.json` (same structure, name adjusted)
- [ ] Add `usableAsTool: true` to both node descriptions (enables AI agent usage)
- [ ] Add `inputs: [NodeConnectionTypes.Main]` and `outputs: [NodeConnectionTypes.Main]`

### Step 0.3: Rewrite Transport Layer
**Goal:** Correct pagination, proper error handling, rate-limit retry

- [ ] Create `nodes/Xentral/transport/index.ts` - main export
- [ ] Create `nodes/Xentral/transport/v1.ts`:
  - `xentralV1Request(method, endpoint, body?, query?)` - single request
  - `xentralV1RequestAllItems(endpoint, query?)` - cursor-based pagination
    - Uses `cursor[size]=250` and `cursor[nextCursor]` from response `extra.cursor.nextCursor`
    - Stops when no `nextCursor` returned
    - Safety: max 100 iterations
  - Error handling: parse RFC 9457 response, extract `violations` and `messages`
  - Rate limit: retry on 429 with exponential backoff (3 attempts)
- [ ] Create `nodes/Xentral/transport/v3.ts`:
  - `xentralV3Request(method, endpoint, body?, query?)` - single request
  - `xentralV3RequestAllItems(endpoint, query?)` - page-based pagination
    - Uses `page=1&perPage=50`, increments page
    - Reads `meta.currentPage`, `meta.lastPage` or `links.next`
    - Stops when `currentPage >= lastPage` or no `links.next`
    - Safety: max 100 iterations
  - Same error handling and rate limit retry
- [ ] Remove old `GenericFunctions.ts`
- [ ] Verify: compile succeeds

### Step 0.4: Rewrite Credentials
**Goal:** Clean credential without misleading API version field

- [ ] Update `XentralApi.credentials.ts`:
  - Remove `apiVersion` field (version is determined per-resource, not per-credential)
  - Keep: `instanceUrl` (string, required), `accessToken` (password, required)
  - Credential test: `GET /api/v1/customers?cursor[size]=10` (proven to work)
  - `documentationUrl`: link to Xentral PAT docs
- [ ] Verify: credential test passes against demo instance

### Step 0.5: Create Shared Types & Utilities
**Goal:** TypeScript interfaces for API responses, shared field helpers

- [ ] Create `nodes/Xentral/interfaces.ts`:
  ```typescript
  // V1 response envelope
  interface XentralV1Response { meta: object; data: any; extra?: { cursor?: { nextCursor?: string } } }
  // V3 response envelope
  interface XentralV3Response { meta: { currentPage: number; lastPage: number; perPage: number; total: number }; data: any; links?: { next?: string } }
  // Error response (RFC 9457)
  interface XentralError { type: string; title: string; status: number; detail?: string; violations?: Array<{ propertyPath: string; message: string }>; messages?: string[] }
  ```
- [ ] Create `nodes/Xentral/methods/listSearch.ts`:
  - `getCustomers(filter?, paginationToken?)` - search customers by name
  - `getProducts(filter?, paginationToken?)` - search products by name/number
  - `getProjects(filter?, paginationToken?)` - list projects
- [ ] Verify: compile succeeds

### Step 0.6: Restructure Main Node
**Goal:** Resource router pattern that scales to 20+ resources

- [ ] Rewrite `Xentral.node.ts` as a router:
  ```typescript
  export class Xentral implements INodeType {
    description: INodeTypeDescription = {
      // ... metadata
      properties: [
        { name: 'resource', type: 'options', options: [...allResources] },
        ...customerDescription,
        ...productDescription,
        ...offerDescription,
        // ... spread each resource's descriptions
      ],
    };
    methods = { listSearch: { getCustomers, getProducts, getProjects } };
    async execute(this: IExecuteFunctions) {
      const resource = this.getNodeParameter('resource', 0);
      const operation = this.getNodeParameter('operation', 0);
      // Delegate to resource handler
      switch (resource) {
        case 'customer': return handleCustomer.call(this, operation);
        case 'product': return handleProduct.call(this, operation);
        case 'offer': return handleOffer.call(this, operation);
        // ...
      }
    }
  }
  ```
- [ ] Each resource handler is in `resources/{resource}/handler.ts`
- [ ] Each resource's field descriptions are in `resources/{resource}/index.ts`
- [ ] Verify: compile succeeds, existing operations still work

---

## Phase 1: Core MVP (P0 - ~40 Operations)

### Step 1.1: Customer Resource (Rewrite)
**Operations:** Create, Get, Get Many, Update, Delete, Search

- [ ] `resources/customer/index.ts` - operation definitions with routing metadata
- [ ] `resources/customer/create.ts` - fields: type (company/individual), name, all additionalFields mapped to nested V1 body structure
- [ ] `resources/customer/get.ts` - field: customerId (with `listSearch` dropdown)
- [ ] `resources/customer/getAll.ts` - returnAll + limit, proper cursor pagination
- [ ] `resources/customer/update.ts` - all fields mappable, nested body construction
- [ ] `resources/customer/delete.ts` - customerId field
- [ ] `resources/customer/search.ts` - searchTerm, mapped to V1 filter params
- [ ] `resources/customer/handler.ts` - execute switch with V1 transport calls
- [ ] **Test:** Create customer → Get → Update → Search by name → Delete

### Step 1.2: Product Resource (Rewrite)
**Operations:** Create, Get, Get Many, Update, Search, Get Stock

- [ ] `resources/product/index.ts`
- [ ] `resources/product/create.ts` - name, articleNumber, project (required by API!), all additional fields
- [ ] `resources/product/get.ts` - productId with `listSearch`
- [ ] `resources/product/getAll.ts` - cursor pagination
- [ ] `resources/product/update.ts` - all fields from create as optional
- [ ] `resources/product/search.ts`
- [ ] `resources/product/getStock.ts` - productId
- [ ] `resources/product/handler.ts`
- [ ] **Test:** Create product → Get → Update → Search → Get Stock → Delete

### Step 1.3: Offer Resource (Rewrite - V3)
**Operations:** Create, Get, Get Many, Update, Add Line Item, Get Line Items, Release

- [ ] `resources/offer/index.ts`
- [ ] `resources/offer/create.ts` - customerId (listSearch), language, all additional fields
- [ ] `resources/offer/get.ts` - offerId
- [ ] `resources/offer/getAll.ts` - V3 page pagination, filters (status, customerId, createdAfter)
- [ ] `resources/offer/update.ts`
- [ ] `resources/offer/addLineItem.ts` - offerId, productId (listSearch), quantity, unitPrice, discount, description, position
- [ ] `resources/offer/getLineItems.ts` - offerId
- [ ] `resources/offer/release.ts` - offerId
- [ ] `resources/offer/handler.ts` - uses V3 transport
- [ ] **Test:** Create offer → Add 3 line items → Get line items → Release → Verify status

### Step 1.4: Sales Order Resource (New)
**Operations:** Import/Create, Get, Get Many, Update

- [ ] `resources/salesOrder/index.ts`
- [ ] `resources/salesOrder/create.ts` - import endpoint with customer, positions, shipping, payment
- [ ] `resources/salesOrder/get.ts`
- [ ] `resources/salesOrder/getAll.ts` - cursor pagination, status filters
- [ ] `resources/salesOrder/update.ts`
- [ ] `resources/salesOrder/handler.ts`
- [ ] **Test:** Create order → Get → Update → Get Many with filter

### Step 1.5: Webhook Management Resource
**Operations:** Create, Get, Get Many, Update, Delete, List Event Types

- [ ] `resources/webhook/index.ts`
- [ ] `resources/webhook/handler.ts`
- [ ] **Test:** Create webhook → List → Update → Delete

### Step 1.6: Xentral Trigger (Rewrite)
**Goal:** Fix webhook lifecycle, add signature validation, expand events, add polling mode

- [ ] Fix webhook endpoint path (verify: `/api/v1/webhooks` - use `GET /webhook/event-types` to discover all available events)
- [ ] Add all P0 events to trigger options
- [ ] Add HMAC signature validation (if Xentral supports it)
- [ ] Improve error reporting (don't swallow webhook creation errors)
- [ ] **Add Polling Trigger mode** for document types without webhook events:
  - Offers, Invoices, Credit Notes, Proforma Invoices, Liabilities have NO webhook events
  - Polling trigger uses `GET /api/v3/offers?filter[updatedAfter]=...` on a schedule
  - User selects: "Trigger Mode" → Webhook (real-time) or Polling (scheduled)
- [ ] **Test:** Activate trigger → Create customer in Xentral → Verify webhook fires
- [ ] **Test:** Activate polling trigger → Create offer → Verify trigger picks it up on next poll

### Step 1.7: Integration Test Suite
- [ ] Test all P0 operations against real Xentral instance
- [ ] Document any field name corrections needed
- [ ] Fix any issues discovered
- [ ] Verify `npm run build` produces clean dist/

---

## Phase 2: Essential Features (P1 - ~60 Operations)

### Step 2.1: Customer Address
- [ ] Full CRUD (5 operations)
- [ ] Test: Create billing + shipping address for a customer

### Step 2.2: Customer Contact Person
- [ ] Full CRUD (5 operations)
- [ ] Test: Create contact person, update, list all for customer

### Step 2.3: Supplier
- [ ] Full CRUD (5 operations, mixed V1/V3)
- [ ] Add `listSearch` for suppliers

### Step 2.4: Product Category
- [ ] Full CRUD (5 operations)
- [ ] Add `listSearch` for categories (used in product create)

### Step 2.5: Sales Price + Purchase Price
- [ ] CRUD for both (12 operations total)
- [ ] Test: Set price for product, update, list all prices

### Step 2.6: Offer - Extended Operations
- [ ] Delete, Update Line Item, Delete Line Item, Cancel, Send (5 operations)

### Step 2.7: Sales Order - Extended Operations
- [ ] Delete, Cancel, Dispatch, Get Documents (4 operations)

### Step 2.8: Invoice
- [ ] Create, Get, Get Many, Update, Update Status, Send, Create Position (7 operations)
- [ ] Add `listSearch` for invoices

### Step 2.9: Delivery Note
- [ ] Get, Get Many (2 operations)

### Step 2.10: Purchase Order
- [ ] Create, Get, Get Many, Update (4 operations)
- [ ] Add `listSearch` for suppliers in create

### Step 2.11: Warehouse + Storage
- [ ] Warehouse: Create, Get Many (2 ops)
- [ ] Storage Location: Create, Get Many, Set Stock (3 ops)
- [ ] Storage Item: Get Many, Add to Location (2 ops)
- [ ] Add `listSearch` for warehouses

### Step 2.12: Shipping Method
- [ ] Full CRUD (4 operations)
- [ ] Add `loadOptions` for shipping methods (used in offer/order create)

### Step 2.13: Reference Data
- [ ] Payment Methods: Get Many (1 op)
- [ ] Tax Rates: Get Many (1 op)
- [ ] Projects: Get Many (1 op)
- [ ] Add `loadOptions` for each (used as dropdowns)

### Step 2.14: Tags
- [ ] Create, Get Many (2 operations)

### Step 2.15: Trigger - P1 Events
- [ ] Add all P1 events to XentralTrigger

### Step 2.16: Integration Test All P1
- [ ] Run full test matrix
- [ ] npm publish beta version

---

## Phase 3: Extended Features (P2 - ~80 Operations)

### Step 3.1-3.15: (Each sub-resource from checklist)
- Product Media, Properties, Free Fields, Parts, Variants, External References
- Offer file attachments, write protection
- Sales Order documents, partial deliveries, shipments
- Invoice balance, related docs, V3 CRUD
- Credit Note full CRUD + V3 actions
- Delivery Note shipments, V3 CRUD
- Purchase Order cancel, release, V3 CRUD
- Return full CRUD + V3
- Goods Receipt
- Liability create, get, get many, release
- Carrier Integration
- Payment Terms, Transaction
- Production CRUD
- Sales Channel, File, Text Template, Tag extended ops
- Trigger P2 events

---

## Phase 4: Complete Coverage (P3 - ~30 Operations)

### All remaining operations
- Employee, Merchandise Group, Sales Channel Settings, Product Labels
- Proforma Invoice, Service Order, Collective Bill
- Accounting Export, Report full CRUD, Report Credits
- User CRUD, Print Job, Address Free Fields, POS
- Trigger P3 events

---

## Quality Gates

Each phase must pass before moving to the next:

| Gate | Criteria |
|------|----------|
| **Compile** | `npm run build` - zero errors |
| **Lint** | `npm run lint` - zero warnings |
| **Unit** | All field definitions valid (no missing defaults, no broken displayOptions) |
| **Integration** | All operations tested against real Xentral instance |
| **Documentation** | README checklist updated, all new operations documented |

---

## Implementation Rules

1. **One resource at a time.** Complete all operations for a resource before starting the next.
2. **Test after every resource.** Don't batch-test at the end.
3. **Fix pagination first.** V1 cursor and V3 page pagination must work before any resource code.
4. **Use `listSearch` everywhere.** No manual ID entry for customers, products, or other entities users would need to look up.
5. **Map ALL fields.** Every field collected from the user must be sent to the API. No silently ignored fields.
6. **Match API field names exactly.** If the API expects `cursor[size]`, send `cursor[size]`, not `per_page`.
7. **Handle errors properly.** Parse RFC 9457 responses and show meaningful messages to users.
8. **One commit per step.** Keep changes atomic and reviewable.
