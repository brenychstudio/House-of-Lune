# Target architecture mapping

```text
Next.js BRENYCH shell
  -> typed site content / locale / market / SEO
  -> semantic product foundation and renderer-free spatial boundary
  -> future application commands and read models

Framework-independent commerce modules
  -> catalog, customers, pricing, cart, orders
  -> inventory, production, fulfillment, aftercare
  -> typed ports and deterministic state/value rules

PostgreSQL platform adapter
  -> versioned SQL migrations and explicit transactions
  -> repository/application services
  -> outbox, idempotency, audit, event-consumer receipts

Future provider adapters
  -> payments, tax, shipping, CRM, channels, assets
  -> no provider becomes domain authority
```

## Boundaries

- `src/site` knows Next-facing content concerns but not transactional persistence.
- `src/spatial` exposes manifest/capability/fallback contracts; BR-01 has no renderer.
- `src/modules` is framework-, ORM-, provider-, and runtime-independent.
- `src/platform/db` is the only location that imports `pg`.
- Outbox and idempotency contracts are platform primitives with PostgreSQL enforcement.
- Integrations remain absent until their roadmap milestone.

## Canonical authority mapping

| Concern | BR-00..02 owner |
|---|---|
| Public identity/navigation/editorial shell | typed site-native content |
| Locale selection | site i18n (`en` development shell only) |
| Market/currency validity | shared typed mapping plus PostgreSQL check |
| Product/order/inventory/production truth | commerce modules and PostgreSQL |
| Payment/tax/shipping/CRM/channel execution | future neutral adapters |
| Spatial runtime | future manifest-driven renderer behind current fallback boundary |

