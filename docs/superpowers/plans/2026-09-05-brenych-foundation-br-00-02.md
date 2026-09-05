# BRENYCH Foundation BR-00 to BR-02 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the House of Lune baseline, migrate this repository in place to a verified BRENYCH shell, and establish framework-independent commerce contracts plus PostgreSQL-enforced invariants.

**Architecture:** Keep the Next.js App Router and OpenNext deployment foundation, replace the legacy public surface with a single-locale typed BRENYCH shell, and keep the spatial layer as a DOM-first fallback boundary. Implement commerce as framework-independent modules; adapt them to PostgreSQL through a small `pg` infrastructure layer and versioned SQL migrations.

**Tech Stack:** Next.js 16.3.4, React 19.2.x, TypeScript 5.9.x, Tailwind CSS 4.3.x, OpenNext Cloudflare 1.20.6, Wrangler 4.129.x, Vitest 5, Playwright 1.63, node-postgres 8.23, PostgreSQL 17.11.

**Spec:** `C:\Users\CONCEPT2048\Downloads\BRENYCH_BR_FOUNDATION_ULTRA_01_R3_CODEX_SVCODE.md` and `docs/canon/BRENYCH_CANONICAL_MASTER_BRIEF_V1.md`

## Global Constraints

- Work in `C:\Users\CONCEPT2048\house-of-lune` on `migration/br-00-02-brenych`; never rewrite or force-push `main`.
- Preserve baseline `ac86caf4dc4abeebcd0f02a4cdc7b7e9ce6580c1` through annotated tag `house-of-lune-pre-brenych-20260905`.
- Do not mutate the existing live `brenych.com`, DNS, registrar, production Workers routes, SPP, or BAF.
- Public identity is exactly `BRENYCH` with descriptor `Objects for the Body`; do not invent public prices, inventory, edition sizes, translations, or product claims.
- The active development locale is `en`; record `LAUNCH_LOCALE_SET=COMMERCIAL_DECISION_PENDING`.
- Market and currency are independent typed values with only `EU/EUR`, `UK/GBP`, and `US/USD` valid at this milestone.
- Spatial presentation is progressive enhancement and remains a renderer-free fallback in BR-01.
- Domain modules do not import Next.js, React, Cloudflare, `pg`, or provider SDKs.
- PostgreSQL is the only database used for BR-02 invariant tests; no SQLite substitute.
- External providers remain neutral boundaries; no Stripe, Sendcloud, SprintCRM, Etsy, or CMS SDK is added.
- Every behavioral change follows red-green-refactor; database constraints are proven against real PostgreSQL.
- Every gate records command, working directory, exit code, output summary, timestamp, and evidence path.

---

### Task 1: Preserve and Audit the Existing Baseline

**Files:**
- Create: `docs/canon/BRENYCH_CANONICAL_MASTER_BRIEF_V1.md`
- Create: `docs/audit/PRE_MIGRATION_BASELINE.md`
- Create: `docs/audit/HOUSE_OF_LUNE_AUDIT.md`
- Create: `docs/audit/HOUSE_OF_LUNE_CLASSIFICATION.csv`
- Create: `docs/audit/HOUSE_OF_LUNE_ROUTE_MAP.md`
- Create: `docs/audit/HOUSE_OF_LUNE_DEPENDENCY_AND_DEPLOYMENT_REPORT.md`
- Create: `docs/audit/BR-00_AUDIT_SUMMARY.md`
- Create: `docs/audit/TARGET_ARCHITECTURE_MAPPING.md`
- Create: `docs/audit/MIGRATION_EXECUTION_MAP.md`
- Create: `docs/audit/BR-FOUNDATION-ULTRA-01_FILE_PLAN.md`
- Create: `docs/evidence/br-00/baseline-house-of-lune/*.png`

**Interfaces:**
- Consumes: baseline Git state and the two authoritative task documents.
- Produces: a byte-identical repository canon, recoverable Git reference, complete `KEEP/ADAPT/REBUILD/REMOVE/NEW` classification, and the mutation gate for Task 2.

- [x] **Step 1: Re-verify clean baseline and create the recoverable references**

  Run `git status --short`, `git branch --show-current`, `git rev-parse HEAD`, `git remote -v`, create the annotated tag, switch to `migration/br-00-02-brenych`, and create the detached audit worktree pinned to `ac86caf4dc4abeebcd0f02a4cdc7b7e9ce6580c1`.

- [x] **Step 2: Reproduce baseline dependency, lint, type, and build state**

  Run in the detached audit worktree:

  ```powershell
  npm ci
  npm run lint
  npx tsc --noEmit
  npm run build
  npm audit --json
  ```

  Expected evidence: install succeeds; lint reports the `SiteHeader` synchronous set-state error; typecheck and build pass; dependency vulnerabilities are recorded without an automatic force-fix.

- [x] **Step 3: Capture baseline routes at 1440x900, 1024x1366, and 390x844**

  Capture Home, Collection, representative Piece, and open mobile menu into `docs/evidence/br-00/baseline-house-of-lune/` and visually inspect them.

- [ ] **Step 4: Copy and hash the canonical brief**

  Copy source bytes without rewriting, then run:

  ```powershell
  Get-FileHash -Algorithm SHA256 'C:\Users\CONCEPT2048\Downloads\BRENYCH_CANONICAL_MASTER_BRIEF_V1.md'
  Get-FileHash -Algorithm SHA256 'docs\canon\BRENYCH_CANONICAL_MASTER_BRIEF_V1.md'
  ```

  Expected: the two hashes are identical.

- [ ] **Step 5: Write audit, route, dependency, target mapping, and File Plan artifacts**

  Record the observed 7,625 tracked `node_modules` paths, 111 source files, 42.6 MB legacy media, 39 generated baseline pages, missing automated tests, insecure no-op inquiry route, legacy identity coupling, runtime spatial coupling, and all verification evidence. The CSV columns are exactly `source_path,classification,reason,risk,planned_action,destination,verification,history_preservation`.

- [ ] **Step 6: Verify the BR-00 documentation gate**

  Run:

  ```powershell
  git diff --check
  git status --short
  Get-ChildItem docs\audit
  ```

  Expected: all required audit documents exist, the only changes are audit/canon/evidence/plan artifacts, and no production source has changed.

- [ ] **Step 7: Commit the coherent audit slice**

  ```powershell
  git add docs
  git commit -m "docs: record House of Lune pre-migration audit"
  ```

---

### Task 2: Repair Repository Hygiene and Establish the Toolchain

**Files:**
- Modify: `.gitignore`
- Create: `.gitattributes`
- Create: `.editorconfig`
- Create: `.npmrc`
- Create: `.env.example`
- Create: `AGENTS.md`
- Create: `CONTRIBUTING.md`
- Create: `SECURITY.md`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `eslint.config.mjs`
- Modify: `tsconfig.json`
- Modify: `wrangler.jsonc`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/setup.ts`
- Remove from index: `node_modules/**`

**Interfaces:**
- Consumes: Task 1 classification and migration branch.
- Produces: deterministic scripts `typecheck`, `test`, `test:unit`, `test:integration`, `test:e2e`, `db:migrate`, `db:check`, `db:seed:dev`, and `verify`.

- [ ] **Step 1: Remove generated dependencies from Git tracking without deleting the working install**

  Run `git rm -r --cached node_modules`, then verify `git ls-files node_modules` returns no paths and `.gitignore` still excludes generated output and secrets.

- [ ] **Step 2: Update compatible direct dependencies and add focused test/database tooling**

  Remove `motion`, `three`, `@react-three/fiber`, and `@react-three/drei`; update Next/OpenNext/Wrangler and compatible patch releases; add `pg@8.23.0`; add Vitest, Testing Library, Playwright, axe, jsdom 29, and `@types/pg` as development dependencies. Keep TypeScript on 5.x and ESLint on 9.39.5 because the Next 16.3 plugin graph does not yet declare ESLint 10 compatibility.

- [ ] **Step 3: Define deterministic scripts**

  The `verify` script runs lint, typecheck, unit tests, integration tests, e2e tests, and build without masking a missing database. `preview:cf` remains a local OpenNext preview command; `deploy:cf` is removed to prevent accidental production mutation in this milestone.

- [ ] **Step 4: Add vendor-neutral contributor, security, environment, and line-ending contracts**

  `.env.example` exposes only non-secret examples such as `NEXT_PUBLIC_SITE_URL=http://localhost:3000` and a local `DATABASE_URL`; operational docs explicitly prohibit production credentials and direct provider coupling.

- [ ] **Step 5: Validate configuration**

  Run `npm ci`, `npm run lint`, `npm run typecheck`, `npx wrangler types --check`, `git diff --check`, and `git ls-files` hygiene scans.

- [ ] **Step 6: Commit hygiene/tooling**

  ```powershell
  git add -A
  git commit -m "chore: establish BRENYCH migration toolchain"
  ```

---

### Task 3: Build the Typed BRENYCH Site Foundation

**Files:**
- Create: `src/brand/tokens.ts`
- Create: `src/site/i18n/config.ts`
- Create: `src/site/market/market.ts`
- Create: `src/site/content/contracts.ts`
- Create: `src/site/content/en.ts`
- Create: `src/site/content/index.ts`
- Create: `src/site/seo/metadata.ts`
- Create: `src/platform/config/environment.ts`
- Test: `tests/unit/site/market.test.ts`
- Test: `tests/unit/site/content.test.ts`
- Test: `tests/unit/platform/environment.test.ts`

**Interfaces:**
- Consumes: no legacy dictionaries or commerce records.
- Produces: `Locale = "en"`, `Market = "EU" | "UK" | "US"`, `Currency = "EUR" | "GBP" | "USD"`, `currencyForMarket(market)`, `getSiteContent(locale)`, and `readPublicEnvironment(input)`.

- [ ] **Step 1: Write failing market/content/environment tests**

  Tests assert literal `EU/EUR`, `UK/GBP`, `US/USD` mappings, reject unsupported locale/market combinations, assert the complete canonical navigation hrefs, and reject malformed `NEXT_PUBLIC_SITE_URL` values.

- [ ] **Step 2: Run tests and verify RED**

  Run `npm run test:unit -- tests/unit/site tests/unit/platform`; expected failure is missing modules/exports.

- [ ] **Step 3: Implement minimal typed modules**

  Use exhaustive records, immutable content values, and a URL parser. Public content includes only approved BRENYCH positioning and honest non-sellable MASK 01 foundation copy; it contains no price, stock, edition size, or invented translation.

- [ ] **Step 4: Run tests and verify GREEN**

  Run `npm run test:unit -- tests/unit/site tests/unit/platform` and `npm run typecheck`.

- [ ] **Step 5: Commit the typed foundation**

  ```powershell
  git add src/brand src/site src/platform/config tests/unit/site tests/unit/platform
  git commit -m "feat: establish BRENYCH typed site foundations"
  ```

---

### Task 4: Replace the Legacy Runtime with the BRENYCH Shell

**Files:**
- Rebuild: `src/app/layout.tsx`
- Rebuild: `src/app/page.tsx`
- Rebuild: `src/app/globals.css`
- Create: `src/app/not-found.tsx`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Create: `src/app/[locale]/objects/page.tsx`
- Create: `src/app/[locale]/objects/[slug]/page.tsx`
- Create: `src/app/[locale]/collections/page.tsx`
- Create: `src/app/[locale]/atelier/page.tsx`
- Create: `src/app/[locale]/journal/page.tsx`
- Create: `src/app/[locale]/about/page.tsx`
- Create: `src/app/[locale]/private-inquiry/page.tsx`
- Create: `src/app/[locale]/account/page.tsx`
- Create: `src/app/[locale]/bag/page.tsx`
- Create: `src/site/components/SiteHeader.tsx`
- Create: `src/site/components/SiteFooter.tsx`
- Create: `src/site/components/FoundationPage.tsx`
- Create: `src/site/components/HomeFoundation.tsx`
- Create: `src/spatial/contracts/SpatialPresentationManifest.ts`
- Create: `src/spatial/contracts/SpatialCapability.ts`
- Create: `src/spatial/fallback/SpatialFallback.tsx`
- Create: `src/spatial/SpatialPresentationBoundary.tsx`
- Rebuild: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx`
- Remove: legacy `src/app/[lang]`, `src/components`, `src/content`, `src/i18n`, `src/lib`, `src/types`, `src/app/api/inquiry`, and legacy `public/media`, `public/og`, boilerplate SVG assets, favicon assets.
- Test: `tests/unit/site/SiteHeader.test.tsx`
- Test: `tests/unit/spatial/SpatialPresentationBoundary.test.tsx`
- Test: `tests/e2e/shell.spec.ts`

**Interfaces:**
- Consumes: Task 3 content, locale, market, environment, and SEO contracts.
- Produces: all canonical BR-01 routes, an accessible menu, semantic shell, canonical metadata, and renderer-free spatial fallback.

- [ ] **Step 1: Write failing component tests**

  `SiteHeader` tests open the menu, constrain focus to interactive menu controls, close on Escape, restore focus to the trigger, and lock/unlock body scroll. `SpatialPresentationBoundary` tests that semantic children and fallback render without importing or initializing a renderer.

- [ ] **Step 2: Run component tests and verify RED**

  Run `npm run test:unit -- tests/unit/site/SiteHeader.test.tsx tests/unit/spatial/SpatialPresentationBoundary.test.tsx`; expected failure is missing components.

- [ ] **Step 3: Implement the accessible shell and fallback boundary**

  Keep DOM content primary. Use an abstract CSS metal/graphite fallback, a visible skip link, one page H1, restrained CSS reveal with a reduced-motion override, and mobile closed state containing only `BRENYCH` and `MENU`.

- [ ] **Step 4: Run component tests and verify GREEN**

  Run component tests, lint, and typecheck; fix only failures caused by this task.

- [ ] **Step 5: Write failing Playwright route/identity/accessibility tests**

  Cover root redirect, every canonical route, unsupported locale 404, representative product 404 behavior, mobile menu keyboard flow, no horizontal overflow at 390px, no public price claims, and axe results with zero serious/critical violations.

- [ ] **Step 6: Run e2e tests and verify RED**

  Run `npm run test:e2e`; expected failures name routes and behavior not yet wired.

- [ ] **Step 7: Wire route files, metadata, sitemap, robots noindex policy, and not-found behavior**

  Product path `mask-01` renders typed, explicitly non-sellable editorial foundation data. Preview/no-production environments emit `noindex`; production indexing depends on an explicit validated environment value.

- [ ] **Step 8: Remove classified legacy runtime and assets**

  Remove only paths listed `REMOVE` or `REBUILD` in the File Plan. Confirm Git history/tag is the recovery mechanism and Three/R3F/Motion imports are zero.

- [ ] **Step 9: Run e2e, lint, typecheck, build, and identity scans**

  Search runtime source/public for `House of Lune`, `Moonlit`, `Maison Lune`, `house-of-lune`, and `spatial-product-platform`; expected runtime/public count is zero.

- [ ] **Step 10: Commit BR-01**

  ```powershell
  git add -A
  git commit -m "feat: migrate public shell to BRENYCH identity"
  ```

---

### Task 5: Implement Framework-Independent Commerce Contracts

**Files:**
- Create: `src/modules/shared/valueObjects.ts`
- Create: `src/modules/catalog/domain.ts`
- Create: `src/modules/customers/domain.ts`
- Create: `src/modules/pricing/domain.ts`
- Create: `src/modules/cart/domain.ts`
- Create: `src/modules/orders/domain.ts`
- Create: `src/modules/inventory/domain.ts`
- Create: `src/modules/production/domain.ts`
- Create: `src/modules/fulfillment/domain.ts`
- Create: `src/modules/aftercare/domain.ts`
- Create: `src/platform/events/contracts.ts`
- Create: `src/platform/idempotency/fingerprint.ts`
- Create: `src/platform/audit/contracts.ts`
- Test: `tests/unit/domain/*.test.ts`

**Interfaces:**
- Consumes: Web-standard `crypto.subtle` only for deterministic request fingerprints.
- Produces: validated branded IDs, UTC timestamps, bigint-minor-unit Money with decimal-string JSON serialization, SKU/slug/email/correlation/idempotency/actor values, canonical entity contracts, state transitions, immutable order snapshot builder, and stable idempotency fingerprint.

- [ ] **Step 1: Write failing value-object tests**

  Assert Money rejects floats and unsupported currencies, serializes `123n` as `{ "minorUnits": "123", "currency": "EUR" }`, SKU/slug reject malformed input, email normalization trims/lowercases without implying customer merge, and timestamps require an explicit UTC offset.

- [ ] **Step 2: Run value-object tests and verify RED**

  Run `npm run test:unit -- tests/unit/domain/valueObjects.test.ts`; expected failure is missing exports.

- [ ] **Step 3: Implement minimal value objects**

  Use constructor functions returning branded primitives and discriminated `DomainError` results; no framework or database imports.

- [ ] **Step 4: Run value-object tests and verify GREEN**

  Run the focused test and typecheck.

- [ ] **Step 5: Write failing aggregate/state tests**

  Cover order total arithmetic, frozen commercial snapshots, product/variant/edition/physical-instance contracts, market price books, guest/customer cart bindings, production transitions including QC correction, return lifecycle, and name-only customer merge rejection.

- [ ] **Step 6: Run aggregate tests and verify RED**

  Run `npm run test:unit -- tests/unit/domain`; expected failures are missing state modules/functions.

- [ ] **Step 7: Implement minimal contracts and transition guards**

  State transitions use explicit adjacency maps and return typed errors for illegal transitions. Snapshot construction copies and deep-freezes commercial values so later product mutation cannot alter the order fact.

- [ ] **Step 8: Write RED fingerprint tests, implement canonical JSON SHA-256, and verify GREEN**

  Equivalent objects with different key insertion order produce the same digest; changed request content produces a different digest.

- [ ] **Step 9: Run the complete unit suite and import-boundary lint**

  Confirm no file under `src/modules/**` imports `next`, `react`, `pg`, Cloudflare, or integration SDKs.

- [ ] **Step 10: Commit the domain slice**

  ```powershell
  git add src/modules src/platform/events src/platform/idempotency src/platform/audit tests/unit/domain
  git commit -m "feat: add BRENYCH commerce domain contracts"
  ```

---

### Task 6: Create the PostgreSQL Schema and Migration Runner

**Files:**
- Create: `compose.yaml`
- Create: `database/migrations/0001_shared_primitives.sql`
- Create: `database/migrations/0002_catalog_and_physical_instances.sql`
- Create: `database/migrations/0003_customers_and_pricing.sql`
- Create: `database/migrations/0004_cart_orders_payments.sql`
- Create: `database/migrations/0005_inventory_capacity_production.sql`
- Create: `database/migrations/0006_fulfillment_aftercare.sql`
- Create: `database/migrations/0007_outbox_idempotency_audit.sql`
- Create: `scripts/db/migrate.mjs`
- Create: `scripts/db/check.mjs`
- Create: `scripts/db/seed-dev.mjs`
- Create: `src/platform/db/pool.ts`
- Create: `src/platform/db/transaction.ts`
- Test: `tests/integration/schema.test.ts`

**Interfaces:**
- Consumes: `DATABASE_URL` and PostgreSQL 17.11.
- Produces: ordered checksum-recorded migrations, a UTC session, transaction helper `withTransaction(pool, work)`, schema inventory check, and production-disabled non-sellable development seed.

- [ ] **Step 1: Write the failing real-PostgreSQL schema tests**

  Tests start from an empty test database and assert all canonical tables plus database rejection of duplicate slug/SKU/edition, out-of-range edition, duplicate physical identity/edition allocation, negative money/stock/capacity, and invalid market/currency pairs.

- [ ] **Step 2: Start local PostgreSQL and verify RED**

  Start Docker Desktop if available, run `docker compose up -d`, then `npm run test:integration -- tests/integration/schema.test.ts`. Expected failure: migrations/tables do not exist.

- [ ] **Step 3: Implement the migration runner and seven SQL migrations**

  Use `schema_migrations(version text primary key, checksum text, applied_at timestamptz)`; acquire a PostgreSQL advisory lock while migrating; execute each new file in one transaction; reject changed checksums.

- [ ] **Step 4: Implement constraints and append/immutable triggers**

  Add trigger functions that reject update/delete of order snapshots and production/shipment/return/service/audit events. Use restrictive foreign keys for commercial history and unique consumer receipts for event replay protection.

- [ ] **Step 5: Apply from empty database and verify GREEN**

  Run `npm run db:migrate`, `npm run db:check`, and the focused schema integration tests.

- [ ] **Step 6: Prove clean bootstrap**

  Recreate the test database/volume through the documented Compose workflow, apply migrations again, and compare the schema check output.

- [ ] **Step 7: Commit database foundation**

  ```powershell
  git add compose.yaml database scripts/db src/platform/db tests/integration/schema.test.ts
  git commit -m "feat: add PostgreSQL schema and migrations"
  ```

---

### Task 7: Implement Transactional PostgreSQL Application Services

**Files:**
- Create: `src/platform/db/repositories/catalogRepository.ts`
- Create: `src/platform/db/repositories/pricingRepository.ts`
- Create: `src/platform/db/repositories/inventoryRepository.ts`
- Create: `src/platform/db/repositories/orderRepository.ts`
- Create: `src/platform/db/repositories/productionRepository.ts`
- Create: `src/platform/db/repositories/idempotencyRepository.ts`
- Create: `src/platform/db/repositories/auditRepository.ts`
- Create: `src/platform/db/services/commerceService.ts`
- Create: `src/platform/events/outboxWorker.ts`
- Test: `tests/integration/commerce.test.ts`
- Test: `tests/integration/concurrency.test.ts`
- Test: `tests/integration/history.test.ts`

**Interfaces:**
- Consumes: `pg.Pool`, Task 5 domain values, and Task 6 schema.
- Produces: create product/variant/price book, reserve/release edition and capacity, create immutable order with atomic outbox, issue physical identity, append production/QC/audit events, durable idempotency replay/conflict, and exactly-once consumer effect receipt.

- [ ] **Step 1: Write failing catalog/pricing/history integration tests**

  Prove real inserts, price-book activation, physical identity, immutable snapshots, append-only events, restrictive commercial deletes, and audit mutation rejection.

- [ ] **Step 2: Run focused tests and verify RED**

  Expected failure is missing repositories/services, not a Docker or connection error.

- [ ] **Step 3: Implement minimal repositories and verify GREEN**

  Parameterize every query, return domain-shaped records, keep transactions in application services, and preserve neutral nullable provider references.

- [ ] **Step 4: Write failing concurrency tests**

  Use two independent PostgreSQL clients synchronized with a barrier; concurrent reservation of one edition and the final capacity unit must each yield exactly one success.

- [ ] **Step 5: Implement atomic reservation statements and verify GREEN**

  Use conditional `UPDATE ... WHERE state = 'AVAILABLE' RETURNING` for editions and `UPDATE ... WHERE total_units - reserved_units >= $quantity RETURNING` for capacity inside transactions.

- [ ] **Step 6: Write failing outbox/idempotency/replay tests**

  Prove rollback leaves neither order nor outbox row, success persists both, repeated same key/fingerprint returns the stored response, a different fingerprint conflicts, and repeated consumer delivery creates one effect receipt.

- [ ] **Step 7: Implement transaction, outbox, idempotency, and consumer claim paths**

  Outbox claims use `FOR UPDATE SKIP LOCKED`, bounded attempts, persisted error/dead-letter status, and explicit correlation/causation/schema version values.

- [ ] **Step 8: Run all PostgreSQL integration and concurrency tests**

  Run `npm run test:integration`; expected result is all 17 canonical invariant groups passing against real PostgreSQL.

- [ ] **Step 9: Commit transactional services**

  ```powershell
  git add src/platform/db src/platform/events tests/integration
  git commit -m "test: enforce BRENYCH transactional invariants"
  ```

---

### Task 8: Verify BR-01/BR-02 and Publish the Result Packet

**Files:**
- Create: `docs/qa/BR-01_SHELL_QA.md`
- Create: `docs/qa/BR-02_DOMAIN_DATABASE_QA.md`
- Create: `docs/evidence/br-01/*.png`
- Create: `docs/status/ROADMAP_STATUS.md`
- Create: `docs/status/BR-03_ENTRY_CRITERIA.md`
- Create: `docs/reports/BR-FOUNDATION-ULTRA-01_RESULT.md`
- Create: `docs/architecture/adr/0001-house-of-lune-to-brenych-in-place-migration.md`
- Create: `docs/architecture/adr/0002-modular-monolith-boundaries.md`
- Create: `docs/architecture/adr/0003-nextjs-cloudflare-runtime.md`
- Create: `docs/architecture/adr/0004-postgresql-data-access-and-migrations.md`
- Create: `docs/architecture/adr/0005-locale-market-currency-separation.md`
- Create: `docs/architecture/adr/0006-testing-and-quality-gates.md`
- Create: `docs/architecture/adr/0007-site-native-content-and-spatial-boundary.md`
- Create: `docs/architecture/adr/0008-brenych-com-future-domain-cutover-boundary.md`

**Interfaces:**
- Consumes: verified BR-00/BR-01/BR-02 artifacts and command outputs.
- Produces: screenshot evidence, ADRs, status, BR-03 entry criteria, and exact PASS/PARTIAL result packet.

- [ ] **Step 1: Run local shell QA and capture screenshots**

  Capture Home, Objects, MASK 01 foundation, and open Menu at 1440x900, 1024x1366, and 390x844 where applicable. Inspect console, hydration, focus, reduced motion, overflow, missing assets, and heading/landmark structure.

- [ ] **Step 2: Build and run local OpenNext preview**

  Run `npm run build`, the OpenNext build, then local preview without any production route or deploy command. Smoke-test `/`, `/en`, `/en/objects`, and `/en/objects/mask-01`.

- [ ] **Step 3: Run the complete verification matrix**

  ```powershell
  npm ci
  npm run lint
  npm run typecheck
  npm run test:unit
  npm run test:integration
  npm run test:e2e
  npm run build
  npm run verify
  git diff --check
  ```

  Also run tracked-output, secret/PII, provider-coupling, identity-leakage, and public-price scans.

- [ ] **Step 4: Write ADRs, QA receipts, roadmap status, and result packet from observed evidence**

  Use `PASS` only for commands that returned success. If Docker/PostgreSQL or OpenNext preview cannot be made available, record exact commands/output and mark the affected gate `PARTIAL` without weakening tests.

- [ ] **Step 5: Commit final evidence**

  ```powershell
  git add docs
  git commit -m "docs: publish BR-00 to BR-02 result packet"
  ```

- [ ] **Step 6: Verify clean migration branch and optional remote handoff**

  Run `git status --short`, `git log --oneline --decorate -n 25`, confirm the baseline tag target and unchanged `main` ref, then push only the migration branch/tag if safe. A draft PR may be created only after all primary gates pass; it must not be merged.

---

## Plan Self-Review

- Spec coverage: BR-00 audit/preservation, BR-01 shell/identity/typed content/spatial/market/SEO/a11y, BR-02 contracts/schema/services/invariants/outbox/idempotency/audit, quality, evidence, ADRs, and BR-03 readiness are mapped.
- Scope control: provider integrations, checkout UI, live prices, production deployment, DNS, current `brenych.com`, SPP, and BAF remain excluded.
- Type consistency: locale/market/currency, Money JSON, transaction helper, repository/service ownership, and outbox/idempotency contracts have one definition and explicit consumers.
- Placeholder scan: no implementation step delegates unspecified behavior; deferred roadmap work is named and excluded rather than represented by production stubs.
