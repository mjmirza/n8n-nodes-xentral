<p align="center">
  <img src="https://unpkg.com/n8n-nodes-xentral@1.0.0/dist/nodes/Xentral/xentral.svg" alt="Xentral" width="80" />
</p>

<h1 align="center">n8n-nodes-xentral</h1>

<p align="center">
  <strong>The most comprehensive n8n community node for Xentral ERP</strong><br/>
  Built, maintained, and owned by <a href="https://next8n.com">next8n</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/n8n-nodes-xentral"><img src="https://img.shields.io/npm/v/n8n-nodes-xentral?style=for-the-badge&color=CB3837&label=npm" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/n8n-nodes-xentral"><img src="https://img.shields.io/npm/dt/n8n-nodes-xentral?style=for-the-badge&color=blue&label=downloads" alt="npm downloads" /></a>
  <a href="#license"><img src="https://img.shields.io/badge/license-FUCL-orange?style=for-the-badge" alt="License" /></a>
  <img src="https://img.shields.io/badge/Xentral-ERP-00C4B4?style=for-the-badge" alt="Xentral ERP" />
  <img src="https://img.shields.io/badge/n8n-Community_Node-FF6D5A?style=for-the-badge" alt="n8n Community Node" />
  <img src="https://img.shields.io/badge/API-V1_+_V2_+_V3-7B61FF?style=for-the-badge" alt="API V1 + V2 + V3" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/AI_Agent-Compatible-10A37F?style=for-the-badge" alt="AI Agent Compatible" />
  <img src="https://img.shields.io/badge/Resources-30-success?style=for-the-badge" alt="30 Resources" />
  <img src="https://img.shields.io/badge/Operations-196-success?style=for-the-badge" alt="196 Operations" />
  <img src="https://img.shields.io/badge/Webhook_Events-58-success?style=for-the-badge" alt="73 Webhook Events" />
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
| **Xentral** | Action Node | Full CRUD across 30 resources with 196 operations - customers, products, offers, orders, invoices, warehouse, shipping, and more |
| **Xentral Trigger** | Webhook Node | Real-time event listener for 73 Xentral event types - orders, products, customers, invoices, delivery notes, returns |

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

## 73 Webhook Trigger Events

Real-time notifications for: Sales Orders, Products, Customers, Purchase Orders, Returns, Delivery Notes, Invoices, Credit Notes, Sales/Purchase Prices, **Goods Receipts, Production, Sales Order Reservations** - including created, updated, deleted, released, sent, dispatched, archived, started, completed, confirmed, and more.

---

## API Audit Verified

Every single endpoint in this node has been tested against the live Xentral API:

- **All 196 operations** verified to point to existing, working API routes
- **Zero 404 "Route not found" errors** on any non-feature-flag endpoint
- **Correct field structures** validated for all create/update operations
- **Security hardened** - ID sanitization, SSRF protection, endpoint validation

---

## Installation

### From n8n (Recommended)
1. Go to **Settings > Community Nodes**
2. Enter `n8n-nodes-xentral`
3. Click **Install**

### Manual
```bash
cd ~/.n8n/nodes
npm install n8n-nodes-xentral
```

---

## Quick Setup

1. Install the node in n8n
2. Create a **Personal Access Token** in Xentral: *Administration > Account Settings > Developer Settings > Personal Access Tokens*
3. Add **Xentral API** credentials in n8n with your instance URL and token - just paste the token exactly as Xentral shows it (e.g. `2|abc...xyz`), the node handles the rest automatically
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

**Trademark & legal notice:** "Xentral" and the Xentral logo are trademarks of Xentral ERP Software GmbH. We do not claim ownership of the Xentral brand or logo. This node was developed independently using publicly available API documentation for the purpose of interoperability, as permitted under EU Directive 2009/24/EC (Software Directive, Article 6) and applicable law. No Xentral proprietary code is included -- all interactions use publicly documented REST API endpoints. This is an original, independently authored work; the entire source code is the intellectual property of the copyright holder. The use of third-party APIs for interoperability purposes does not constitute infringement under EU or international law (see also Google LLC v. Oracle America, Inc., 593 U.S. 1 (2021) on API fair use).

Interested in collaborating or contributing? We're open to partnerships. Let's talk.

For commercial licensing, partnership, or custom development: [services.next8n.com](https://services.next8n.com)
