# BR-03 Result

Date: 2026-09-05. **STATUS=PASS**. **BR04_ENTRY_STATUS=READY**.

Workspace: C:\Users\CONCEPT2048\house-of-lune. Branch: feature/br-03-catalog, stacked on migration/br-00-02-brenych at bc72d5564066758f45b98fb4216e2115e990fb76.

## Delivered

- Canonical commercial profiles: CORE / LIMITED / UNIQUE_ATELIER / UNDECIDED and PURCHASABLE / INQUIRY_ONLY / NOT_FOR_SALE.
- Transactional product/variant lifecycle, stable finish identity, edition commands and audit receipts.
- Immutable versioned EU/EUR, UK/GBP and US/USD published price books; deterministic half-open effective windows and PostgreSQL overlap/concurrency protection.
- Public catalog read models and inventory/edition/capacity-derived availability, including safe missing-promise/no-price states.
- Canonical object index/detail integration, semantic commercial DOM, dynamic metadata and controlled database-unavailable fallback.
- Product/variant/finish identifiers for future presentation binding; [ADR 0009](../architecture/adr/0009-catalog-to-spatial-presentation-boundary.md).
- Verified [SPP read-only reference notes](../architecture/SPP_REFERENCE_NOTES_BR03.md).

## MASK 01 truth

The standard local test database contains exactly one MASK 01 / mask-01 Product with ID f81f42c8-157e-49f5-a1a9-992f74fcdcc6, status DRAFT, scarcity UNDECIDED and acquisition NOT_FOR_SALE. A separately seeded QA database was used for browser evidence.

No MASK 01 variant, SKU, finish, edition, price, inventory, capacity, production order or physical instance was created. Seeds retain their database-local canonical ID on repetition. Physical specification, approved materials, fit claims, pricing, edition and delivery promises remain commercial decisions for later approved work.

## Verification

Full evidence: [BR-03 Catalog QA](../qa/BR-03_CATALOG_QA.md).

- 41 unit tests.
- 36 real PostgreSQL integration tests, retaining all 17 BR-02 invariants.
- 32 E2E passed, 2 expected viewport skips; 2 additional unavailable-DB browser cases.
- 12 actual local Worker browser captures across healthy/unavailable PostgreSQL.
- Lint/typecheck/build/schema/checksum/audit/diff gates passed; 0 npm vulnerabilities.
- Build succeeds without DATABASE_URL; no generated deployment directories are tracked.

Migrations: 0008_catalog_commercial_profile, 0009_pricing_effective_windows, 0010_catalog_edition_integrity. PostgreSQL 17.11 forward and empty bootstrap verified. See [catalog contract](../architecture/BR-03_CATALOG_CONTRACT.md) for legacy RETIRED pricing provenance and the immutable publication model.

## Commits and release boundary

- 59017e2 — catalog commercial model and effective-dated pricing.
- a5a7562 — public catalog projections and product-only draft seed.
- 23500df — storefront canonical reads and degraded rendering.
- Documentation/evidence closure is the commit containing this report.

Remote delivery targets a Draft PR from feature/br-03-catalog to migration/br-00-02-brenych. The final execution packet records its verified URL and final documentation HEAD.

main is unchanged; foundation PR #19 remains Draft/unmerged. No production deploy, DNS/domain cutover, provider integration, SPP mutation/runtime dependency, Three.js/WebGPU implementation or later milestone work was performed.

Remaining BR-03 blockers: none. BR-04 can begin from its [entry criteria](../status/BR-04_ENTRY_CRITERIA.md), subject to its own task scope.
