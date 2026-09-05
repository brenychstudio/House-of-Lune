# House of Lune audit

## Executive finding

The repository is a functioning Next.js editorial demonstration with a sound App Router, TypeScript, localization, metadata, responsive layout, and fallback-oriented visual foundation. It is not a production commerce foundation: its product facts are hardcoded demo data, its inquiry endpoint acknowledges without persistence, its spatial scene is a brand-specific ring proxy, and it has no automated tests or transactional domain.

The correct migration is selective: keep the repository/history and core framework knowledge, adapt configuration and metadata patterns, rebuild the public shell and data contracts, remove demo identity/runtime baggage, and add a PostgreSQL-backed modular commerce core.

## Repository and runtime

- One npm workspace with `package-lock.json` v3; no monorepo tooling.
- Next.js App Router, React Server Components with 22 client-marked source files.
- Tailwind v4 imported from a single global stylesheet; separate TypeScript token objects exist but are not the source for all CSS values.
- OpenNext/Wrangler configuration is minimal and built successfully at the baseline Next build layer.
- The baseline Worker name and default site URL are House of Lune-specific.
- No environment schema exists. Only `NEXT_PUBLIC_SITE_URL` is read, with a legacy public URL fallback.
- `node_modules` is ignored but 7,625 dependency files remain tracked from history.
- No tracked `.next`, `.open-next`, `.wrangler`, `.env`, or TypeScript build info was found.

## Application and data flow

- `/` deterministically redirects to `/en`.
- Locale routes use static `en`, `fr`, and `es` dictionaries; unsupported locales produce 404.
- Page components compose typed dictionary/content functions, which is a useful site-native content pattern.
- Product routes read four hardcoded jewelry objects from `src/content/pieces.ts`; no price, cart, order, inventory, or database exists.
- The hero capability check falls back when WebGL is unavailable or reduced motion is enabled, but the active scene and assets are inseparable from the legacy ring demonstration.
- Metadata helpers centralize canonical and alternate URLs, but all identity and OG values are legacy-specific.

## Quality and security

- Baseline typecheck and build pass.
- Baseline lint fails because `SiteHeader` synchronously closes menu state in an effect; two raw hero images also emit performance warnings.
- There are no unit, integration, e2e, accessibility, or database tests.
- `POST /api/inquiry` calls `request.formData()` without content-type/error handling. An empty untyped POST returned HTTP 500.
- A syntactically valid form returns success without persistence, delivery, durable acknowledgement, abuse controls, or email validation. The endpoint must not be presented as a real inquiry channel.
- The mobile menu has no Escape handler, focus trap, focus restoration, or scroll lock.
- A global focus-visible rule and reduced-motion CSS are useful foundations; a skip link is absent.

## Experience and performance

- Baseline screenshots show a coherent dark editorial shell at 1440, 1024, and 390 widths.
- The desktop navigation is clear. At smaller desktop/tablet widths, language controls remain outside the menu and add header density.
- The mobile menu is readable but leaves the blurred page visible and does not implement dialog-like keyboard containment.
- Public media contains 22 legacy files totaling 42,603,093 bytes plus a 494,016-byte legacy OG image.
- The R3F scene uses a procedural proxy object rather than an approved product asset. Keeping it active would preserve demo identity and runtime cost without advancing BR-14.

## Domain gap

The baseline has none of the canonical Product/Variant/Edition/Physical Instance, customer identity, price book, cart/order/payment/refund, inventory/capacity, production/QC, fulfillment/aftercare, outbox, idempotency, audit, or PostgreSQL constructs. These are `NEW`, not adaptations of the `Piece` interface.

## Safety conclusion

The annotated baseline tag and detached audit worktree provide recovery and behavioral evidence. Structural migration may proceed only on `migration/br-00-02-brenych`, using the classification and File Plan in this directory.

