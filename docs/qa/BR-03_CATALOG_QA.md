# BR-03 Catalog QA

Date: 2026-09-05. Result: **PASS**.

Source baseline: bc72d5564066758f45b98fb4216e2115e990fb76. Tested implementation: 23500df and its preceding catalog commits. Subsequent closure changes are documentation/evidence only.

## Fresh final gate

| Check | Evidence |
| --- | --- |
| npm ci | 753 packages installed from unchanged lockfile |
| npm audit | 0 vulnerabilities |
| npm run lint | exit 0; no lint errors/warnings |
| npm run typecheck | exit 0 |
| npm run test:unit | 11 files, 41 passed |
| npm run test:integration | 8 files, 36 passed, including all 17 BR-02 invariants |
| npm run test:e2e | 32 passed; 2 intentional desktop skips for mobile-only checks; 0 failures |
| Dedicated unavailable-DB browser run | 2 passed, desktop/mobile |
| npm run build | PASS with DATABASE_URL absent; 16 generated static outputs and 2 dynamic catalog route patterns |
| npm run db:check | 33 tables, 10 matching migrations and required constraints/triggers |
| PostgreSQL | 17.11 |
| Empty bootstrap | Disposable PostgreSQL databases migrated from empty through 0010 |
| Forward migration | Existing BR-02 local DB upgraded through 0008–0010; 0001–0007 unchanged |
| Checksum tampering | Both migrate and check rejected a deliberately altered test ledger |
| git diff --check | PASS |

## Invariants exercised

Activation rejects undecided scarcity and non-active acquisition. Variant activation/finish/promise validation, product archive/deactivation, stable identity, uniform limited editions and product-level unique edition contention are covered.

Price tests cover EUR/GBP/USD, revisions, draft update/publish, missing entries, expired/future/adjacent windows, historical resolution, negative amounts, market mismatch, sequential overlap and synchronized direct-SQL overlap races. Exactly one contender commits. Published entries/windows reject mutation and deletion.

Read tests verify unpublished exclusion, sanitized local draft projection, inventory reservation exhaustion, limited edition reservation/allocation exhaustion, capacity exhaustion, missing promise and missing market price. Seed is idempotent, creates no variant, rejects production/preview and retains canonical identity.

## Cloudflare runtime and visual evidence

Ran npm run preview:cf and tested the actual local Worker at 127.0.0.1:8787:

- / → 307 /en
- /en → 200
- /en/objects → 200
- /en/objects/mask-01 → 200

The local-only .dev.vars supplies development/test configuration; it is ignored and not committed. No Cloudflare config, production secret, Worker deployment or domain change was made.

The same Worker was exercised with healthy PostgreSQL and after docker compose stop. Both states passed six browser captures across 1440, 1024 and 390 px widths. Capture assertions require semantic content, correct canonical/degraded state, no invented money/edition/lead time, no horizontal overflow and no page errors. See [canonical receipt](../evidence/br-03/canonical-receipt.json) and [degraded receipt](../evidence/br-03/degraded-receipt.json). Representative desktop/mobile screenshots were visually inspected; this is foundation/fallback QA, not final MASK 01 art-direction acceptance.

The degraded experience retains editorial study content and static spatial fallback, displays commercial-data unavailability, carries no canonical product ID, and offers no acquire action.

## Scans and operational boundaries

- Active source/config legacy identity matches: 0.
- Suspicious hardcoded commercial strings in src/app and src/site: 0.
- Three/@react-three dependency matches: 0; package and lockfile unchanged.
- Tracked .next/.open-next/.wrangler outputs: 0.
- main, migration baseline and historical preservation tag unchanged.
- SPP inspected read-only via BDB; no imports/copies/dependencies.
- PR #19 confirmed OPEN / DRAFT / unmerged before closure.

Non-blocking tooling output: npm reports upstream package deprecation notices while audit reports 0 vulnerabilities; Playwright emits FORCE_COLOR/NO_COLOR warnings; OpenNext warns about Windows support. One E2E run logged Next's response-stream-closed diagnostic during navigation, with every browser assertion passing; the final Worker capture recorded no page errors.

## Reproduction

Start local PostgreSQL with docker compose up -d --wait. Set DATABASE_URL to the isolated local test database and BRENYCH_ENV=development, then run db:migrate, db:seed:dev and the package verification commands above. Tests requiring isolation create/drop only their own br03_test_<uuid> databases.

Use node scripts/qa/capture-catalog-evidence.mjs against the local Worker. For outage evidence, stop the local test database and set BRENYCH_QA_DEGRADED=1 before the same capture command. These switches are test-runner configuration, not public runtime bypasses.
