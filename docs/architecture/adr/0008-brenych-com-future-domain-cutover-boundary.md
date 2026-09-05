# ADR 0008: Future brenych.com cutover boundary

- Status: Accepted
- Date: 2026-09-05

## Decision

Treat `brenych.com`, DNS, production secrets, production database provisioning, and deployment as a future controlled cutover. This foundation configures local and preview-safe behavior only.

## Consequences

No repository task can accidentally claim a live production launch. Cutover must include verified ownership, environment configuration, migrations, smoke tests, monitoring, and a controlled rollback plan.
