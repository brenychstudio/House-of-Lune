# ADR 0003: Next.js on the Cloudflare runtime

- Status: Accepted
- Date: 2026-09-05

## Decision

Retain Next.js App Router and package it for Cloudflare Workers with OpenNext. Keep Wrangler configuration current, explicit, observable, and disabled for accidental public preview URLs or `workers.dev` deployment.

## Consequences

The same semantic shell passes Next production and local workerd preview. Production deployment and domain routing remain a separately authorized operation.
