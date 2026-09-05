# BR-04 Entry Criteria

Status: **READY**. BR-04 has not started.

BR-03 verification is recorded in [QA](../qa/BR-03_CATALOG_QA.md) and [result](../reports/BR-03_RESULT.md).

## Satisfied

- Catalog commands and database constraints enforce commercial/variant/edition lifecycle.
- Stable product, variant and finish identifiers can support later presentation bindings.
- EU/EUR, UK/GBP and US/USD pricing resolves effective dates deterministically.
- Published price windows and entries are immutable and overlap races are rejected by PostgreSQL.
- Public queries exclude drafts/inactive variants and derive availability from canonical state.
- MASK 01 is seeded only as DRAFT / UNDECIDED / NOT_FOR_SALE with no fabricated commercial records.
- Storefront object routes read canonical data and retain usable degraded content on database failure.
- PostgreSQL 17 forward/empty bootstrap, checksum rejection, old invariants, unit, E2E, accessibility, build and local Worker smoke pass.

## Next milestone only

BR-04 covers guest/session identity, canonical Customer ID, passwordless/passkey-ready account architecture, addresses, account security/session rules, Collector Space shell, order ownership authorization and privacy-safe identity linking.

The next execution must preserve the stacked branch strategy while PR #19 is unmerged and production deploy coupling is unresolved. No readiness status authorizes production deployment, DNS changes or domain cutover.

Catalog content approval is separate from software readiness: MASK 01 scarcity, acquisition, SKU, finish, edition, capacity, lead time, prices and compliance remain deferred.
