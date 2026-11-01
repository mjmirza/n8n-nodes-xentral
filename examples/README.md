# Example Workflows

Ready-to-import n8n workflow files for testing and verifying `n8n-nodes-xentral`.

## How to import

1. Open your n8n instance
2. Click **Add workflow** (or press `Ctrl+N`)
3. Click the **...** menu (top-right) > **Import from File**
4. Select one of the JSON files below
5. Update the **Xentral API** credentials in each node to point to your Xentral instance

## Workflows

| File | Tests | API Version |
|------|-------|-------------|
| `workflow-1-customer-crud-address.json` | Customer Create/Get/Update/Delete + Address Create/GetAll | V2 |
| `workflow-2-offer-lifecycle.json` | Offer Create + Line Items + Verify + Release + Log Activity | V3 |
| `workflow-3-product-sales-price.json` | Product Create/Get/Update/Search/Delete + Sales Price CRUD | V1 |

Workflow 2 leaves a released test offer in Xentral, so run it against a test instance. Xentral only allows draft offers to be deleted.

## What these verify

- **Workflow 1**: V2 API connectivity, nested contactDetails objects, ID passing between nodes, full CRUD lifecycle
- **Workflow 2**: V3 document API, sequential line item additions before verification and release, action operations (release, logActivity), tags format `[{title}]`
- **Workflow 3**: V1 API, nested measurement objects `{value, unit}`, manufacturer fields, pricing `{amount, currency}`, search

## Prerequisites

- A running Xentral instance with API access
- A Personal Access Token (PAT) configured in n8n as **Xentral API** credentials
- At least one existing customer in Xentral (Workflow 2 fetches the first customer)
- Set Product ID in Workflow 2's Add Line Item nodes to existing product IDs in your instance (the examples use `1` and `2`)
- At least one existing project in Xentral (Workflow 3 fetches the first project)
