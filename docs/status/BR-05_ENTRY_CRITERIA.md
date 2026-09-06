# BR-05 Entry Criteria

Status: **READY**, subject to the accepted BR-04 stacked branch and its Draft PR remaining the source baseline. BR-05 has not started.

## Satisfied by BR-04

- Anonymous browsing creates no Customer; stateful guest sessions are PII-free and distinct from authenticated sessions.
- BRENYCH Commerce Core remains canonical Customer ID and lifecycle authority.
- Invitation activation reuses the existing customer, links verified email deterministically, and cannot duplicate the account.
- Passwordless challenges are hashed, 15-minute, one-time, replay-safe, and concurrency-tested; public requests are coalesced and bounded by expiring hashed address/caller windows.
- Authenticated sessions are opaque, hash-only at rest, rotated at authentication, idle/absolute limited, revocable, and denied for disabled accounts.
- Passwordless delivery remains a provider-neutral post-response boundary; links use the configured canonical origin and no production provider is claimed or required.
- Address and order repository queries enforce Customer ID ownership.
- Guest-order claim requires matching persisted verified email and cannot reassign ownership.
- Identity and order races are decided transactionally by PostgreSQL.
- Collector Space is functional, semantic, private/no-store/noindex, and truthful when no records exist.
- Database outage fails account access closed without breaking the public storefront.
- Passkey public-credential storage has a stable random user handle without implementing WebAuthn ceremonies.
- PostgreSQL forward/empty migration, old invariants, unit, integration, E2E/accessibility, build, audit, and local Worker gates are recorded in BR-04 QA.

## BR-05 scope boundary

BR-05 may build cart persistence, server-side repricing, checkout state, address/market validation, inventory/capacity/edition reservation policy, guest-to-customer cart transition, and accessible checkout UI on these identity contracts.

BR-05 readiness does not authorize Stripe, tax, shipping, production email, WebAuthn ceremony, Three.js/WebGPU, production deploy, DNS, or `brenych.com` changes. Existing Draft PRs remain unmerged.
