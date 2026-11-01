# Design decisions

Choices that look like gaps in a review but are deliberate, with the evidence behind each.

## Custom API Call does not send a body with GET

Xentral documents body parameters on one GET endpoint, the product label download
(`GET /api/v1/products/{id}/printLabel`, `printingLabel` and `quantity`). The node cannot send them.
n8n's HTTP request helper removes the request data of every GET before it goes out
(`packages/@n8n/backend-network/src/http/axios/request.ts`, the GET branch deletes `data`).
A Body field for GET would therefore be dropped silently, which is worse than not offering it.

So Body is shown only for POST, PATCH, PUT and DELETE, a saved Body is never read for GET, and the
README states the limitation. The label download runs with Xentral's defaults.

## Line item Product ID and Product Number are not sent

The V3 line item update schemas (`UpdateProductLineItemData` and the per-document variants) have no
`product` or `number` property, and the create schemas have no `number`. Xentral ignored both.
The options stay so saved workflows keep their parameters. They are labelled as ignored, never sent,
and an update that sets only them returns `changed: false` with a note instead of an empty request.

## Empty values: when they clear and when they are ignored

An empty value in a saved workflow often comes from an expression that found no upstream data, so
turning "empty" into "clear" would silently erase data after an upgrade. The node therefore clears
only where the field itself says so or where the user opts in.

- Product Update ignores empty values unless the Clear Empty Fields option is on.
- Delivery Date on Invoice and Proforma Invoice updates and on line item updates is cleared by an expression
  that returns null. An empty value is ignored, as in 1.4.4. Proforma Invoice used to send the empty string,
  which is not a date and which Xentral rejected, so leaving it out breaks no working workflow.
- Age Rating None follows Clear Empty Fields too, because an expression can resolve to the empty value.
- An expression that returns null clears price validity dates and address overrides.
