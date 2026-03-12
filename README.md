# n8n-nodes-xentral

Community node for [n8n](https://n8n.io) to integrate with [Xentral ERP](https://xentral.com).

Provides full access to the Xentral REST API (V1 + V3) — covering CRM, products, business documents, purchasing, warehousing, shipping, accounting, production, analytics, and system settings.

**~400 operations** across **60+ resources** and **~60 webhook events**. See [API_REFERENCE.md](API_REFERENCE.md) for the exhaustive endpoint list.

![Xentral](https://img.shields.io/badge/Xentral-ERP-00C4B4?style=flat-square)
![n8n](https://img.shields.io/badge/n8n-community--node-FF6D5A?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## Table of Contents

- [Installation](#installation)
- [Credentials](#credentials)
- [Nodes](#nodes)
- [Complete Feature Inventory](#complete-feature-inventory)
- [API Coverage Matrix](#api-coverage-matrix)
- [Implementation Checklist](#implementation-checklist)
- [Architecture](#architecture)
- [Development](#development)
- [Testing](#testing)
- [License](#license)

---

## Installation

### Community Node (Recommended)
1. In n8n, go to **Settings > Community Nodes**
2. Enter `n8n-nodes-xentral`
3. Click **Install**

### Manual Installation
```bash
cd ~/.n8n/nodes
npm install n8n-nodes-xentral
```

---

## Credentials

### Xentral API (Personal Access Token)

| Field | Description |
|-------|-------------|
| **Instance URL** | Your Xentral instance URL (e.g. `https://yourcompany.xentral.com`) |
| **Access Token** | Personal Access Token (PAT) created in Xentral |

**Creating a PAT:**
Xentral > Administration > Account Settings > Developer Settings > Personal Access Tokens > "Create Token"

**Recommended Scopes:**
| Scope | Read | Write | Use Case |
|-------|------|-------|----------|
| CRM | Yes | Yes | Customer/supplier management |
| Products | Yes | Yes | Product CRUD, pricing, stock |
| Fulfillment | Yes | Yes | Orders, offers, delivery notes, returns |
| Accounting | Yes | Optional | Invoices, credit notes, payments |
| Settings | Yes | No | Shipping methods, payment terms, tax rates |
| Identity & Access | No | No | Not needed for automation |

---

## Nodes

This package provides two nodes:

### Xentral (Action Node)
Main node for all CRUD operations against the Xentral API.

### Xentral Trigger (Webhook Node)
Listens for real-time events from Xentral (Kafka-based webhook system).

---

## Complete Feature Inventory

Every feature below maps to a Xentral API endpoint. This is the complete list of what the node package will cover.

### Module 1: CRM / Contacts

#### 1.1 Customer (Kunde)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 1.1.1 | Create | V1 | POST | `/api/v1/customers` | P0 |
| 1.1.2 | Get | V1 | GET | `/api/v1/customers/{id}` | P0 |
| 1.1.3 | Get Many | V1 | GET | `/api/v1/customers` | P0 |
| 1.1.4 | Update | V1 | PATCH | `/api/v1/customers/{id}` | P0 |
| 1.1.5 | Delete | V1 | DELETE | `/api/v1/customers/{id}` | P0 |
| 1.1.6 | Search | V1 | GET | `/api/v1/customers?filter[name]=...` | P0 |

**Fields:** type (company/individual), name, firstName, lastName, email, phone, fax, website, street, zip, city, country, customerNumber, vatId, paymentMethod, paymentTerms, language, tags, customFields, bankDetails (IBAN, BIC, bankName), creditLimit, industry, notes

#### 1.2 Customer Address (Kundenadresse)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 1.2.1 | Create | V1 | POST | `/api/v1/customers/{id}/addresses` | P1 |
| 1.2.2 | Get | V1 | GET | `/api/v1/customers/{id}/addresses/{addressId}` | P1 |
| 1.2.3 | Get Many | V1 | GET | `/api/v1/customers/{id}/addresses` | P1 |
| 1.2.4 | Update | V1 | PATCH | `/api/v1/customers/{id}/addresses/{addressId}` | P1 |
| 1.2.5 | Delete | V1 | DELETE | `/api/v1/customers/{id}/addresses/{addressId}` | P1 |

**Fields:** type (billing/shipping/other), name, street, zip, city, country, additionalLine, isDefault

#### 1.3 Customer Contact Person (Ansprechpartner)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 1.3.1 | Create | V1 | POST | `/api/v1/customers/{id}/contactpersons` | P1 |
| 1.3.2 | Get | V1 | GET | `/api/v1/customers/{id}/contactpersons/{cpId}` | P1 |
| 1.3.3 | Get Many | V1 | GET | `/api/v1/customers/{id}/contactpersons` | P1 |
| 1.3.4 | Update | V1 | PATCH | `/api/v1/customers/{id}/contactpersons/{cpId}` | P1 |
| 1.3.5 | Delete | V1 | DELETE | `/api/v1/customers/{id}/contactpersons/{cpId}` | P1 |

**Fields:** salutation, firstName, lastName, email, phone, mobile, position, department, isPrimary

#### 1.4 Supplier (Lieferant)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 1.4.1 | Create | V3 | POST | `/api/v3/suppliers` | P1 |
| 1.4.2 | Get | V1 | GET | `/api/v1/suppliers/{id}` | P1 |
| 1.4.3 | Get Many | V1 | GET | `/api/v1/suppliers` | P1 |
| 1.4.4 | Update | V3 | PATCH | `/api/v3/suppliers/{id}` | P1 |
| 1.4.5 | Delete | V1 | DELETE | `/api/v1/suppliers/{id}` | P1 |

**Fields:** name, supplierNumber, email, phone, street, zip, city, country, vatId, paymentTerms, currency, language

#### 1.5 Employee (Mitarbeiter)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 1.5.1 | Get Many | V1 | GET | `/api/v1/employees` | P3 |

---

### Module 2: Products (Artikel)

#### 2.1 Product
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.1.1 | Create | V1 | POST | `/api/v1/products` | P0 |
| 2.1.2 | Get | V1 | GET | `/api/v1/products/{id}` | P0 |
| 2.1.3 | Get Many | V1 | GET | `/api/v1/products` | P0 |
| 2.1.4 | Update | V1 | PATCH | `/api/v1/products/{id}` | P0 |
| 2.1.5 | Delete | V2 | DELETE | `/api/v2/products/{id}` | P1 |
| 2.1.6 | Bulk Update | V1 | PATCH | `/api/v1/products` | P2 |
| 2.1.7 | Bulk Delete | V2 | DELETE | `/api/v2/products` | P2 |
| 2.1.8 | Search | V1 | GET | `/api/v1/products?filter[name]=...` | P0 |

**Fields:** name, articleNumber, description, project, categoryId, priceNet, taxRate, weight, ean, unit, manufacturer, status (active/inactive), dimensions (length, width, height), barcode, minStock, maxStock, customFields (40 free fields)

#### 2.2 Product Category
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.2.1 | Create | V1 | POST | `/api/v1/products/categories` | P1 |
| 2.2.2 | Get | V1 | GET | `/api/v1/products/categories/{id}` | P1 |
| 2.2.3 | Get Many | V1 | GET | `/api/v1/products/categories` | P1 |
| 2.2.4 | Update | V1 | PATCH | `/api/v1/products/categories/{id}` | P1 |
| 2.2.5 | Delete | V1 | DELETE | `/api/v1/products/categories/{id}` | P1 |

**Fields:** name, parentCategoryId, description, sortOrder

#### 2.3 Product Media
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.3.1 | Upload | V1 | POST | `/api/v1/products/{id}/media` | P2 |
| 2.3.2 | Get | V1 | GET | `/api/v1/products/{id}/media/{mediaId}` | P2 |
| 2.3.3 | Get Many | V1 | GET | `/api/v1/products/{id}/media` | P2 |
| 2.3.4 | Bulk Update | V1 | PATCH | `/api/v1/products/{id}/media` | P2 |
| 2.3.5 | Bulk Delete | V1 | DELETE | `/api/v1/products/{id}/media` | P2 |

#### 2.4 Product Properties
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.4.1 | Create Multiple | V1 | POST | `/api/v1/products/{id}/properties` | P2 |
| 2.4.2 | Get Many | V1 | GET | `/api/v1/products/{id}/properties` | P2 |
| 2.4.3 | Bulk Update | V1 | PATCH | `/api/v1/products/{id}/properties` | P2 |
| 2.4.4 | Bulk Delete | V1 | DELETE | `/api/v1/products/{id}/properties` | P2 |

#### 2.5 Product Free Fields (Custom Fields)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.5.1 | Get | V1 | GET | `/api/v1/products/{id}/freeFields/{fieldId}` | P2 |
| 2.5.2 | Get Many | V1 | GET | `/api/v1/products/{id}/freeFields` | P2 |
| 2.5.3 | Update | V1 | PATCH | `/api/v1/products/{id}/freeFields/{fieldId}` | P2 |
| 2.5.4 | Bulk Update | V1 | PATCH | `/api/v1/products/{id}/freeFields` | P2 |

#### 2.6 Cross Sellings
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.6.1 | Create | V1 | POST | `/api/v1/products/{id}/crossSellings` | P3 |
| 2.6.2 | Get Many | V1 | GET | `/api/v1/products/{id}/crossSellings` | P3 |
| 2.6.3 | Update | V1 | PATCH | `/api/v1/products/{id}/crossSellings/{csId}` | P3 |
| 2.6.4 | Delete | V1 | DELETE | `/api/v1/products/{id}/crossSellings/{csId}` | P3 |

#### 2.7 Product Parts (BOM Components)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.7.1 | Create | V1 | POST | `/api/v1/products/{id}/parts` | P2 |
| 2.7.2 | Get Many | V1 | GET | `/api/v1/products/{id}/parts` | P2 |
| 2.7.3 | Update | V2 | PATCH | `/api/v2/products/{id}/parts/{partId}` | P2 |
| 2.7.4 | Delete | V2 | DELETE | `/api/v2/products/{id}/parts/{partId}` | P2 |

#### 2.8 Product Stock
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.8.1 | Get Stock Details | V1 | GET | `/api/v1/products/{id}/stock` | P0 |
| 2.8.2 | Get Reservations | V1 | GET | `/api/v1/products/{id}/reservations` | P2 |

#### 2.9 Sales Price
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.9.1 | Create | V1 | POST | `/api/v1/products/{id}/salesPrices` | P1 |
| 2.9.2 | Get | V1 | GET | `/api/v1/products/{id}/salesPrices/{priceId}` | P1 |
| 2.9.3 | Get Many | V1 | GET | `/api/v1/products/{id}/salesPrices` | P1 |
| 2.9.4 | Update | V1 | PATCH | `/api/v1/products/{id}/salesPrices/{priceId}` | P1 |
| 2.9.5 | Bulk Update | V1 | PATCH | `/api/v1/products/{id}/salesPrices` | P2 |
| 2.9.6 | Delete | V1 | DELETE | `/api/v1/products/{id}/salesPrices/{priceId}` | P1 |

#### 2.10 Purchase Price
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.10.1 | Create | V1 | POST | `/api/v1/products/{id}/purchasePrices` | P1 |
| 2.10.2 | Get | V1 | GET | `/api/v1/products/{id}/purchasePrices/{priceId}` | P1 |
| 2.10.3 | Get Many | V1 | GET | `/api/v1/products/{id}/purchasePrices` | P1 |
| 2.10.4 | Update | V1 | PATCH | `/api/v1/products/{id}/purchasePrices/{priceId}` | P1 |
| 2.10.5 | Bulk Update | V1 | PATCH | `/api/v1/products/{id}/purchasePrices` | P2 |
| 2.10.6 | Delete | V2 | DELETE | `/api/v2/products/{id}/purchasePrices/{priceId}` | P1 |

#### 2.11 Product External Reference
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.11.1 | Create | V1 | POST | `/api/v1/products/{id}/externalReferences` | P2 |
| 2.11.2 | Get Many | V1 | GET | `/api/v1/products/{id}/externalReferences` | P2 |
| 2.11.3 | Get Targets | V1 | GET | `/api/v1/products/externalReferences/targets` | P2 |
| 2.11.4 | Update | V1 | PATCH | `/api/v1/products/{id}/externalReferences/{refId}` | P2 |
| 2.11.5 | Delete | V1 | DELETE | `/api/v1/products/{id}/externalReferences/{refId}` | P2 |

#### 2.12 Merchandise Group
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.12.1 | Create | V1 | POST | `/api/v1/products/merchandiseGroups` | P3 |
| 2.12.2 | Get | V1 | GET | `/api/v1/products/merchandiseGroups/{id}` | P3 |
| 2.12.3 | Get Many | V1 | GET | `/api/v1/products/merchandiseGroups` | P3 |
| 2.12.4 | Update | V1 | PATCH | `/api/v1/products/merchandiseGroups/{id}` | P3 |
| 2.12.5 | Delete | V1 | DELETE | `/api/v1/products/merchandiseGroups/{id}` | P3 |

#### 2.13 Matrix Product / Variants
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.13.1 | Create Variants | V1 | POST | `/api/v1/products/{id}/variants` | P2 |
| 2.13.2 | Create Options | V1 | POST | `/api/v1/products/{id}/variants/options` | P2 |
| 2.13.3 | Get Options | V1 | GET | `/api/v1/products/{id}/variants/options` | P2 |
| 2.13.4 | Update Options | V1 | PATCH | `/api/v1/products/{id}/variants/options/{optId}` | P2 |
| 2.13.5 | Delete Options | V1 | DELETE | `/api/v1/products/{id}/variants/options/{optId}` | P2 |
| 2.13.6 | Create Values | V1 | POST | `/api/v1/products/{id}/variants/options/{optId}/values` | P2 |
| 2.13.7 | Get Values | V1 | GET | `/api/v1/products/{id}/variants/options/{optId}/values` | P2 |
| 2.13.8 | Update Values | V1 | PATCH | `/api/v1/products/{id}/variants/options/{optId}/values/{valId}` | P2 |
| 2.13.9 | Delete Values | V1 | DELETE | `/api/v1/products/{id}/variants/options/{optId}/values/{valId}` | P2 |

#### 2.14 Sales Channel Settings
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.14.1 | Create | V1 | POST | `/api/v1/products/{id}/salesChannelSettings` | P3 |
| 2.14.2 | Update | V1 | PATCH | `/api/v1/products/{id}/salesChannelSettings/{settingId}` | P3 |
| 2.14.3 | Delete | V1 | DELETE | `/api/v1/products/{id}/salesChannelSettings/{settingId}` | P3 |

#### 2.15 Product Label
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 2.15.1 | Print | V1 | POST | `/api/v1/products/{id}/labels/print` | P3 |
| 2.15.2 | Download PDF | V1 | GET | `/api/v1/products/{id}/labels/pdf` | P3 |

---

### Module 3: Business Documents

#### 3.1 Offer / Quote (Angebot) — V3
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 3.1.1 | Create | V3 | POST | `/api/v3/offers` | P0 |
| 3.1.2 | Get | V3 | GET | `/api/v3/offers/{id}` | P0 |
| 3.1.3 | Get Many | V3 | GET | `/api/v3/offers` | P0 |
| 3.1.4 | Update | V3 | PATCH | `/api/v3/offers/{id}` | P0 |
| 3.1.5 | Delete | V3 | DELETE | `/api/v3/offers/{id}` | P1 |
| 3.1.6 | Add Line Item | V3 | POST | `/api/v3/offers/{id}/lineitems` | P0 |
| 3.1.7 | Get Line Items | V3 | GET | `/api/v3/offers/{id}/lineitems` | P0 |
| 3.1.8 | Update Line Item | V3 | PATCH | `/api/v3/offers/{id}/lineitems/{lineId}` | P1 |
| 3.1.9 | Delete Line Item | V3 | DELETE | `/api/v3/offers/{id}/lineitems/{lineId}` | P1 |
| 3.1.10 | Release | V3 | POST | `/api/v3/offers/{id}/actions/release` | P0 |
| 3.1.11 | Cancel | V3 | POST | `/api/v3/offers/{id}/actions/cancel` | P1 |
| 3.1.12 | Send | V3 | POST | `/api/v3/offers/{id}/actions/send` | P1 |
| 3.1.13 | Write Protection | V3 | POST | `/api/v3/offers/{id}/actions/write-protection` | P2 |
| 3.1.14 | Attach File | V3 | POST | `/api/v3/offers/{id}/files` | P2 |
| 3.1.15 | Get Files | V3 | GET | `/api/v3/offers/{id}/files` | P2 |

**Fields (Create):** customerId, language, documentDate, deliveryTime, paymentTerm, shippingMethod, shippingCost, internalNote, headerText, footerText, validityDays, deliveryAddress
**Fields (Line Item):** productId, quantity, unitPrice, discount, description, position, taxRate

#### 3.2 Sales Order (Auftrag)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 3.2.1 | Import / Create | V1 | POST | `/api/v1/salesorders/import` | P0 |
| 3.2.2 | Get | V1 | GET | `/api/v1/salesorders/{id}` | P0 |
| 3.2.3 | Get Many | V1 | GET | `/api/v1/salesorders` | P0 |
| 3.2.4 | Update | V1 | PATCH | `/api/v1/salesorders/{id}` | P0 |
| 3.2.5 | Delete | V1 | DELETE | `/api/v1/salesorders/{id}` | P1 |
| 3.2.6 | Cancel | V1 | POST | `/api/v1/salesorders/{id}/cancel` | P1 |
| 3.2.7 | Dispatch | V1 | POST | `/api/v1/salesorders/{id}/dispatch` | P1 |
| 3.2.8 | Get Documents | V1 | GET | `/api/v1/salesorders/{id}/documents` | P1 |
| 3.2.9 | Create Document | V1 | POST | `/api/v1/salesorders/{id}/documents` | P2 |
| 3.2.10 | Create Partial Delivery | V1 | POST | `/api/v1/salesorders/{id}/partialDeliveries` | P2 |
| 3.2.11 | Create Shipment | V1 | POST | `/api/v1/salesorders/{id}/shipments` | P2 |

**V3 Alternative:**
| 3.2.12 | Create (V3) | V3 | POST | `/api/v3/salesorders` | P1 |
| 3.2.13 | Add Line Item (V3) | V3 | POST | `/api/v3/salesorders/{id}/lineitems` | P1 |

**Fields:** customerId, orderNumber, positions[], shippingMethod, paymentMethod, deliveryAddress, billingAddress, internalNote, externalNote, projectId, salesChannel, tags

#### 3.3 Invoice (Rechnung)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 3.3.1 | Create | V1 | POST | `/api/v1/invoices` | P1 |
| 3.3.2 | Get | V1 | GET | `/api/v1/invoices/{id}` | P1 |
| 3.3.3 | Get Many | V1 | GET | `/api/v1/invoices` | P1 |
| 3.3.4 | Update | V1 | PATCH | `/api/v1/invoices/{id}` | P1 |
| 3.3.5 | Update Status | V1 | PATCH | `/api/v1/invoices/{id}/status` | P1 |
| 3.3.6 | Send | V1 | POST | `/api/v1/invoices/{id}/send` | P1 |
| 3.3.7 | Get Balance | V1 | GET | `/api/v1/invoices/{id}/balance` | P2 |
| 3.3.8 | Create Position | V1 | POST | `/api/v1/invoices/{id}/positions` | P1 |
| 3.3.9 | Get Related Documents | V1 | GET | `/api/v1/invoices/{id}/relatedDocuments` | P2 |

**V3 Alternative:**
| 3.3.10 | CRUD (V3) | V3 | ALL | `/api/v3/invoices` | P2 |

**Fields:** customerId, invoiceDate, dueDate, positions[], paymentMethod, paymentTerms, headerText, footerText, internalNote

#### 3.4 Credit Note (Gutschrift)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 3.4.1 | Create | V1 | POST | `/api/v1/creditnotes` | P2 |
| 3.4.2 | Get | V1 | GET | `/api/v1/creditnotes/{id}` | P2 |
| 3.4.3 | Get Many | V1 | GET | `/api/v1/creditnotes` | P2 |
| 3.4.4 | Update | V1 | PATCH | `/api/v1/creditnotes/{id}` | P2 |
| 3.4.5 | Send | V1 | POST | `/api/v1/creditnotes/{id}/send` | P2 |
| 3.4.6 | Get Balance | V1 | GET | `/api/v1/creditnotes/{id}/balance` | P2 |

**V3 Alternative with actions:**
| 3.4.7 | Release (V3) | V3 | POST | `/api/v3/creditnotes/{id}/actions/release` | P2 |
| 3.4.8 | Cancel (V3) | V3 | POST | `/api/v3/creditnotes/{id}/actions/cancel` | P2 |
| 3.4.9 | Send (V3) | V3 | POST | `/api/v3/creditnotes/{id}/actions/send` | P2 |

#### 3.5 Delivery Note (Lieferschein)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 3.5.1 | Get | V1 | GET | `/api/v1/deliverynotes/{id}` | P1 |
| 3.5.2 | Get Many | V1 | GET | `/api/v1/deliverynotes` | P1 |
| 3.5.3 | Get Shipments | V1 | GET | `/api/v1/deliverynotes/{id}/shipments` | P2 |
| 3.5.4 | Update Customs Data | V1 | PATCH | `/api/v1/deliverynotes/{id}/customs` | P3 |
| 3.5.5 | Assign Quality Control | V1 | POST | `/api/v1/deliverynotes/{id}/qualityControl` | P3 |

**V3 Alternative:**
| 3.5.6 | CRUD (V3) | V3 | ALL | `/api/v3/deliverynotes` | P2 |

#### 3.6 Purchase Order (Einkaufsbestellung)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 3.6.1 | Create | V1 | POST | `/api/v1/purchaseorders` | P1 |
| 3.6.2 | Get | V1 | GET | `/api/v1/purchaseorders/{id}` | P1 |
| 3.6.3 | Get Many | V1 | GET | `/api/v1/purchaseorders` | P1 |
| 3.6.4 | Update | V1 | PATCH | `/api/v1/purchaseorders/{id}` | P1 |
| 3.6.5 | Cancel | V1 | POST | `/api/v1/purchaseorders/{id}/cancel` | P2 |
| 3.6.6 | Release | V1 | POST | `/api/v1/purchaseorders/{id}/release` | P2 |

**V3 Alternative:**
| 3.6.7 | CRUD (V3) | V3 | ALL | `/api/v3/purchaseorders` | P2 |

**Fields:** supplierId, expectedDeliveryDate, positions[], warehouseId, internalNote

#### 3.7 Return (Retoure)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 3.7.1 | Create | V1 | POST | `/api/v1/returns` | P2 |
| 3.7.2 | Get | V1 | GET | `/api/v1/returns/{id}` | P2 |
| 3.7.3 | Get Many | V1 | GET | `/api/v1/returns` | P2 |
| 3.7.4 | Release | V1 | POST | `/api/v1/returns/{id}/release` | P2 |
| 3.7.5 | Get Documents | V1 | GET | `/api/v1/returns/{id}/documents` | P2 |
| 3.7.6 | Get Reasons | V1 | GET | `/api/v1/returns/reasons` | P2 |

**V3 Alternative:**
| 3.7.7 | CRUD (V3) | V3 | ALL | `/api/v3/returnorders` | P2 |

#### 3.8 Proforma Invoice (V3 Beta)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 3.8.1 | CRUD | V3 | ALL | `/api/v3/proformainvoices` | P3 |

#### 3.9 Service Order (V3)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 3.9.1 | CRUD | V3 | ALL | `/api/v3/serviceorders` | P3 |

#### 3.10 Liability (Verbindlichkeit)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 3.10.1 | Create | V1 | POST | `/api/v1/liabilities` | P2 |
| 3.10.2 | Create Recurring | V1 | POST | `/api/v1/liabilities/recurring` | P3 |
| 3.10.3 | Get | V1 | GET | `/api/v1/liabilities/{id}` | P2 |
| 3.10.4 | Get Many | V1 | GET | `/api/v1/liabilities` | P2 |
| 3.10.5 | Release | V1 | POST | `/api/v1/liabilities/{id}/release` | P2 |
| 3.10.6 | Upload File | V1 | POST | `/api/v1/liabilities/{id}/files` | P3 |

#### 3.11 Collective Bill
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 3.11.1 | Create | V1 | POST | `/api/v1/collectivebills` | P3 |

---

### Module 4: Warehousing & Inventory

#### 4.1 Warehouse
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 4.1.1 | Create | V1 | POST | `/api/v1/warehouses` | P1 |
| 4.1.2 | Get Many | V1 | GET | `/api/v1/warehouses` | P1 |
| 4.1.3 | Update | V1 | PATCH | `/api/v1/warehouses/{id}` | P2 |
| 4.1.4 | Delete | V1 | DELETE | `/api/v1/warehouses/{id}` | P2 |

#### 4.2 Storage Location
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 4.2.1 | Create | V1 | POST | `/api/v1/warehouses/{id}/storageLocations` | P1 |
| 4.2.2 | Get Many | V1 | GET | `/api/v1/warehouses/{id}/storageLocations` | P1 |
| 4.2.3 | Update | V1 | PATCH | `/api/v1/warehouses/{id}/storageLocations/{locId}` | P2 |
| 4.2.4 | Delete | V1 | DELETE | `/api/v1/warehouses/{id}/storageLocations/{locId}` | P2 |
| 4.2.5 | Set Total Stock | V1 | PATCH | `/api/v1/warehouses/{id}/storageLocations/{locId}/stock` | P1 |

#### 4.3 Storage Item
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 4.3.1 | Get Many | V2 | GET | `/api/v2/warehouses/{id}/storageItems` | P1 |
| 4.3.2 | Add to Location | V1 | POST | `/api/v1/warehouses/{id}/storageLocations/{locId}/items` | P1 |
| 4.3.3 | Retrieve from Location | V1 | DELETE | `/api/v1/warehouses/{id}/storageLocations/{locId}/items/{itemId}` | P2 |

#### 4.4 Goods Receipt
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 4.4.1 | Create for Purchase Order | V1 | POST | `/api/v1/purchaseorders/{id}/goodsReceipts` | P2 |
| 4.4.2 | Create for Return | V1 | POST | `/api/v1/returns/{id}/goodsReceipts` | P2 |

#### 4.5 Stock Movement Types
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 4.5.1 | Create | V1 | POST | `/api/v1/stockMovementTypes` | P3 |

---

### Module 5: Shipping & Fulfillment

#### 5.1 Shipping Method
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 5.1.1 | Create | V1 | POST | `/api/v1/shippingMethods` | P1 |
| 5.1.2 | Get | V1 | GET | `/api/v1/shippingMethods/{id}` | P1 |
| 5.1.3 | Get Many | V1 | GET | `/api/v1/shippingMethods` | P1 |
| 5.1.4 | Update | V1 | PATCH | `/api/v1/shippingMethods/{id}` | P1 |

#### 5.2 Delivery Terms
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 5.2.1 | Get Many | V1 | GET | `/api/v1/deliveryTerms` | P2 |

#### 5.3 Carrier Integration (Separate Service)
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 5.3.1 | Get Carriers | CIS | GET | `/carriers` | P2 |
| 5.3.2 | Create Shipment (Label) | CIS | POST | `/shipments` | P2 |
| 5.3.3 | Get Shipment | CIS | GET | `/shipments/{id}` | P2 |
| 5.3.4 | Cancel Shipment | CIS | DELETE | `/shipments/{id}` | P2 |

---

### Module 6: Finance & Accounting

#### 6.1 Payment Methods
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 6.1.1 | Get Many | V1 | GET | `/api/v1/paymentMethods` | P1 |

#### 6.2 Payment Terms Group
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 6.2.1 | Create | V1 | POST | `/api/v1/paymentTermsGroups` | P2 |
| 6.2.2 | Get | V1 | GET | `/api/v1/paymentTermsGroups/{id}` | P2 |
| 6.2.3 | Get Many | V1 | GET | `/api/v1/paymentTermsGroups` | P2 |

#### 6.3 Payment Transaction
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 6.3.1 | Get | V1 | GET | `/api/v1/paymentTransactions/{id}` | P2 |
| 6.3.2 | Update Status | V1 | PATCH | `/api/v1/paymentTransactions/{id}/status` | P2 |

#### 6.4 Payment Service Provider
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 6.4.1 | Create Transaction | V1 | POST | `/api/v1/paymentServiceProviders/{id}/transactions` | P2 |
| 6.4.2 | Get Many | V1 | GET | `/api/v1/paymentServiceProviders` | P2 |

#### 6.5 Tax Rate
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 6.5.1 | Get Many | V1 | GET | `/api/v1/taxRates` | P1 |

#### 6.6 Accounting Export
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 6.6.1 | Check Status | V1 | GET | `/api/v1/accountingExports/status` | P3 |
| 6.6.2 | Execute CSV Export | V1 | POST | `/api/v1/accountingExports/csv` | P3 |
| 6.6.3 | Execute XML Export | V1 | POST | `/api/v1/accountingExports/xml` | P3 |
| 6.6.4 | Download | V1 | GET | `/api/v1/accountingExports/{id}/download` | P3 |

---

### Module 7: Production

#### 7.1 Production Order
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 7.1.1 | Get | V1 | GET | `/api/v1/productions/{id}` | P2 |
| 7.1.2 | Get Many | V1 | GET | `/api/v1/productions` | P2 |
| 7.1.3 | Release | V1 | POST | `/api/v1/productions/{id}/release` | P2 |
| 7.1.4 | Cancel | V1 | POST | `/api/v1/productions/{id}/cancel` | P2 |

**V3 Alternative:**
| 7.1.5 | CRUD (V3) | V3 | ALL | `/api/v3/productions` | P3 |

---

### Module 8: Analytics & Reporting

#### 8.1 Report
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 8.1.1 | Create | V1 | POST | `/api/v1/reports` | P3 |
| 8.1.2 | Get | V1 | GET | `/api/v1/reports/{id}` | P3 |
| 8.1.3 | Get Many | V1 | GET | `/api/v1/reports` | P3 |
| 8.1.4 | Update | V1 | PATCH | `/api/v1/reports/{id}` | P3 |
| 8.1.5 | Delete | V1 | DELETE | `/api/v1/reports/{id}` | P3 |
| 8.1.6 | Execute Query | V1 | POST | `/api/v1/reports/{id}/query` | P3 |

#### 8.2 Report Export
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 8.2.1 | Create Export | V1 | POST | `/api/v1/reports/{id}/exports` | P3 |
| 8.2.2 | Get Exports | V1 | GET | `/api/v1/reports/{id}/exports` | P3 |
| 8.2.3 | Download Export | V1 | GET | `/api/v1/reports/{id}/exports/{exportId}/download` | P3 |

#### 8.3 Report Credits
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 8.3.1 | Get Credit Info | V1 | GET | `/api/v1/reports/credits` | P3 |

---

### Module 9: Settings & Configuration

#### 9.1 Webhook
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 9.1.1 | Create | V1 | POST | `/api/v1/webhooks` | P0 |
| 9.1.2 | Get | V1 | GET | `/api/v1/webhooks/{id}` | P0 |
| 9.1.3 | Get Many | V1 | GET | `/api/v1/webhooks` | P0 |
| 9.1.4 | Update | V1 | PATCH | `/api/v1/webhooks/{id}` | P0 |
| 9.1.5 | Delete | V1 | DELETE | `/api/v1/webhooks/{id}` | P0 |
| 9.1.6 | List Event Types | V1 | GET | `/api/v1/webhooks/eventTypes` | P0 |

#### 9.2 Tag
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 9.2.1 | Create | V1 | POST | `/api/v1/tags` | P1 |
| 9.2.2 | Get Many | V1 | GET | `/api/v1/tags` | P1 |
| 9.2.3 | Delete | V1 | DELETE | `/api/v1/tags/{id}` | P2 |
| 9.2.4 | Bulk Update | V1 | PATCH | `/api/v1/tags` | P2 |
| 9.2.5 | Bulk Assign | V1 | POST | `/api/v1/tags/assign` | P2 |
| 9.2.6 | Bulk Remove | V1 | POST | `/api/v1/tags/remove` | P2 |

#### 9.3 Sales Channel
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 9.3.1 | Get Many | V2 | GET | `/api/v2/salesChannels` | P2 |

#### 9.4 File
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 9.4.1 | Get | V1 | GET | `/api/v1/files/{id}` | P2 |
| 9.4.2 | Get Many | V1 | GET | `/api/v1/files` | P2 |

#### 9.5 Project
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 9.5.1 | Get Many | V1 | GET | `/api/v1/projects` | P1 |

#### 9.6 User
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 9.6.1 | Create | V1 | POST | `/api/v1/users` | P3 |
| 9.6.2 | Get | V1 | GET | `/api/v1/users/{id}` | P3 |
| 9.6.3 | Get Many | V1 | GET | `/api/v1/users` | P3 |
| 9.6.4 | Update | V1 | PATCH | `/api/v1/users/{id}` | P3 |
| 9.6.5 | Delete | V1 | DELETE | `/api/v1/users/{id}` | P3 |

#### 9.7 Text Template
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 9.7.1 | Get Many | V1 | GET | `/api/v1/textTemplates` | P2 |
| 9.7.2 | Update | V1 | PATCH | `/api/v1/textTemplates/{id}` | P2 |

#### 9.8 Print Job
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 9.8.1 | Create | V1 | POST | `/api/v1/printJobs` | P3 |

#### 9.9 Address Free Fields
| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 9.9.1 | Create | V1 | POST | `/api/v1/addressFreeFields` | P3 |
| 9.9.2 | Get Many | V1 | GET | `/api/v1/addressFreeFields` | P3 |

---

### Module 10: Point of Sale (POS)

| # | Operation | API | Method | Endpoint | Priority |
|---|-----------|-----|--------|----------|----------|
| 10.1 | Get Cashiers | V1 | GET | `/api/v1/pos/cashiers` | P3 |
| 10.2 | PIN Check | V1 | POST | `/api/v1/pos/pinCheck` | P3 |
| 10.3 | Get Cash Register Balance | V1 | GET | `/api/v1/pos/balance` | P3 |
| 10.4 | Get Journals | V1 | GET | `/api/v1/pos/journals` | P3 |
| 10.5 | Add Journal | V1 | POST | `/api/v1/pos/journals` | P3 |
| 10.6 | Add Cash Count | V1 | POST | `/api/v1/pos/cashCounts` | P3 |

---

### Xentral Trigger — Webhook Events

| # | Event | Trigger Key | Priority |
|---|-------|------------|----------|
| T1 | Sales Order Created | `salesOrder.created` | P0 |
| T2 | Sales Order Updated | `salesOrder.updated` | P0 |
| T3 | Sales Order Deleted | `salesOrder.deleted` | P0 |
| T4 | Sales Order Released | `salesOrder.released` | P0 |
| T5 | Sales Order Dispatched | `salesOrder.dispatched` | P1 |
| T6 | Sales Order Sent | `salesOrder.sent` | P1 |
| T7 | Sales Order Archived | `salesOrder.archived` | P2 |
| T8 | Sales Order Imported | `salesOrder.imported` | P1 |
| T9 | Sales Order Protocol Created | `salesOrder.protocolCreated` | P3 |
| T10 | Sales Order Position Created | `salesOrderPosition.created` | P2 |
| T11 | Sales Order Position Updated | `salesOrderPosition.updated` | P2 |
| T12 | Sales Order Position Deleted | `salesOrderPosition.deleted` | P2 |
| T13 | Sales Order Position Delivered | `salesOrderPosition.delivered` | P2 |
| T14 | Product Created | `product.created` | P0 |
| T15 | Product Updated | `product.updated` | P0 |
| T16 | Product Deleted | `product.deleted` | P0 |
| T17 | Product Properties Created | `product.propertiesCreated` | P2 |
| T18 | Product Properties Updated | `product.propertiesUpdated` | P2 |
| T19 | Product Properties Deleted | `product.propertiesDeleted` | P3 |
| T20 | Product Tags Replaced | `product.tagsReplaced` | P2 |
| T21 | Product Variant Created | `product.variantCreated` | P2 |
| T22 | Product Sync Started | `product.syncStarted` | P3 |
| T23 | Sales Price Created | `salesPrice.created` | P2 |
| T24 | Sales Price Updated | `salesPrice.updated` | P1 |
| T25 | Sales Price Deleted | `salesPrice.deleted` | P2 |
| T26 | Purchase Price Created | `purchasePrice.created` | P2 |
| T27 | Purchase Price Updated | `purchasePrice.updated` | P2 |
| T28 | Purchase Price Deleted | `purchasePrice.deleted` | P3 |
| T29 | Product Category Created | `productCategory.created` | P2 |
| T30 | Product Category Updated | `productCategory.updated` | P2 |
| T31 | Product Category Deleted | `productCategory.deleted` | P3 |
| T32 | Customer Created | `customer.created` | P0 |
| T33 | Customer Updated | `customer.updated` | P0 |
| T34 | Customer Deleted | `customer.deleted` | P1 |
| T35 | Purchase Order Created | `purchaseOrder.created` | P1 |
| T36 | Purchase Order Updated | `purchaseOrder.updated` | P1 |
| T37 | Purchase Order Sent | `purchaseOrder.sent` | P2 |
| T38 | Purchase Order Released | `purchaseOrder.released` | P2 |
| T39 | Purchase Order Canceled | `purchaseOrder.canceled` | P2 |
| T40 | Purchase Order Archived | `purchaseOrder.archived` | P3 |
| T41 | Purchase Order Deleted | `purchaseOrder.deleted` | P2 |
| T42 | Purchase Order Protocol | `purchaseOrder.protocolCreated` | P3 |
| T43 | Return Created | `return.created` | P1 |
| T44 | Return Updated | `return.updated` | P2 |
| T45 | Return Released | `return.released` | P2 |
| T46 | Return Sent | `return.sent` | P2 |
| T47 | Return Archived | `return.archived` | P3 |
| T48 | Return Canceled | `return.canceled` | P2 |
| T49 | Delivery Note Created | `deliveryNote.created` | P1 |
| T50 | Delivery Note Updated | `deliveryNote.updated` | P2 |
| T51 | Delivery Note Released | `deliveryNote.released` | P2 |
| T52 | Delivery Note Sent | `deliveryNote.sent` | P2 |
| T53 | Delivery Note Archived | `deliveryNote.archived` | P3 |
| T54 | Invoice Created | `invoice.created` | P1 |
| T55 | Invoice Updated | `invoice.updated` | P2 |
| T56 | Invoice Sent | `invoice.sent` | P2 |
| T57 | Credit Note Created | `creditNote.created` | P2 |
| T58 | Credit Note Updated | `creditNote.updated` | P3 |

---

## API Coverage Matrix

### Summary by Priority

| Priority | Description | Operations | Status |
|----------|------------|------------|--------|
| **P0** | Core (MVP) | ~45 | In Progress |
| **P1** | Essential | ~70 | Planned |
| **P2** | Extended | ~120 | Planned |
| **P3** | Complete | ~100 | Planned |
| **Total** | | **~400** | |

> For the complete endpoint-by-endpoint reference, see **[API_REFERENCE.md](API_REFERENCE.md)**.

### Summary by Module

| Module | Resources | V1/V2 Ops | V3 Ops | Total | Notes |
|--------|-----------|-----------|--------|-------|-------|
| CRM / Contacts | 5 | 21 | 15 | 36 | V3 adds Customer CRUD, Delivery Addresses, Contact Persons |
| Products | 15 | 75 | 5 | 80 | Media versions, variants, BOM, labels, account mapping |
| Business Documents | 14 | 65 | 144+ | 210+ | V3: 8 doc types x 18 ops each (CRUD + line items + actions + files) |
| Warehousing | 7 | 18 | 0 | 18 | Warehouse, locations, items, goods receipt, stock movements |
| Shipping / Carrier | 4 | 9 | 0 | 9 | + 5 Carrier Integration Service endpoints |
| Finance | 6 | 22 | 0 | 22 | Payments, tax, accounting export (CSV + XML) |
| Production | 1 | 4 | 10 | 14 | V3 adds Create, Start, Log Activity, Files |
| Analytics | 5 | 35 | 0 | 35 | Reports, queries, exports, schedules, permalinks |
| Settings | 10 | 25 | 0 | 25 | Webhooks, tags, users, files, projects, auth |
| POS | 1 | 7 | 0 | 7 | Cashiers, journals, cash counts, QR codes |
| **Trigger Events** | — | — | — | **~60** | Kafka-based webhooks |
| **TOTAL** | **68+** | **~280** | **~175** | **~400+** | |

---

## Implementation Checklist

### Phase 0: Foundation (Restructure)
- [ ] Migrate to `@n8n/node-cli` build tooling
- [ ] Add `.node.json` codex files for node categorization
- [ ] Add `usableAsTool: true` for AI agent compatibility
- [ ] Set `strict: true` in n8n package config
- [ ] Add MIT license
- [ ] Fix GenericFunctions: implement correct V1 cursor-based pagination
- [ ] Fix GenericFunctions: implement correct V3 page-based pagination
- [ ] Fix GenericFunctions: integrate `parseXentralError` into error handling
- [ ] Fix GenericFunctions: add retry logic for 429 rate-limit responses
- [ ] Fix credential: remove misleading API version selector
- [ ] Create proper Xentral SVG icon
- [ ] Add `requestDefaults` with dynamic instance URL
- [ ] Restructure to per-resource handler pattern (execute function per resource)
- [ ] Add `listSearch` methods for dynamic dropdowns (customers, products, etc.)

### Phase 1: Core MVP (P0 Operations — ~40 ops)
- [ ] **Customer** — Create, Get, Get Many, Update, Delete, Search (fix: nested body, all fields mapped)
- [ ] **Product** — Create, Get, Get Many, Update, Search, Get Stock (fix: all fields mapped)
- [ ] **Offer (V3)** — Create, Get, Get Many, Update, Add Line Item, Get Line Items, Release
- [ ] **Sales Order** — Import/Create, Get, Get Many, Update
- [ ] **Webhook Trigger** — All P0 events (salesOrder, product, customer CRUD)
- [ ] **Webhook Management** — Create, Get, Get Many, Update, Delete, List Event Types

### Phase 2: Essential Features (P1 Operations — ~60 ops)
- [ ] **Customer Address** — Full CRUD
- [ ] **Customer Contact Person** — Full CRUD
- [ ] **Supplier** — Full CRUD
- [ ] **Product Category** — Full CRUD
- [ ] **Sales Price** — Full CRUD
- [ ] **Purchase Price** — Full CRUD
- [ ] **Offer** — Delete, Update Line Item, Delete Line Item, Cancel, Send
- [ ] **Sales Order** — Delete, Cancel, Dispatch, Get Documents
- [ ] **Invoice** — Create, Get, Get Many, Update, Update Status, Send, Create Position
- [ ] **Delivery Note** — Get, Get Many
- [ ] **Purchase Order** — Create, Get, Get Many, Update
- [ ] **Warehouse** — Create, Get Many
- [ ] **Storage Location** — Create, Get Many, Set Stock
- [ ] **Storage Item** — Get Many, Add to Location
- [ ] **Shipping Method** — Full CRUD
- [ ] **Payment Methods** — Get Many
- [ ] **Tax Rate** — Get Many
- [ ] **Project** — Get Many
- [ ] **Tag** — Create, Get Many
- [ ] **Trigger Events** — All P1 events

### Phase 3: Extended Features (P2 Operations — ~80 ops)
- [ ] **Product Media** — Upload, Get, Get Many, Bulk Update, Bulk Delete
- [ ] **Product Properties** — Create, Get Many, Bulk Update, Bulk Delete
- [ ] **Product Free Fields** — Get, Get Many, Update, Bulk Update
- [ ] **Product Parts (BOM)** — Full CRUD
- [ ] **Product Variants** — Create, Options CRUD, Values CRUD
- [ ] **Product External References** — Full CRUD
- [ ] **Offer** — Write Protection, Attach File, Get Files
- [ ] **Sales Order** — Create Document, Partial Delivery, Shipment
- [ ] **Invoice** — Get Balance, Related Documents, V3 CRUD
- [ ] **Credit Note** — Full CRUD + V3 actions
- [ ] **Delivery Note** — Shipments, V3 CRUD
- [ ] **Purchase Order** — Cancel, Release, V3 CRUD
- [ ] **Return** — Full CRUD + V3
- [ ] **Goods Receipt** — Create for PO, Create for Return
- [ ] **Liability** — Create, Get, Get Many, Release
- [ ] **Carrier Integration** — Get Carriers, Create/Get/Cancel Shipment
- [ ] **Payment Terms Group** — Create, Get, Get Many
- [ ] **Payment Transaction** — Get, Update Status
- [ ] **Production** — Get, Get Many, Release, Cancel
- [ ] **Sales Channel** — Get Many
- [ ] **File** — Get, Get Many
- [ ] **Text Template** — Get Many, Update
- [ ] **Tag** — Delete, Bulk Update, Bulk Assign, Bulk Remove
- [ ] **Trigger Events** — All P2 events

### Phase 4: Complete Coverage (P3 Operations — ~30 ops)
- [ ] **Employee** — Get Many
- [ ] **Product Merchandise Group** — Full CRUD
- [ ] **Product Sales Channel Settings** — Create, Update, Delete
- [ ] **Product Label** — Print, Download PDF
- [ ] **Proforma Invoice (V3)** — CRUD
- [ ] **Service Order (V3)** — CRUD
- [ ] **Collective Bill** — Create
- [ ] **Liability** — Create Recurring, Upload File
- [ ] **Stock Movement Types** — Create
- [ ] **Accounting Export** — Check, Execute CSV/XML, Download
- [ ] **Report** — Full CRUD + Execute Query
- [ ] **Report Export** — Create, Get, Download
- [ ] **Report Credits** — Get Info
- [ ] **User** — Full CRUD
- [ ] **Print Job** — Create
- [ ] **Address Free Fields** — Create, Get Many
- [ ] **POS** — All operations
- [ ] **Trigger Events** — All P3 events

---

## Architecture

### Project Structure

```
n8n-nodes-xentral/
├── credentials/
│   └── XentralApi.credentials.ts          # PAT authentication
├── nodes/
│   └── Xentral/
│       ├── Xentral.node.ts                # Main node (resource router)
│       ├── Xentral.node.json              # Codex metadata
│       ├── XentralTrigger.node.ts         # Webhook trigger node
│       ├── XentralTrigger.node.json       # Trigger codex metadata
│       ├── xentral.svg                    # Node icon
│       ├── transport/
│       │   ├── index.ts                   # HTTP request helpers
│       │   ├── v1.ts                      # V1 API helpers (cursor pagination)
│       │   └── v3.ts                      # V3 API helpers (page pagination)
│       ├── methods/
│       │   ├── listSearch.ts              # Dynamic dropdown loaders
│       │   └── loadOptions.ts             # Static option loaders
│       ├── interfaces.ts                  # Shared TypeScript types
│       └── resources/
│           ├── customer/
│           │   ├── index.ts               # Resource description + operations
│           │   ├── create.ts              # Create operation fields
│           │   ├── get.ts                 # Get operation fields
│           │   ├── getAll.ts              # Get Many operation fields
│           │   ├── update.ts              # Update operation fields
│           │   ├── delete.ts              # Delete operation
│           │   └── search.ts              # Search operation fields
│           ├── product/
│           │   ├── index.ts
│           │   ├── create.ts
│           │   ├── get.ts
│           │   ├── getAll.ts
│           │   ├── update.ts
│           │   └── ...
│           ├── offer/
│           │   ├── index.ts
│           │   ├── create.ts
│           │   ├── get.ts
│           │   ├── getAll.ts
│           │   ├── addLineItem.ts
│           │   ├── release.ts
│           │   └── ...
│           ├── salesOrder/
│           │   └── ...
│           ├── invoice/
│           │   └── ...
│           ├── supplier/
│           │   └── ...
│           ├── warehouse/
│           │   └── ...
│           ├── shippingMethod/
│           │   └── ...
│           ├── tag/
│           │   └── ...
│           ├── webhook/
│           │   └── ...
│           └── ... (one folder per resource)
├── icons/
│   ├── xentral.svg                        # Light mode icon
│   └── xentral.dark.svg                   # Dark mode icon (optional)
├── package.json
├── tsconfig.json
├── eslint.config.mjs
├── .prettierrc
├── LICENSE
└── README.md
```

### API Version Strategy

| API Version | Used For | Pagination | Error Format |
|-------------|----------|------------|-------------|
| **V1** | Customers, Products, Sales Orders, Warehousing, Settings | Cursor-based (`cursor[size]`, `cursor[nextCursor]`) | RFC 9457 |
| **V2** | Product delete, Storage items, Sales channels | Same as V1 | RFC 9457 |
| **V3** | Offers, Credit Notes, V3 alternatives for all docs | Page-based (`page`, `perPage`, `meta.currentPage`) | RFC 9457 |

### Key Architectural Decisions

1. **Programmatic style** (`execute()` method) — not declarative routing — because Xentral requires:
   - Dynamic instance URLs (from credentials)
   - Two different pagination systems (V1 cursor vs V3 page)
   - Complex nested body construction (customer create, order import)
   - Mixed API versions per resource

2. **Per-resource execute handler** — each resource folder exports a `handleResource(this, operation, i)` function, called from the main node's execute loop. This keeps the main node file small.

3. **Separate transport layer** — `transport/v1.ts` and `transport/v3.ts` handle pagination, error parsing, and response normalization independently.

4. **`listSearch` methods** for dynamic dropdowns — users can search and select customers, products, projects, etc. by name instead of entering raw IDs.

---

## Development

### Prerequisites
- Node.js v22+
- npm

### Setup
```bash
git clone https://github.com/yourorg/n8n-nodes-xentral.git
cd n8n-nodes-xentral
npm install
```

### Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start n8n with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run release` | Create a new release |

### Local Testing
```bash
# Link the package for local n8n testing
npm run build
npm link
cd ~/.n8n
npm link n8n-nodes-xentral
# Restart n8n
```

---

## Testing

### Test Matrix

Each resource should be tested against a real Xentral instance for:

| Test | Description |
|------|------------|
| **CRUD** | Create → Read → Update → Delete lifecycle |
| **Pagination** | Fetch all pages of a multi-page result |
| **Error Handling** | Invalid IDs, missing fields, permission errors |
| **Rate Limiting** | Verify retry logic on 429 responses |
| **Edge Cases** | Empty results, special characters, Unicode |

### Demo Instance Limitations
- Demo instances block write operations for some V3 endpoints (e.g., `POST /api/v3/offers` returns 405)
- Use a real instance with `api-v3-offers` feature flag for full testing

---

## License

MIT

---

## Credits

Built by [Mirza Iqbal](https://github.com/yourorg) for the n8n community.
