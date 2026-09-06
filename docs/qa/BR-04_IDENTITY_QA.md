# BR-04 Identity QA

Date: 2026-09-07. Result: **PASS**.

Source baseline: `feature/br-03-catalog@55d466b53ba4e15c3f65b312ab33f54da50e48bd`. Implementation branch: `feature/br-04-identity`.

## Fresh final gate

| Check | Evidence |
| --- | --- |
| npm ci | PASS; lockfile synchronized for missing optional WASM peer records; 0 package version changes |
| npm audit | PASS; 0 vulnerabilities |
| npm run lint | PASS; 0 errors/warnings |
| npm run typecheck | PASS |
| npm run test:unit | 16 files, 57 passed |
| npm run test:integration | 12 files, 57 passed on PostgreSQL 17 |
| npm run test:e2e | 48 passed; 2 intentional desktop skips for mobile-only shell checks; 0 failures |
| npm run build without DATABASE_URL | PASS; account routes remain dynamic and compilation has no database dependency |
| npm run db:check | 38 tables, 13 checksum-matched migrations |
| PostgreSQL forward migration | Disposable accepted BR-03 `0001–0010` database advanced through `0011–0013` without reset |
| Empty bootstrap/checksum rejection | PASS through disposable real-PostgreSQL suites |
| Local OpenNext/Cloudflare preview | PASS on Wrangler 4.129.0; five route smokes plus access/harness controls |
| Token/provider/spatial/generated-output scans | PASS; 0 unintended matches/tracked outputs |
| git diff --check | PASS |

## Security evidence

Unit tests cover canonical email normalization, rejected malformed email, name not identity proof, allowed/denied lifecycle transitions, idle/absolute/revoked/disabled session evaluation, address validation, order-read ownership, verified-email claim eligibility, 256-bit token generation/hash stability, centralized TTLs, secure/local cookie contracts, mutation origin checks, caller-scope trust, logout failure semantics, and Cloudflare query-string redaction.

PostgreSQL tests prove canonical customer invitation without duplication, atomic rollback of invitation/challenge/audit, rejection of path-breaking locale input before challenge creation, hash-only challenge/session persistence, expiry, coalescing, replay rejection, atomic concurrent challenge consumption, explicit session revocation, disabled denial, expiring address/caller abuse windows, PII-free guest sessions, identity idempotency/conflict/concurrent ownership, owner-scoped address CRUD, owned-order query, verified-email guest-order claim/concurrency, multiple owner-scoped passkeys, credential uniqueness, stable user handle, revocation representation, and secret-free audits. A dedicated test builds the accepted `0001–0010` database first and migrates it forward through `0011–0013` without reset.

E2E exercises anonymous access, identical known/unknown response shape and a bounded response window despite a deliberately 1.2-second eligible-delivery delay, per-run bearer protection of the harness, activation, canonical-origin clean redirect, guest/auth token separation, replay rejection, authenticated truthful states, address CRUD and cross-owner denial, logout, outage fail-closed behavior, public-route survival, private cache/robots headers, semantic labels, keyboard-native controls, and axe serious/critical checks.

No raw token is persisted or deliberately logged. Cloudflare logs and traces are configured to redact query strings. Passing browser runs retain no trace or screenshots; failed ephemeral artifacts are removed before closure. Secure cookie attributes are unit-tested independently of localhost, where the explicit non-Secure development name is used.

## Runtime and scope

The local development harness is gated by BRENYCH development environment, explicit identity harness flag, a random per-run bearer secret, and loopback hostname. It holds one-time links only in process memory, never logs them, and is not a production delivery provider.

Account pages are request-time personalized and carry `private, no-store`, `noindex/nofollow/noarchive`, and `no-referrer`. Database errors produce no fallback account/customer data. The public catalog remains independent.

No password, auth-provider authority, production email/SMS, checkout, Stripe, WebAuthn ceremony/library, SPP coupling, Three.js, WebGPU, deployment, DNS, or domain cutover is included.

The actual local Worker returned `/` 307 and `/en`, `/en/account`, `/en/objects`, `/en/objects/mask-01` 200. `/en/account` carried `no-store` and `noindex`; public account access returned the generic 202 shape; the development harness was closed with 404 because its explicit flag was absent. The Worker was shut down after smoke verification.
