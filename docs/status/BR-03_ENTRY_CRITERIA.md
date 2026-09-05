# BR-03 Entry Criteria

Status: **READY**

## Satisfied

- Canonical BRENYCH brief is versioned in-repository.
- Legacy public identity and fabricated commercial content are isolated behind an immutable Git tag.
- Product, Variant, Edition, Physical Instance, Market, Currency, Money, and Price Book contracts exist.
- PostgreSQL schema enforces slug, SKU, edition, identity, money, inventory, capacity, and market/currency invariants.
- Migration bootstrap and checksum verification pass from an empty PostgreSQL 17.11 volume.
- Catalog and pricing repositories use parameterized SQL and application-owned transactions.
- The public object route renders truthfully without hardcoded price or availability.
- Unit, integration, browser, accessibility, build, and local Cloudflare preview gates pass.

## BR-03 work to begin next

- define approved design revision and product-media records;
- establish an authorized product-data editing/approval flow;
- add effective-date conflict rules and catalog read models;
- publish real product/variant/edition content only after human commercial approval;
- connect the object page to canonical read data without weakening its static fallback;
- retain provider-neutral interfaces and keep all production deployment/DNS work separately authorized.
