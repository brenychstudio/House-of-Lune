# BR-03 catalog and pricing contract

## Commands and authorization

CatalogService and PricingService are internal application boundaries with explicit actor/correlation context, PostgreSQL transactions and audit receipts. They are not public API endpoints or Server Actions. Future operations adapters must authenticate/authorize the actor before invoking them; BR-20 governance is not implemented.

Products support DRAFT/ACTIVE/ARCHIVED; scarcity UNDECIDED/CORE/LIMITED/UNIQUE_ATELIER; acquisition NOT_FOR_SALE/PURCHASABLE/INQUIRY_ONLY. Non-active products cannot acquire. UNDECIDED cannot activate. Archival/deactivation is the lifecycle deletion model so commercial history is retained.

Variants carry immutable commercial and finish identity, editable labels, fulfillment mode and nullable production promise. CORE has no numbered cap. LIMITED editions share one size per variant. UNIQUE_ATELIER permits only one edition across the product's variants, including concurrent commands. An inquiry-only atelier product can exist without a stocked variant.

## Pricing

Books follow DRAFT → PUBLISHED. Revision labels are unique stable machine identifiers. EU/EUR, UK/GBP and US/USD are explicit; locale is unrelated. Windows are half-open [effective_from, effective_until), with null until meaning unbounded. Plan finite windows before publication if a successor is intended.

A PostgreSQL GiST exclusion constraint with the standard btree_gist extension rejects overlapping PUBLISHED windows per market, including concurrent direct SQL. Published books and their entries are immutable. Entry edits serialize on the same book row as publication. A new publication never retires another book.

Accepted BR-02 ACTIVE books become PUBLISHED without changing their dates/entries. Legacy RETIRED books remain immutable audit history, outside new price resolution: BR-02 did not record retirement-effective timestamps, so BR-03 does not invent them. Newly published finite windows remain historically resolvable forever.

resolveVariantPrice returns PRICE with exact integer minor units serialized as a decimal string, or NO_PRICE. Ambiguous books throw a conflict. Missing price is never zero. This follows PostgreSQL's [range exclusion model](https://www.postgresql.org/docs/17/rangetypes.html).

## Availability and public reads

Normal queries expose only ACTIVE products and active, finish-identified variants. IN_STOCK requires positive on_hand minus reserved. LIMITED/UNIQUE purchasable variants additionally require unallocated/unreserved editions (expired reservations count as available, matching BR-02 reservation rules). MADE_TO_ORDER requires an applicable price, a coherent promise and free capacity in a window ending after the query instant and no later than its maximum production promise. Missing required data fails closed. BESPOKE/inquiry policy yields INQUIRY without inventing a price.

The read model carries identity, status, scarcity, acquisition, resolved price, derived availability and applicable edition/promise summaries. Internal records and raw inventory/capacity tables are not exposed. BR-05/09 must revalidate allocation at acquisition time.

## Migrations

- 0008_catalog_commercial_profile: safe product defaults, activation/finish/promise checks, stable identities and catalog indexes. Existing inactive labels do not become fabricated finish codes.
- 0009_pricing_effective_windows: published lifecycle, market/range exclusion and immutable book/entry history.
- 0010_catalog_edition_integrity: uniform edition size, product-level one-of-one serialization and edition identity protection.

Migrations 0001–0007 are unchanged. db:check verifies the full checksum ledger and the required active constraints/triggers. Integration suites use explicitly named disposable databases where fixture isolation is necessary; the configured database role therefore requires local test CREATEDB permission.

## MASK 01

Development seed creates only MASK 01 / mask-01 / DRAFT / UNDECIDED / NOT_FOR_SALE. Repeating it preserves the ID. It refuses other environments or an existing contradictory record; it never overwrites approved data or deletes legacy variants. There are no seeded variants, SKU, finish, edition, price, inventory, capacity or physical instances.
