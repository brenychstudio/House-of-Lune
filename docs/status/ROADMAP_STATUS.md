# BRENYCH Roadmap Status

As of 2026-09-06.

| Release | Status | Evidence |
| --- | --- | --- |
| BR-00 — Audit and preservation | PASS | Baseline tag, detached audit, route/dependency/media reports, screenshots |
| BR-01 — Technical and brand foundation | PASS | Canonical shell, typed content, market/environment config, spatial fallback, SEO/a11y/E2E evidence |
| BR-02 — Domain and PostgreSQL foundation | PASS | Independent contracts, seven migrations, repositories/services, 17 real-PostgreSQL invariant tests |
| BR-03 — Catalog, variants, editions, price books | PASS | Transactional catalog, stable finish IDs, effective-dated pricing, overlap races, public read models, truthful draft seed and database-outage evidence |
| BR-04 — Customer identity and account foundation | PASS | Opaque sessions, one-time passwordless activation, deterministic identity, ownership-scoped account data and Collector Space evidence |
| BR-05 — Cart and checkout core | READY | [Entry criteria](BR-05_ENTRY_CRITERIA.md); not started |
| BR-06+ | NOT STARTED | Outside this milestone |

BR-04 lives on `feature/br-04-identity`, stacked on accepted `feature/br-03-catalog` at `55d466b53ba4e15c3f65b312ab33f54da50e48bd`. Foundation PR #19 and catalog PR #20 remain Draft and unmerged. `main` and the production domain remain untouched.

Spatial sequence remains BR-03 catalog identifiers → BR-13 asset/presentation bindings → BR-14 Three/WebGPU runtime → BR-15 MASK 01 experience. MASK 01 commercial/physical decisions remain unapproved.
