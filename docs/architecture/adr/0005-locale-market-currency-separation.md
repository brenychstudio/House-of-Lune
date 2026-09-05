# ADR 0005: Locale, market, and currency separation

- Status: Accepted
- Date: 2026-09-05

## Decision

Model locale, market, and currency independently. BR-01 exposes English only; launch market contracts are EU/EUR, UK/GBP, and US/USD.

## Consequences

Language never silently changes commercial terms, market price books remain deliberate, and future locales can be added without introducing live FX pricing.
