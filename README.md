<p align="center">
  <img src="https://unpkg.com/n8n-nodes-xentralx@0.8.0/dist/nodes/Xentral/xentral.svg" alt="Xentral" width="80" />
</p>

<h1 align="center">n8n-nodes-xentralx</h1>

<p align="center">
  <strong>The most comprehensive n8n community node for Xentral ERP</strong><br/>
  Built, maintained, and owned by <a href="https://next8n.com">next8n</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-xentralx"><img src="https://img.shields.io/npm/v/n8n-nodes-xentralx?style=for-the-badge&color=CB3837&label=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/n8n-nodes-xentralx"><img src="https://img.shields.io/npm/dt/n8n-nodes-xentralx?style=for-the-badge&color=blue&label=downloads" alt="npm downloads" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/license-FUCL-orange?style=for-the-badge" alt="License" /></a>
  <img src="https://img.shields.io/badge/Xentral-ERP-00C4B4?style=for-the-badge" alt="Xentral ERP" />
  <img src="https://img.shields.io/badge/n8n-Community_Node-FF6D5A?style=for-the-badge" alt="n8n Community Node" />
  <img src="https://img.shields.io/badge/API-V1_+_V2_+_V3-7B61FF?style=for-the-badge" alt="API V1 + V2 + V3" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/AI_Agent-Compatible-10A37F?style=for-the-badge" alt="AI Agent Compatible" />
  <img src="https://img.shields.io/badge/Resources-30-success?style=for-the-badge" alt="30 Resources" />
  <img src="https://img.shields.io/badge/Operations-163-success?style=for-the-badge" alt="163 Operations" />
  <img src="https://img.shields.io/badge/Webhook_Events-58-success?style=for-the-badge" alt="58 Webhook Events" />
  <img src="https://img.shields.io/badge/API_Audit-Verified-brightgreen?style=for-the-badge" alt="API Audit Verified" />
  <img src="https://img.shields.io/badge/Maintained-Active-brightgreen?style=for-the-badge" alt="Actively Maintained" />
  <img src="https://img.shields.io/badge/Built_on-Official_Xentral_API-00C4B4?style=for-the-badge" alt="Official Xentral API" />
</p>

---

## We automate Xentral. For a living.

We have successfully delivered Xentral + n8n automation for numerous clients across **e-commerce**, **manufacturing**, **wholesale**, and **3PL**. From email-to-offer generation to full order-to-cash pipelines - we build production-ready workflows that run 24/7.

**This node exists because we needed it for real client projects. We built it from the official Xentral API documentation, we maintain it, and we own the intellectual property.**

If you're using Xentral and looking to automate your business processes - offers, orders, invoices, warehouse, shipping, customer management - we've done it before and would be happy to do it for you.

<p align="center">
  <a href="https://services.next8n.com"><img src="https://img.shields.io/badge/Book_a_Free_Consultation-services.next8n.com-FF6D5A?style=for-the-badge&logoColor=white" alt="Book a consultation" /></a>
</p>

<p align="center">
  <a href="https://next8n.com"><strong>next8n.com</strong></a> &nbsp;|&nbsp; <a href="https://services.next8n.com"><strong>Schedule a call</strong></a>
</p>

---

## What you get

| Node | Type | What it does |
|------|------|-------------|
| **Xentral** | Action Node | Full CRUD across 30 resources with 163 operations - customers, products, offers, orders, invoices, warehouse, shipping, and more |
| **Xentral Trigger** | Webhook Node | Real-time event listener for 58 Xentral event types - orders, products, customers, invoices, delivery notes, returns |

**AI Agent ready** - Both nodes work with `usableAsTool: true`, so you can plug them directly into n8n AI Agent workflows for intelligent automation.

---

## Supported Resources (30)

### CRM & Contacts
Customer, Supplier, Address, Contact Person, Employee

### Products & Pricing
Product, Sales Price, Purchase Price, Sales Channel

### Business Documents (Full Lifecycle)
**Offer** (Angebot), **Sales Order** (Auftrag), **Invoice** (Rechnung), **Credit Note** (Gutschrift), **Delivery Note** (Lieferschein), **Proforma Invoice**, **Purchase Order** (Bestellung), **Return** (Retoure)

Each document supports operations like: Create, Get, Get Many, Update, Delete, Add/Update/Delete Line Items, Release, Send, Cancel, Log Activity, Write Protection, Attach File (varies per document type)

### Warehouse & Logistics
Warehouse, Storage Location, Goods Receipt, Shipment, Production

### Finance & Settings
Liability, Payment Method, Payment Terms Group, Shipping Method, Delivery Terms, Tag, Project, Webhook

---

## Full Operation Inventory

| Resource | Operations | API |
|----------|-----------|-----|
| **Customer** | Create, Get, Get Many, Search, Update, Delete | V1 |
| **Product** | Create, Get, Get Many, Search, Update, Delete | V1 |
| **Sales Order** | Create, Get, Get Many, Update, Delete, Search, Cancel, Dispatch | V1 |
| **Purchase Order** | Create, Get, Get Many, Search, Update, Delete, Cancel, Release | V1 |
| **Return** | Create, Get, Get Many, Delete, Release | V1 |
| **Supplier** | Get, Get Many, Search, Update | V1 |
| **Warehouse** | Create, Get Many, Update, Delete | V1 |
| **Address** | Create, Get Many, Update, Delete | V2 |
| **Contact** | Create, Get, Get Many, Update, Delete | V1 |
| **Tag** | Create, Get Many | V2 |
| **Offer** | Create, Get, Get Many, Update, Delete, Add/Update/Delete Line Item, Release, Send, Cancel, Log Activity, Write Protection, Attach File | V3* |
| **Invoice** | Create, Get, Get Many, Update, Delete, Add/Update/Delete Line Item, Release | V3 |
| **Credit Note** | Create, Get, Get Many, Update, Delete, Add/Update/Delete Line Item, Release, Send, Cancel, Log Activity, Write Protection, Attach File | V3* |
| **Delivery Note** | Create, Get, Get Many, Update, Delete, Add/Update/Delete Line Item | V3 |
| **Proforma Invoice** | Create, Get, Get Many, Update, Delete, Add/Update/Delete Line Item, Release, Send, Cancel, Log Activity, Write Protection, Attach File | V3* |
| **Production** | Create, Get, Get Many, Delete, Release, Start | V1+V3 |
| **Shipment** | Create, Get, Get Many | V1 |
| **Storage Location** | Get Many | V1 |
| **Goods Receipt** | Create for Purchase Order, Create for Return | V1 |
| **Sales Price** | Create, Get, Get Many, Update, Delete | V1 |
| **Purchase Price** | Create, Get, Get Many, Update, Delete | V1 |
| **Liability** | Create, Get, Get Many, Release | V1 |
| **Payment Method** | Get Many | V1 |
| **Payment Terms Group** | Create, Get, Get Many | V1 |
| **Shipping Method** | Get, Get Many | V1 |
| **Delivery Terms** | Get Many | V1 |
| **Employee** | Get Many | V1 |
| **Sales Channel** | Get Many | V1 |
| **Project** | Get Many | V1 |
| **Webhook** | Create, Get, Get Many, Update, Delete | V1 |

*\* Requires Xentral feature flag to be enabled on your instance*

---

## 58 Webhook Trigger Events

Real-time notifications for: Sales Orders, Products, Customers, Purchase Orders, Returns, Delivery Notes, Invoices, Credit Notes, Sales/Purchase Prices - including created, updated, deleted, released, sent, dispatched, archived, and more.

---

## API Audit Verified

Every single endpoint in this node has been tested against the live Xentral API:

- **All 163 operations** verified to point to existing, working API routes
- **Zero 404 "Route not found" errors** on any non-feature-flag endpoint
- **Correct field structures** validated for all create/update operations
- **Three API versions** (V1, V2, V3) used where each is strongest
- **Security hardened** - ID sanitization, SSRF protection, endpoint validation
- **Pagination compliance** - respects all API limits (cursor, page, V3)

See `AUDIT_REPORT.md` for the full test results.

---

## Installation

### From n8n (Recommended)
1. Go to **Settings > Community Nodes**
2. Enter `n8n-nodes-xentralx`
3. Click **Install**

### Manual
```bash
cd ~/.n8n/nodes
npm install n8n-nodes-xentralx
```

---

## Quick Setup

1. Install the node in n8n
2. Create a **Personal Access Token** in Xentral: *Administration > Account Settings > Developer Settings > Personal Access Tokens*
3. Add **Xentral API** credentials in n8n with your instance URL and token
4. Start building workflows

---

## Why this node?

- **API audit verified** - every endpoint tested against the live Xentral API
- **Built from the official Xentral API documentation** - not a wrapper around an outdated legacy API
- **Triple API support** - Seamlessly routes operations to V1, V2, or V3 depending on what works best
- **Three pagination strategies** handled automatically - cursor-based, page-number, and V3 pagination
- **Security hardened** - ID sanitization, SSRF protection, endpoint regex validation
- **Full TypeScript** with strict typing
- **RFC 9457 error parsing** - clear, actionable error messages from Xentral
- **Production-tested** - used in real client automation workflows
- **Actively maintained** by the team that built it

---

## Need more than a node?

This community node covers the core Xentral operations. But if you need:

- **Custom workflow design** - email-to-offer, order-to-invoice, warehouse automation
- **Xentral + Shopify / WooCommerce** sync workflows
- **AI-powered** document classification, data extraction, automated responses
- **Advanced integrations** - carrier APIs, accounting exports, analytics pipelines
- **Ongoing maintenance** and monitoring of your automation

We've delivered all of this for our clients and would be happy to discuss your specific requirements.

<p align="center">
  <a href="https://services.next8n.com"><img src="https://img.shields.io/badge/Book_a_Free_Consultation-services.next8n.com-FF6D5A?style=for-the-badge&logoColor=white" alt="Book a consultation" /></a>
</p>

---

## Changelog

### v0.8.0 (2026-03-13)
- **Full API audit** - every endpoint tested against live Xentral API
- **30 resources, 163 operations** - all verified working
- Added V2 API support (Addresses, Tags)
- Fixed goods receipt endpoint path (`goods-receipt` -> `goodsReceipts`)
- Fixed lineItems casing (`lineitems` -> `lineItems`) across all V3 documents
- Fixed nested object structures for Product, Sales Order, Sales Price, Webhook, Contact, Warehouse, Production, Liability, Purchase Price, Payment Terms Group
- Removed non-existent endpoints (Product Category, Tax Rate, various broken actions)
- Security: Added ID sanitization, tightened endpoint regex, SSRF protection
- Security: Hardened DELETE empty response handling

### v0.7.0
- Initial comprehensive release with 30+ resources

---

## License

**Fair Use Code License (FUCL)**

Copyright (c) 2026 Mirza Iqbal / [next8n](https://next8n.com). All rights reserved.

This node is published as an n8n community node for the benefit of the Xentral + n8n ecosystem. However, the intellectual property, source code, and all associated rights are owned exclusively by the copyright holder.

**Permitted:**
- Install and use this node for your own internal workflows and business automation

**Prohibited without explicit written consent:**
- Copying, forking, or reproducing the source code in any form
- Commercial redistribution, resale, sublicensing, or white-labeling
- Creating derivative works or competing products based on this code
- Public redistribution of modified or unmodified versions
- Using the Software as part of a commercial service offering
- Removing or altering copyright notices or attribution

**Attribution:** This node was developed and is actively maintained by [next8n](https://next8n.com). Attribution must be preserved in all copies.

This software is provided "as is", without warranty of any kind, express or implied.

**We built it. We maintain it. We own the rights to the code.**

**Trademark & legal notice:** "Xentral" and the Xentral logo are trademarks of Xentral ERP Software GmbH. We do not claim ownership of the Xentral brand or logo. This node was developed independently using publicly available API documentation for the purpose of interoperability, as permitted under EU Directive 2009/24/EC and applicable law. No Xentral proprietary code is included - all interactions use publicly documented REST API endpoints.

Interested in collaborating or contributing? We're open to partnerships. Let's talk.

For commercial licensing, partnership, or custom development: [services.next8n.com](https://services.next8n.com)
