# ADR 0006: Testing and quality gates

- Status: Accepted
- Date: 2026-09-05

## Decision

Require strict TypeScript, linted module boundaries, unit tests, real-PostgreSQL integration/concurrency tests, Playwright route/keyboard/overflow checks, axe analysis, production build, and local Cloudflare preview before a foundation release is marked PASS.

## Consequences

SQLite and mocked database substitutes cannot prove BR-02. Visual evidence complements automation and can expose layout defects that semantic assertions miss.
