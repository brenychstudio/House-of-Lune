# ADR 0002: Modular monolith boundaries

- Status: Accepted
- Date: 2026-09-05

## Decision

Use a modular monolith: `src/modules` owns pure commerce rules; `src/platform` owns PostgreSQL and runtime adapters; `src/site` owns presentation/content; `src/spatial` owns progressive spatial contracts.

## Consequences

Domain code cannot import React, Next.js, `pg`, Cloudflare, OpenNext, or provider SDKs. Transactions remain in application services and infrastructure can change without rewriting business rules.
