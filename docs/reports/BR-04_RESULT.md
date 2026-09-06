# BR-04 Result

Date: 2026-09-07. **STATUS=PASS**. **BR05_ENTRY_STATUS=READY**.

Workspace: `C:\Users\CONCEPT2048\house-of-lune`. Branch: `feature/br-04-identity`, stacked on accepted `feature/br-03-catalog@55d466b53ba4e15c3f65b312ab33f54da50e48bd`.

## Delivered

- Canonical Customer ID lifecycle with invitation-driven passwordless activation and active-customer sign-in.
- PII-free guest sessions and new opaque authenticated sessions using 256-bit raw values with hash-only PostgreSQL persistence.
- Atomic 15-minute one-time challenges, session rotation, 30-day idle/90-day absolute expiry, logout/all-session revocation, and disabled-account denial.
- Generic timing-bounded public access responses, expiring hashed address/caller abuse controls, post-response provider-neutral delivery, canonical-origin links, bearer-protected loopback development harness, secure cookie policy, Cloudflare query redaction, and clean no-referrer token exchange.
- Deterministic verified-email/provider-subject identities with idempotent linking, conflict rejection, database uniqueness, audit receipts, and no automated merges.
- Owner-scoped address CRUD and order read boundary; transactional verified-email guest-order claim without reassignment.
- Passkey-ready public credential schema with random stable non-PII user handles, multiple credential support, counters/transports/revocation, and no private keys or WebAuthn runtime.
- Request-time private/no-store/noindex Collector Space with real account/address/security actions, authorized orders, truthful empty Owned Objects/care states, and account outage fail-closed behavior.
- Independent future spatial boundary in [ADR 0010](../architecture/adr/0010-customer-identity-and-collector-space-boundary.md).

## Migrations

- `0011_customer_sessions_and_passwordless.sql`
- `0012_customer_identity_hardening.sql`
- `0013_passkey_ready_credentials.sql`

Accepted migrations `0001–0010` are unchanged. Existing BR-03 PostgreSQL data migrated forward without reset; empty bootstrap and checksum tamper rejection are tested.

## Verification

Full final evidence is recorded in [BR-04 Identity QA](../qa/BR-04_IDENTITY_QA.md). The gate includes 57 unit tests, 57 real-PostgreSQL integration tests, 48 passing desktop/mobile E2E cases with two intentional viewport skips, build without database configuration, BR-03 forward migration, schema/checksum verification, dependency audit, source/token leak scans, and local OpenNext/Cloudflare smoke.

## Boundary and next status

Passkey ceremonies/recovery and a production delivery provider remain deliberately deferred. BR-05 may begin from [entry criteria](../status/BR-05_ENTRY_CRITERIA.md), but has not started.

PR #19 and PR #20 remain Draft/unmerged. `main`, SPP, production auth/email, deployment, DNS, and `brenych.com` are unchanged.
