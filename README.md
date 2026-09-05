# BRENYCH

BRENYCH is the production software foundation for founder-led premium wearable sculptural objects. The repository establishes direct-commerce, physical-edition, production and fulfillment lifecycle, collector/provenance, and service capabilities, with cinematic and spatial product presentation delivered as progressive enhancement.

This foundation is under active development and has not been publicly launched. External payment, tax, shipping, production, and customer-management providers are not connected yet.

## Current status

| Release | Status |
| --- | --- |
| BR-00 | Complete |
| BR-01 | Complete |
| BR-02 | Complete |
| BR-03 | Ready to begin |

- Current work lives on `migration/br-00-02-brenych`.
- Production deployment has not occurred.
- `brenych.com` has not been cut over.
- Payment, tax, and shipping providers are not connected.
- Real commercial catalog data has not been published.

BR-03 entry criteria and the current roadmap are recorded in [`docs/status/BR-03_ENTRY_CRITERIA.md`](docs/status/BR-03_ENTRY_CRITERIA.md) and [`docs/status/ROADMAP_STATUS.md`](docs/status/ROADMAP_STATUS.md).

## Current architecture

### Storefront foundation

- Next.js App Router with React and TypeScript
- Tailwind CSS
- Semantic, DOM-first storefront rendering
- Progressive spatial presentation boundary with a complete static fallback
- Responsive and accessibility foundations
- OpenNext compatibility for Cloudflare Workers

### Commerce foundation

Provider-neutral domain contracts cover:

- Product, Variant, Edition, and Physical Instance
- Customer, Price Book, Cart, and Order
- Payment and Refund
- Inventory, Reservation, and Capacity
- Production and QC
- Shipment and Return
- Service and Warranty

These contracts define the internal commerce model; they do not indicate that external providers are live.

### Transactional foundation

- PostgreSQL with versioned, checksum-verified migrations
- Transactional repositories and application services
- Transactional outbox and durable idempotency
- Append-oriented audit and history records
- Concurrency protection for edition and production-capacity allocation

## Development

Install the locked dependency set and start the local application:

```powershell
npm ci
npm run dev
```

Run the verification commands individually or through the aggregate gate:

```powershell
npm run lint
npm run typecheck
npm run test:unit
npm run test:integration
npm run test:e2e
npm run build
npm run verify
```

Database lifecycle commands:

```powershell
npm run db:migrate
npm run db:check
npm run db:seed:dev
```

Build and preview the OpenNext worker locally:

```powershell
npm run preview:cf
```

The repository does not define a production deployment command.

## Environment and database

Local configuration uses the environment-variable names documented in `.env.example`: `BRENYCH_ENV`, `NEXT_PUBLIC_SITE_URL`, and `DATABASE_URL`. Keep credentials in local, untracked environment configuration; never commit secrets.

PostgreSQL integration tests require the configured test database to be available. Development seeding is guarded by `BRENYCH_ENV` and is not a production catalog publication mechanism.

## Migration provenance

This repository originated from the House of Lune Next.js prototype, which served as the technical migration source for BRENYCH. The complete pre-BRENYCH House of Lune state is preserved at the annotated Git tag `house-of-lune-pre-brenych-20260905`. House of Lune is no longer the active product identity.
