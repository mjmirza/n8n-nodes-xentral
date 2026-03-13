# Xentral API - Complete Endpoint Reference

Cross-referenced against https://developer.xentral.com/reference on 2026-03-12.
This is the authoritative list. The README.md summarizes; this file is exhaustive.

**Total: ~380+ unique operations across V1, V2, V3, and Carrier Integration Service**

---

## V3 Business Document Pattern (Applies to ALL V3 Documents)

Every V3 business document follows an identical pattern. This applies to:
- Offers, Sales Orders, Invoices, Credit Notes, Delivery Notes, Return Orders, Purchase Orders, Proforma Invoices

**Standard sub-resources per document:**

| Sub-resource | Operations |
|-------------|------------|
| **Line Items** | Create, View, Update, Delete (`/{id}/lineitems`, `/{id}/lineitems/{lineitemid}`) |
| **Actions** | Release, Cancel, Send, Log Activity, Set Write Protection, Remove Write Protection (`/{id}/actions/{action}`) |
| **Files** | Attach, Update, Delete (`/{id}/files`, `/{id}/files/{fileid}`) |

**Per document: 5 (CRUD+Delete) + 4 (line items) + 6 (actions) + 3 (files) = 18 operations**
**8 document types x 18 = 144 V3 operations** (plus special actions noted below)

---

## Module 1: CRM / Contacts

### 1.1 Customer

#### V1 (Current)
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/customers` | Create customer |
| GET | `/api/v1/customers` | List customers |
| GET | `/api/v1/customers/{id}` | View customer |
| PATCH | `/api/v1/customers/{id}` | Update customer |
| DELETE | `/api/v1/customers/{id}` | Delete customer |

#### V3 (Modern)
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/customers` | Create customer V3 |
| GET | `/api/v3/customers` | List customers V3 |
| GET | `/api/v3/customers/{id}` | View customer V3 |
| PATCH | `/api/v3/customers/{id}` | Update customer V3 |
| DELETE | `/api/v3/customers/{id}` | Delete customer V3 |

### 1.2 Customer Address

#### V1
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/customer-address` | Create address |
| GET | `/api/v1/customer-address` | List addresses |
| GET | `/api/v1/customer-address/{id}` | View address |
| PATCH | `/api/v1/customer-address/{id}` | Update address |
| DELETE | `/api/v1/customer-address/{id}` | Delete address |

#### V3 (Delivery Address)
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/customers/{customerId}/deliveryaddresses` | Create delivery address V3 |
| GET | `/api/v3/customers/{customerId}/deliveryaddresses` | List delivery addresses V3 |
| GET | `/api/v3/customers/{customerId}/deliveryaddresses/{id}` | View delivery address V3 |
| PATCH | `/api/v3/customers/{customerId}/deliveryaddresses/{id}` | Update delivery address V3 |
| DELETE | `/api/v3/customers/{customerId}/deliveryaddresses/{id}` | Delete delivery address V3 |

### 1.3 Customer Contact Person

#### V1
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/customer/{id}/contact-person` | Create contact person |
| GET | `/api/v1/customer/{id}/contact-persons` | List contact persons |
| GET | `/api/v1/customer/{id}/contact-person/{cpId}` | View contact person |
| PATCH | `/api/v1/customer/{id}/contact-person/{cpId}` | Update contact person |
| DELETE | `/api/v1/customer/{id}/contact-person/{cpId}` | Delete contact person |

#### V3
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/customers/{customerId}/contactpersons` | Create contact person V3 |
| GET | `/api/v3/customers/{customerId}/contactpersons` | List contact persons V3 |
| GET | `/api/v3/customers/{customerId}/contactpersons/{cpId}` | View contact person V3 |
| PATCH | `/api/v3/customers/{customerId}/contactpersons/{cpId}` | Update contact person V3 |
| DELETE | `/api/v3/customers/{customerId}/contactpersons/{cpId}` | Delete contact person V3 |

### 1.4 Supplier

#### V1
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/supplier` | List suppliers |
| GET | `/api/v1/supplier/{id}` | View supplier |
| DELETE | `/api/v1/supplier/{id}` | Delete supplier |

#### V3
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/suppliers` | Create supplier V3 |
| GET | `/api/v3/suppliers` | List suppliers V3 |
| GET | `/api/v3/suppliers/{id}` | View supplier V3 |
| PATCH | `/api/v3/suppliers/{id}` | Update supplier V3 |
| DELETE | `/api/v3/suppliers/{id}` | Delete supplier V3 |

### 1.5 Employee
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/employee` | List employees |

---

## Module 2: Products

### 2.1 Product (V2 - Current)
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/product-v2` | Create product |
| GET | `/api/v1/product-v2` | List products |
| GET | `/api/v1/product-v2/{id}` | View product |
| PATCH | `/api/v1/product-v2/{id}` | Update product |
| PATCH | `/api/v1/product-v2/batch` | Update multiple products |
| DELETE | `/api/v1/product/{id}` | Delete product |
| DELETE | `/api/v1/product/batch` | Delete multiple products |

### 2.2 Product - Related Data
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/product/{id}/media` | View media |
| PATCH | `/api/v1/product/{id}/properties` | Update properties |
| GET | `/api/v1/product/{id}/purchase-prices` | View purchase prices |
| GET | `/api/v1/product/{id}/sales-prices` | View sales prices |
| GET | `/api/v1/product/{id}/po-positions` | View PO positions |
| GET | `/api/v1/product/{id}/so-positions` | View SO positions |
| GET | `/api/v1/product/{id}/production-positions` | View production positions |
| GET | `/api/v1/product/{id}/storage-locations` | View storage locations |
| GET | `/api/v1/product/{id}/stock` | View stock details |
| GET | `/api/v1/product/{id}/reservations` | View reservations |
| GET | `/api/v1/product/{id}/texts` | List product texts |
| PATCH | `/api/v1/product/{id}/account-mapping` | Update account mapping |

### 2.3 Product Category
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/product-category` | Create category |
| GET | `/api/v1/product-category` | List categories |
| GET | `/api/v1/product-category/{id}` | View category |
| PATCH | `/api/v1/product-category/{id}` | Update category |
| DELETE | `/api/v1/product-category/{id}` | Delete category |

### 2.4 Product Media
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/product/{id}/media` | Create media |
| GET | `/api/v1/product/{id}/media` | List media |
| GET | `/api/v1/product/{id}/media/{mId}` | View media |
| PATCH | `/api/v1/product/{id}/media/batch` | Update multiple media |
| DELETE | `/api/v1/product/{id}/media/batch` | Delete multiple media |
| POST | `/api/v1/product/{id}/media/{mId}/version` | Create media version |
| GET | `/api/v1/product/{id}/media/{mId}/version/{vId}` | View media version |
| PATCH | `/api/v1/product/{id}/media/{mId}/version/{vId}` | Update media version |
| DELETE | `/api/v1/product/{id}/media/{mId}/version/{vId}` | Delete media version |

### 2.5 Product Property
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/product-property` | Create properties |
| GET | `/api/v1/product-property` | List properties (global) |
| GET | `/api/v1/product/{id}/properties` | List properties (per product) |
| PATCH | `/api/v1/product-property/batch` | Update multiple properties |
| DELETE | `/api/v1/product-property/batch` | Delete multiple properties |

### 2.6 Product Free Field
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/product-free-field` | List free fields |
| GET | `/api/v1/product-free-field/{id}` | View free field |
| PATCH | `/api/v1/product-free-field/{id}` | Update free field |
| PATCH | `/api/v1/product-free-field/batch` | Update multiple free fields |

### 2.7 Cross Sellings
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/product/{id}/cross-selling` | Create cross selling |
| GET | `/api/v1/product/{id}/cross-sellings` | List cross sellings |
| PATCH | `/api/v1/product/{id}/cross-selling/{csId}` | Update cross selling |
| DELETE | `/api/v1/product/{id}/cross-selling/{csId}` | Delete cross selling |

### 2.8 Product Parts (BOM)
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/product/{id}/parts-v2` | Create parts V2 |
| GET | `/api/v1/product/{id}/parts` | List parts |
| PATCH | `/api/v1/product/{id}/parts-v2/{pId}` | Update parts V2 |
| DELETE | `/api/v1/product/{id}/parts/{pId}` | Delete parts |

### 2.9 External Reference
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/external-reference` | Create external reference |
| GET | `/api/v1/external-reference` | List external references |
| GET | `/api/v1/external-reference/targets` | List targets |
| PATCH | `/api/v1/external-reference/batch` | Update external references |
| DELETE | `/api/v1/external-reference/batch` | Delete external references |

### 2.10 Product Merchandise Group
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/product-merchandise-group` | Create merchandise group |
| GET | `/api/v1/product-merchandise-group` | List merchandise groups |
| GET | `/api/v1/product-merchandise-group/{id}` | View merchandise group |
| PATCH | `/api/v1/product-merchandise-group/{id}` | Update merchandise group |
| DELETE | `/api/v1/product-merchandise-group/{id}` | Delete merchandise group |

### 2.11 Sales Price
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/sales-price` | Create sales price |
| GET | `/api/v1/sales-price` | List sales prices |
| GET | `/api/v1/sales-price/{id}` | View sales price |
| PATCH | `/api/v1/sales-price/{id}` | Update sales price |
| PATCH | `/api/v1/sales-price/batch` | Update multiple |
| DELETE | `/api/v1/sales-price/{id}` | Delete sales price |

#### V3
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/salesprices` | Create sales price V3 |
| GET | `/api/v3/salesprices` | List sales prices V3 |
| GET | `/api/v3/salesprices/{id}` | View sales price V3 |
| PATCH | `/api/v3/salesprices` | Update multiple V3 |
| DELETE | `/api/v3/salesprices/{id}` | Delete sales price V3 |

### 2.12 Purchase Price (V2)
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/purchase-price-v2` | Create purchase price V2 |
| GET | `/api/v1/purchase-price-v2` | List purchase prices V2 |
| GET | `/api/v1/purchase-price/{id}` | View purchase price |
| PATCH | `/api/v1/purchase-price-v2/{id}` | Update purchase price V2 |
| PATCH | `/api/v1/purchase-price-v2/batch` | Update multiple V2 |
| DELETE | `/api/v1/purchase-price/{id}` | Delete purchase price |

### 2.13 Sales Channel Product Settings
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/product/{id}/sales-channel` | Create settings |
| PATCH | `/api/v1/product/{id}/sales-channel` | Update settings |
| DELETE | `/api/v1/product/{id}/sales-channel` | Delete settings |

### 2.14 Product Label
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/product-label/print` | Print label |
| GET | `/api/v1/product-label/download` | Download as PDF |

### 2.15 Matrix Product / Variants
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/product/{id}/variants` | Create variants |
| POST | `/api/v1/product/{id}/option` | Create option |
| PATCH | `/api/v1/product/{id}/option/{optId}` | Update option |
| GET | `/api/v1/product/{id}/options` | List options |
| PATCH | `/api/v1/product/{id}/options/batch` | Update multiple options |
| DELETE | `/api/v1/product/{id}/options/batch` | Delete multiple options |
| POST | `/api/v1/product/{id}/option/{optId}/values` | Create values |
| GET | `/api/v1/product/{id}/option/{optId}/values` | List values |
| GET | `/api/v1/product/{id}/option/{optId}/value/{valId}` | View value |
| PATCH | `/api/v1/product/{id}/option/{optId}/value/{valId}` | Update value |
| DELETE | `/api/v1/product/{id}/option/{optId}/value/{valId}` | Delete value |
| DELETE | `/api/v1/product/{id}/option/{optId}/values/batch` | Delete multiple values |

---

## Module 3: Business Documents

### 3.1 Offer (Angebot) - V3

**CRUD:**
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/offers` | Create |
| GET | `/api/v3/offers` | List |
| GET | `/api/v3/offers/{id}` | View |
| PATCH | `/api/v3/offers/{id}` | Update |
| DELETE | `/api/v3/offers/{id}` | Delete |

**Line Items:**
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/offers/{id}/lineitems` | Create line item |
| GET | `/api/v3/offers/{id}/lineitems/{lineitemId}` | View line item |
| PATCH | `/api/v3/offers/{id}/lineitems/{lineitemId}` | Update line item |
| DELETE | `/api/v3/offers/{id}/lineitems/{lineitemId}` | Delete line item |

**Actions:**
| Method | Endpoint | Operation |
|--------|----------|-----------|
| PATCH | `/api/v3/offers/{id}/actions/release` | Release |
| PATCH | `/api/v3/offers/{id}/actions/cancel` | Cancel |
| PATCH | `/api/v3/offers/{id}/actions/send` | Send |
| PATCH | `/api/v3/offers/{id}/actions/logactivity` | Log activity |
| PATCH | `/api/v3/offers/{id}/actions/setwriteprotection` | Set write protection |
| PATCH | `/api/v3/offers/{id}/actions/removewriteprotection` | Remove write protection |

**Files:**
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/offers/{id}/files` | Attach file |
| PATCH | `/api/v3/offers/{id}/files/{fileId}` | Update file |
| DELETE | `/api/v3/offers/{id}/files/{fileId}` | Delete file |

### 3.2 Sales Order (Auftrag)

**V1:**
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/sales-order/import` | Import/Create |
| GET | `/api/v1/sales-order` | List |
| GET | `/api/v1/sales-order/{id}` | View |
| PATCH | `/api/v1/sales-order/{id}` | Update |
| DELETE | `/api/v1/sales-order/{id}` | Delete |
| POST | `/api/v1/sales-order/{id}/cancel` | Cancel |
| POST | `/api/v1/sales-order/{id}/dispatch` | Dispatch |
| POST | `/api/v1/sales-order/{id}/document` | Create document |
| GET | `/api/v1/sales-order/{id}/documents` | List documents |
| GET | `/api/v1/sales-order/{id}/document/{docId}` | View document |
| PATCH | `/api/v1/sales-order/documents/batch` | Update multiple documents |
| DELETE | `/api/v1/sales-order/documents/batch` | Delete multiple documents |
| PATCH | `/api/v1/sales-order/{id}/partial` | Create partial order |

**V3 (CRUD + Line Items + Actions + Files):** Same pattern as Offer above at `/api/v3/salesorders`

### 3.3 Invoice (Rechnung)

**V1:**
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/invoice` | Create |
| POST | `/api/v1/invoice/positions` | Create positions |
| GET | `/api/v1/invoice` | List |
| GET | `/api/v1/invoice/{id}` | View |
| PATCH | `/api/v1/invoice/{id}` | Update |
| PATCH | `/api/v1/invoice/{id}/status` | Update status |
| PATCH | `/api/v1/invoice/{id}/send-v2` | Send V2 |
| GET | `/api/v1/invoice/{id}/balance` | View balance |
| GET | `/api/v1/invoice/{id}/documents` | View related documents |

**V3 (CRUD + Line Items + Actions + Files):** Same pattern at `/api/v3/invoices`
**Special V3 Action:**
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/invoices/actions/createfromsalesorder` | **Create invoice from sales order** |

### 3.4 Credit Note (Gutschrift)

**V1:**
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/credit-note` | Create |
| GET | `/api/v1/credit-note` | List |
| GET | `/api/v1/credit-note/{id}` | View |
| PATCH | `/api/v1/credit-note/{id}` | Update |
| PATCH | `/api/v1/credit-note/{id}/send` | Send |
| GET | `/api/v1/credit-note/{id}/balance` | View balance |
| GET | `/api/v1/credit-note/{id}/documents` | View related documents |

**V3 (CRUD + Line Items + Actions + Files):** Same pattern at `/api/v3/creditnotes`

### 3.5 Delivery Note (Lieferschein)

**V1:**
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/delivery-note` | List |
| GET | `/api/v1/delivery-note/{id}` | View |
| GET | `/api/v1/delivery-note/{id}/shipments` | View shipments |
| PATCH | `/api/v1/delivery-note/{id}/positions/customs` | Update customs data |
| PATCH | `/api/v1/delivery-note/{id}/quality-control` | Assign QC |

**V3 (CRUD + Line Items + Actions + Files):** Same pattern at `/api/v3/deliverynotes`

### 3.6 Purchase Order (Einkaufsbestellung)

**V1:**
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/purchase-order` | Create |
| GET | `/api/v1/purchase-order` | List |
| GET | `/api/v1/purchase-order/{id}` | View |
| PATCH | `/api/v1/purchase-order/{id}` | Update |
| PATCH | `/api/v1/purchase-order/{id}/cancel` | Cancel |
| PATCH | `/api/v1/purchase-order/{id}/release` | Release |

**V3 (CRUD + Line Items + Actions + Files):** Same pattern at `/api/v3/purchaseorders`

### 3.7 Return Order (Retoure)

**V1:**
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/return` | Create |
| GET | `/api/v1/return` | List |
| GET | `/api/v1/return/{id}` | View |
| POST | `/api/v1/return/{id}/release` | Release |
| POST | `/api/v1/return/{id}/document` | Create document |
| GET | `/api/v1/return/{id}/documents` | List documents |
| GET | `/api/v1/return/{id}/document/{docId}` | View document |
| PATCH | `/api/v1/return/documents/batch` | Update multiple documents |
| DELETE | `/api/v1/return/documents/batch` | Delete multiple documents |
| GET | `/api/v1/return/reasons` | List return reasons |

**V3 (CRUD + Line Items + Actions + Files):** Same pattern at `/api/v3/returnorders`
**Special V3 Action:**
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/returnorders/actions/createfromdeliverynote` | **Create return from delivery note** |

### 3.8 Proforma Invoice (V3 Only)
**V3 (CRUD + Line Items + Actions + Files):** Pattern at `/api/v3/proformainvoices`

### 3.9 Liability (Verbindlichkeit)
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/liability` | Create |
| POST | `/api/v1/liability/recurring` | Create recurring |
| GET | `/api/v1/liability` | List |
| GET | `/api/v1/liability/{id}` | View |
| PATCH | `/api/v1/liability/{id}/release` | Release |
| POST | `/api/v1/liability/{id}/document` | Add file |

### 3.10 Delivery / Shipment (Tracking)
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/shipment` | Create tracking info |
| GET | `/api/v1/delivery` | List deliveries |
| GET | `/api/v1/delivery/{id}` | View delivery |
| GET | `/api/v1/shipment/{id}` | View shipment |

### 3.11 Provisional Return
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/provisional-return` | List provisional returns |

### 3.12 Collective Bill
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/collective-bill` | Create collective bill |

### 3.13 Service Order (V3 - Files Only So Far)
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/serviceorders/{id}/files` | Attach file |
| PATCH | `/api/v3/serviceorders/{id}/files/{fileId}` | Update file |
| DELETE | `/api/v3/serviceorders/{id}/files/{fileId}` | Delete file |

### 3.14 Price Inquiry (V3 - Files Only)
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/priceinquiries/{id}/files` | Attach file |
| PATCH | `/api/v3/priceinquiries/{id}/files/{fileId}` | Update file |
| DELETE | `/api/v3/priceinquiries/{id}/files/{fileId}` | Delete file |

---

## Module 4: Warehousing & Inventory

### 4.1 Warehouse
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/warehouse` | Create |
| GET | `/api/v1/warehouse` | List |
| PATCH | `/api/v1/warehouse/{id}` | Update |
| DELETE | `/api/v1/warehouse/{id}` | Delete |

### 4.2 Storage Location
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/storage-location` | Create |
| GET | `/api/v1/storage-location` | List |
| PATCH | `/api/v1/storage-location/{id}` | Update |
| DELETE | `/api/v1/storage-location/{id}` | Delete |
| PATCH | `/api/v1/storage-location/batch/stock` | Set total stock |

### 4.3 Storage Item
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/storage-item-v2` | List items V2 |
| POST | `/api/v1/storage-location/{id}/item` | Add item to location |
| PATCH | `/api/v1/storage-location/{id}/item/{itemId}` | Retrieve item |

### 4.4 Goods Receipt
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/purchase-order/{id}/goods-receipt` | Create for PO |
| POST | `/api/v1/return/{id}/goods-receipt` | Create for return |

### 4.5 Stock Movement Types
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/stock-movement-type` | Create |

### 4.6 Shipping Method
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/shipping-method` | Create |
| GET | `/api/v1/shipping-method` | List |
| GET | `/api/v1/shipping-method/{id}` | View |
| PUT | `/api/v1/shipping-method/{id}` | Update |

### 4.7 Delivery Terms
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/delivery-terms` | List |

---

## Module 5: Finance & Accounting

### 5.1 Payment Methods
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/payment-method` | List |

### 5.2 Payment Terms Group
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/payment-terms-group` | Create |
| GET | `/api/v1/payment-terms-group` | List |
| GET | `/api/v1/payment-terms-group/{id}` | View |

### 5.3 Payment Transaction
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/payment-transaction/{id}` | View |
| PATCH | `/api/v1/payment-transaction/{id}/status` | Update status |

### 5.4 Payment Service Provider
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/psp-transaction` | Create PSP transaction |
| GET | `/api/v1/psp-transaction` | List PSP transactions |

### 5.5 Tax Rate
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/tax-rate` | List |

### 5.6 Accounting Export
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/accounting-export/status` | Check status |
| GET | `/api/v1/accounting-export/download` | Download |
| POST | `/api/v1/accounting-export/invoices-creditnotes` | Export invoices & credit notes |
| POST | `/api/v1/accounting-export/liabilities` | Export liabilities |
| POST | `/api/v1/accounting-export/account-transactions` | Export account transactions |
| POST | `/api/v1/accounting-export/invoices-xml` | Export invoices XML |
| POST | `/api/v1/accounting-export/creditnotes-xml` | Export credit notes XML |
| POST | `/api/v1/accounting-export/liabilities-xml` | Export liabilities XML |

---

## Module 6: Production

### V1
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/production` | List |
| GET | `/api/v1/production/{id}` | View |
| PATCH | `/api/v1/production/{id}/release` | Release |
| PATCH | `/api/v1/production/{id}/cancel` | Cancel |

### V3
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v3/productions` | Create V3 |
| GET | `/api/v3/productions` | List V3 |
| GET | `/api/v3/productions/{id}` | View V3 |
| DELETE | `/api/v3/productions/{id}` | Delete V3 |
| PATCH | `/api/v3/productions/{id}/actions/release` | Release V3 |
| PATCH | `/api/v3/productions/{id}/actions/start` | **Start production V3** |
| PATCH | `/api/v3/productions/{id}/actions/logactivity` | Log activity V3 |
| POST | `/api/v3/productions/{id}/files` | Attach file V3 |
| PATCH | `/api/v3/productions/{id}/files/{fileId}` | Update file V3 |
| DELETE | `/api/v3/productions/{id}/files/{fileId}` | Delete file V3 |

---

## Module 7: Analytics & Reporting

### Report
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/analytics/report` | Create |
| GET | `/api/v1/analytics/report` | List |
| GET | `/api/v1/analytics/report/{id}` | View |
| PATCH | `/api/v1/analytics/report/{id}` | Update |
| DELETE | `/api/v1/analytics/report/{id}` | Delete |
| POST | `/api/v1/analytics/report/{id}/query` | Execute query |
| POST | `/api/v1/analytics/report/{id}/export` | Create export |
| GET | `/api/v1/analytics/report/{id}/export` | List exports |
| GET | `/api/v1/analytics/report/{id}/export/{expId}` | View export |
| POST | `/api/v1/analytics/report/{id}/permalink` | Create permalink |
| GET | `/api/v1/analytics/report/{id}/permalink` | List permalinks |
| DELETE | `/api/v1/analytics/report/{id}/permalink` | Invalidate permalink |
| GET | `/api/v1/analytics/report/{id}/permalink/download` | Download via permalink |
| POST | `/api/v1/analytics/report/{id}/schedule` | Create schedule |
| GET | `/api/v1/analytics/report/{id}/schedule` | List schedules |
| PATCH | `/api/v1/analytics/report/{id}/schedule/{schId}` | Update schedule |
| DELETE | `/api/v1/analytics/report/{id}/schedule/{schId}` | Delete schedule |
| GET | `/api/v1/analytics/schedule` | List all schedules |

### Query
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/analytics/query` | Execute query |
| POST | `/api/v1/analytics/query-export` | Create export |
| GET | `/api/v1/analytics/query-export` | List exports |
| GET | `/api/v1/analytics/query-export/{id}` | View export |

### Collection
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/analytics/collection` | Create |
| GET | `/api/v1/analytics/collection` | List |
| GET | `/api/v1/analytics/collection/{id}` | View |
| PATCH | `/api/v1/analytics/collection/{id}` | Update |
| DELETE | `/api/v1/analytics/collection/{id}` | Delete |

### Other Analytics
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/analytics/credit` | Get credit info |
| GET | `/api/v1/analytics/report-usage` | Get report usage |
| GET | `/api/v1/analytics/settings` | Get settings |
| PATCH | `/api/v1/analytics/settings` | Update settings |
| GET | `/api/v1/analytics/documentation` | List documentation |

---

## Module 8: Settings & Configuration

### Webhook
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/webhook` | Create |
| GET | `/api/v1/webhook` | List |
| GET | `/api/v1/webhook/{id}` | View |
| PATCH | `/api/v1/webhook/{id}` | Update |
| DELETE | `/api/v1/webhook/{id}` | Delete |
| GET | `/api/v1/webhook/event-types` | List event types |

### Tag
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/tag` | Create |
| GET | `/api/v1/tag` | List |
| DELETE | `/api/v1/tag/batch` | Delete |
| PATCH | `/api/v1/tag/batch` | Update multiple |
| POST | `/api/v1/tag/bulk-assign` | Assign to resources |
| DELETE | `/api/v1/tag/bulk-remove` | Remove from resources |

### User
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/user` | Create |
| GET | `/api/v1/user-v2` | List V2 |
| GET | `/api/v1/user/{id}` | View |
| PATCH | `/api/v1/user/{id}` | Update |
| DELETE | `/api/v1/user/{id}` | Delete |
| GET | `/api/v1/user/{id}/permissions` | List permissions |
| GET | `/api/v1/user/{id}/permissions/download` | Download permissions |
| POST | `/api/v1/user/reset-password` | Reset password |

### File
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/file/{docId}` | List files for document |
| GET | `/api/v1/file/{docId}/{fileId}` | View file |

### Project
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/project` | List projects |
| GET | `/api/v1/project/{id}/pos-settings` | List POS settings |

### Sales Channel
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/sales-channel-v2` | List V2 |

### Text Template
| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/text-template` | List |
| PATCH | `/api/v1/text-template` | Update |

### Address Free Fields
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/address-free-field` | Create |
| GET | `/api/v1/address-free-field` | List |

### Print Job
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/print-job` | Create |

### Auth Platform
| Method | Endpoint | Operation |
|--------|----------|-----------|
| POST | `/api/v1/auth/platform/exchange-token` | Exchange token |

---

## Module 9: Point of Sale

| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/api/v1/cashier` | List cashiers |
| POST | `/api/v1/cashier/pin-check` | PIN check |
| GET | `/api/v1/cash-register/balance` | View balance |
| GET | `/api/v1/pos/journal` | List POS journals |
| POST | `/api/v1/pos/journal/entry` | Add journal entry |
| POST | `/api/v1/pos/cash-count` | Add cash count |
| POST | `/api/v1/qr-code` | Add QR code to document |

---

## Module 10: Carrier Integration Service

| Method | Endpoint | Operation |
|--------|----------|-----------|
| GET | `/carrier/liveness` | Health check |
| GET | `/carrier/carriers` | Get available carriers |
| POST | `/carrier/shipment` | Create shipment (label) |
| GET | `/carrier/shipment/{id}` | Get shipment |
| DELETE | `/carrier/shipment/{id}` | Cancel shipment |

---

## Webhook Events (Trigger Node)

### Sales Order Events
| Event | Key |
|-------|-----|
| Created | `salesOrder.created` |
| Updated | `salesOrder.updated` |
| Deleted | `salesOrder.deleted` |
| Sent | `salesOrder.sent` |
| Imported | `salesOrder.imported` |
| Released | `salesOrder.released` |
| Dispatched | `salesOrder.dispatched` |
| Archived | `salesOrder.archived` |
| Protocol Created | `salesOrder.protocolCreated` |

### Sales Order Position Events
| Event | Key |
|-------|-----|
| Created | `salesOrderPosition.created` |
| Updated | `salesOrderPosition.updated` |
| Deleted | `salesOrderPosition.deleted` |
| Delivered | `salesOrderPosition.delivered` |

### Product Events
| Event | Key |
|-------|-----|
| Created | `product.created` |
| Updated | `product.updated` |
| Deleted | `product.deleted` |
| Properties Created | `product.propertiesCreated` |
| Properties Updated | `product.propertiesUpdated` |
| Properties Deleted | `product.propertiesDeleted` |
| Tags Replaced | `product.tagsReplaced` |
| Variant Created | `product.variantCreated` |
| Sync Started | `product.syncStarted` |

### Price Events
| Event | Key |
|-------|-----|
| Sales Price Created | `salesPrice.created` |
| Sales Price Updated | `salesPrice.updated` |
| Sales Price Deleted | `salesPrice.deleted` |
| Purchase Price Created | `purchasePrice.created` |
| Purchase Price Updated | `purchasePrice.updated` |
| Purchase Price Deleted | `purchasePrice.deleted` |

### Product Category Events
| Event | Key |
|-------|-----|
| Created | `productCategory.created` |
| Updated | `productCategory.updated` |
| Deleted | `productCategory.deleted` |

### Customer Events
| Event | Key |
|-------|-----|
| Created | `customer.created` |
| Updated | `customer.updated` |
| Deleted | `customer.deleted` |

### Purchase Order Events
| Event | Key |
|-------|-----|
| Created | `purchaseOrder.created` |
| Updated | `purchaseOrder.updated` |
| Sent | `purchaseOrder.sent` |
| Released | `purchaseOrder.released` |
| Canceled | `purchaseOrder.canceled` |
| Archived | `purchaseOrder.archived` |
| Deleted | `purchaseOrder.deleted` |
| Protocol Created | `purchaseOrder.protocolCreated` |

### Return Events
| Event | Key |
|-------|-----|
| Created | `return.created` |
| Updated | `return.updated` |
| Released | `return.released` |
| Sent | `return.sent` |
| Archived | `return.archived` |
| Canceled | `return.canceled` |

### Delivery Note Events
| Event | Key |
|-------|-----|
| Created | `deliveryNote.created` |
| Updated | `deliveryNote.updated` |
| Released | `deliveryNote.released` |
| Sent | `deliveryNote.sent` |
| Archived | `deliveryNote.archived` |

### Invoice Events (Unconfirmed - verify with webhook/event-types endpoint)
| Event | Key |
|-------|-----|
| Created | `invoice.created` |
| Updated | `invoice.updated` |
| Sent | `invoice.sent` |

### Credit Note Events (Unconfirmed - verify)
| Event | Key |
|-------|-----|
| Created | `creditNote.created` |
| Updated | `creditNote.updated` |

---

## IMPORTANT: Webhook Event Gaps

The following document types have **NO confirmed webhook events** in the public API documentation:

| Document Type | Webhook Events? | Workaround |
|---------------|----------------|------------|
| **Offer (Angebot)** | **NO** | Poll `/api/v3/offers` with date filter |
| **Invoice (Rechnung)** | Unconfirmed | Poll or verify via `GET /webhook/event-types` |
| **Credit Note (Gutschrift)** | Unconfirmed | Poll or verify via `GET /webhook/event-types` |
| **Proforma Invoice** | **NO** | Poll |
| **Liability** | **NO** | Poll |

This affects the Fiederfarm workflow: after creating an offer via the API, there is no webhook to confirm it was sent or accepted. The Xentral Trigger node should include a **Polling Trigger** mode for these document types as a fallback.

---

## Grand Total

| Category | Unique Operations |
|----------|------------------|
| V1/V2 Endpoints | ~175 |
| V3 Endpoints (8 doc types x ~18 + extras) | ~160 |
| Carrier Integration | 5 |
| Webhook Events (Trigger) | ~60 |
| **TOTAL** | **~400** |
