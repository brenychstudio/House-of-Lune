# ADR 0001: House of Lune to BRENYCH in-place migration

- Status: Accepted
- Date: 2026-09-05

## Decision

Migrate in the existing repository on a dedicated branch, after preserving the baseline with an annotated tag and detached audit worktree.

## Consequences

History and rollback remain explicit, valuable code is classified before removal, and `main` stays unchanged. Legacy public identity is removed from runtime code and assets rather than kept as an alternate brand surface.
