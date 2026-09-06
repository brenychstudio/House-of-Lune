# ADR 0010: Customer identity and Collector Space boundary

- Status: Accepted
- Date: 2026-09-06

## Context

Collector Space will eventually combine private commerce records, physical-object ownership/provenance, and optional spatial presentation. Authentication and authorization cannot depend on a renderer, a provider account, an email address supplied by a form, or visual hiding.

## Decision

BRENYCH Commerce Core owns canonical Customer ID, lifecycle, deterministic identity evidence, authenticated sessions, address ownership, and order ownership. PostgreSQL enforces unique identity/token/credential constraints and transactional claims. React/semantic DOM owns account information and security controls.

The permitted future flow is:

```text
authenticated Customer ID
        ↓
authorized owned-object projection
        ↓
semantic Collector Space
        ↓
optional spatial presentation
```

A Three.js/WebGPU renderer may consume an already-authorized projection. It can never establish authentication, decide authorization, claim an order, expose an address, revoke a session, or become identity authority. BR-04 adds no Three.js/WebGPU code or dependency and does not modify Spatial Product Platform.

## Consequences

- Account operations remain accessible, cache-private, server-authorized DOM flows with or without spatial capability.
- Future asset/presentation bindings consume stable customer-authorized physical-object IDs but do not receive unnecessary PII.
- Renderer failure cannot grant access or break logout/security actions.
- Physical ownership is not fabricated before BR-09/BR-13 create its canonical projection.
