# ADR 0004: PostgreSQL data access and migrations

- Status: Accepted
- Date: 2026-09-05

## Decision

Use PostgreSQL as the transactional authority, accessed through parameterized `pg` repositories. Apply ordered SQL files under an advisory lock, one transaction per migration, and persist SHA-256 checksums.

## Consequences

Critical uniqueness, range, referential, append-only, and concurrency guarantees live in the database as well as application code. The design stays independent of any managed PostgreSQL vendor.
