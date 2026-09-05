# BR-FOUNDATION-ULTRA-01 File Plan

This plan is the mandatory pre-edit audit trail. No production source mutation occurred before it was written.

| Planned file or area | Class | Reason | Post-migration responsibility | Proof |
|---|---|---|---|---|
| `.gitignore`, `.gitattributes`, `.editorconfig`, `.npmrc` | ADAPT/NEW | Make generated output, secrets, line endings, and install behavior deterministic | repository hygiene | tracked-file scan, `git diff --check`, `npm ci` |
| `package.json`, `package-lock.json` | ADAPT | Remove legacy runtime dependencies, patch vulnerable compatible packages, add focused test/PG tooling | scripts and dependency lock | install, audit, lint, type, test, build |
| `AGENTS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `.env.example` | NEW | Encode vendor-neutral operating and secret boundaries | contributor/runtime contract | manual review and secret scan |
| `next.config.ts`, `open-next.config.ts` | KEEP/ADAPT | Current minimal pattern builds | framework and adapter configuration | Next/OpenNext builds |
| `wrangler.jsonc` | ADAPT | Remove legacy Worker identity and refresh current non-production compatibility | local/preview Worker config only | schema/type validation and local preview |
| `src/app/layout.tsx`, `page.tsx`, `globals.css`, metadata routes | REBUILD | Legacy identity is embedded throughout | BRENYCH root shell, redirect, tokens, metadata, sitemap, robots, social image | route, a11y, identity, build tests |
| `src/app/[lang]/**` | REBUILD | Wrong information architecture and unapproved translations | canonical `src/app/[locale]/**` route skeleton with `en` only | route smoke and unsupported-locale tests |
| `src/app/api/inquiry/**` | REMOVE | No-op success response is unsafe | intentionally absent until durable inquiry implementation | route/public claim review |
| `src/brand/**` | NEW | Canonical brand token authority is missing | visual primitives and identity constants | unit/visual checks |
| `src/site/content/**`, `src/site/i18n/**`, `src/site/market/**`, `src/site/seo/**` | NEW | Separate typed site-native edit surfaces from JSX and commerce | content, locale, market, metadata contracts | unit and route tests |
| `src/site/components/**` | NEW | Legacy components are brand/data coupled | focused shell, menu, footer, home and generic page presentation | Testing Library and Playwright |
| `src/spatial/**` | NEW | Commerce needs a stable progressive boundary before BR-14 | manifest/capability/fallback interface without renderer | unit test and dependency scan |
| legacy `src/components/**`, `src/content/**`, `src/i18n/**`, `src/lib/**`, `src/types/**` | REMOVE/REBUILD | Demo brand, product, imagery, motion, and renderer assumptions dominate | replaced by scoped brand/site/spatial/modules/platform units | identity/import scan and Git tag recovery |
| legacy `public/media/**`, `public/og/**`, boilerplate and favicon assets | REMOVE/REBUILD | Invented products and framework boilerplate cannot ship | small BRENYCH favicon plus generated OG/fallback visuals | public scan, build, screenshots |
| `tests/unit/**`, `vitest.config.ts`, `tests/setup.ts` | NEW | No unit/component tests exist | domain/site/component behavior gates | red-green command receipts |
| `tests/e2e/**`, `playwright.config.ts` | NEW | No route/a11y/responsive gate exists | browser smoke, keyboard, overflow, axe and screenshots | `npm run test:e2e` |
| `src/modules/shared/**` | NEW | Primitive soup would weaken domain rules | IDs, time, Money, SKU, slug, email, correlation, idempotency, actor | value-object tests |
| `src/modules/catalog/**` | NEW | Product hierarchy is absent | Product/Variant/Edition/Physical Instance contracts | unit and DB constraints |
| `src/modules/customers/**` | NEW | Guest/canonical identity and safe linking are absent | customer/address/identity merge policy surfaces | unit and DB tests |
| `src/modules/pricing/**`, `cart/**`, `orders/**` | NEW | Commercial truth is absent | price books, cart/checkout, snapshots, payment/refund states | unit totals/state and DB immutability |
| `src/modules/inventory/**`, `production/**` | NEW | Stock, capacity, manufacture, and QC are absent | reservations/capacity/recipes/orders/append-only production | state and concurrency tests |
| `src/modules/fulfillment/**`, `aftercare/**` | NEW | Post-production lifecycle is absent | neutral shipment/return/service/warranty contracts | lifecycle and append-only tests |
| `database/migrations/*.sql`, `scripts/db/**`, `compose.yaml` | NEW | PostgreSQL truth and repeatable local setup are absent | versioned schema, runner, check, dev seed, PG 17.11 | empty bootstrap and schema tests |
| `src/platform/db/**` | NEW | Domain requires a provider-neutral persistence adapter | pool, transaction, repositories and services | real integration/concurrency tests |
| `src/platform/events/**`, `idempotency/**`, `audit/**` | NEW | Reliable effects/replay/audit do not exist | outbox worker, fingerprint, durable receipts, append-only audit | atomicity, replay and mutation tests |
| `docs/architecture/adr/**`, `docs/qa/**`, `docs/status/**`, `docs/reports/**` | NEW | Decisions and gates require durable evidence | architecture rationale, QA receipts, roadmap and result | document inventory and command matrix |

