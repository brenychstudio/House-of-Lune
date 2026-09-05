# BR-02 Domain and Database QA

Date: 2026-09-05
Status: **PASS**

## Domain contracts

The framework-independent `src/modules` layer now covers Product → Variant → Edition → Physical Instance, customer identity evidence, price books, carts, immutable order snapshots, payments/refunds, inventory/capacity, production/QC, shipment, return, service, and warranty concepts.

Verified properties:

- money is non-negative bigint minor units and serializes as decimal strings;
- currency is limited to EUR/GBP/USD and tied to EU/UK/US price books, not locale;
- SKU, slug, email, UUID, timestamp, correlation, idempotency, and actor inputs have explicit validators;
- snapshots deep-copy and freeze commercial values;
- illegal order, production, and return transitions fail with typed domain errors;
- QC corrections remain explicit transitions;
- customer names alone can never authorize an identity merge;
- canonical JSON SHA-256 fingerprints are stable across key order.

Import-boundary lint reported zero errors and the provider-coupling scan reported zero matches in `src/modules`.

## PostgreSQL receipt

- Engine: PostgreSQL 17.11 in the repository Compose service.
- Bootstrap: clean named test volume recreated, seven migrations applied, second migration run was a no-op.
- Migration safety: SHA-256 checksums persisted in `schema_migrations`; changed applied SQL is rejected; migrations use a session advisory lock and per-file transaction.
- Schema inventory: 33 canonical tables.
- Session/columns: UTC session and `timestamptz` for instants.
- Test database only; the development seed is non-sellable and refuses to run in production.

## Invariant suite

`npm run test:integration` passed 4 files and 17 tests against real PostgreSQL. Coverage includes:

- unique product slug and variant SKU;
- edition bounds and uniqueness;
- permanent physical identity and one physical instance per edition;
- non-negative money, inventory, and capacity;
- EU/EUR, UK/GBP, US/USD market/currency validity;
- immutable order snapshots and append-only production/audit history;
- restrictive deletion of referenced commercial records;
- atomic order plus outbox persistence and rollback;
- competing edition/capacity reservations with exactly one winner;
- idempotent replay, changed-fingerprint conflict, and one durable consumer receipt;
- `FOR UPDATE SKIP LOCKED` outbox claims with attempt count, persisted failure, and dead-letter state.

## Provider boundary

Payment, tax, shipping, authentication, email, and managed PostgreSQL providers remain unconnected. Nullable provider references are infrastructure details and do not own BRENYCH domain state.
