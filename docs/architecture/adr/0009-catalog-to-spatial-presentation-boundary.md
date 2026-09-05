# ADR 0009: Catalog to spatial presentation boundary

Status: Accepted for BR-03. Date: 2026-09-05.

PostgreSQL and BRENYCH commerce services own product/variant identity, scarcity, edition allocation, market pricing, availability, capacity and acquisition policy. A renderer may visualize a projection but cannot calculate or overwrite that truth.

PublicObject.productId / productSlug and PublicVariant.variantId / finishCode are the future binding keys. Names and finish labels are presentation text, not identity. Product IDs/slugs and variant IDs/parent/SKUs are immutable; an assigned finish code is immutable while its display label can change.

The semantic DOM remains authority for accessible product information and controls. BR-13 will bind approved digital assets/design revisions through these IDs. BR-14 owns the imperative Three.js/WebGPU runtime. BR-15 owns the authored MASK 01 experience. No manifest registry, asset pipeline, shader, loader, renderer or capability detector is introduced here.

SPP was inspected read-only through BDB; see [reference notes](../SPP_REFERENCE_NOTES_BR03.md). It is a technical reference, never a runtime dependency. Its React/DOM and imperative renderer ownership split is reusable; its showcase products, assets and scene overrides are not BRENYCH content.

Public queries include ACTIVE products and active, finish-identified variants only. Each query uses a repeatable-read, read-only transaction so product, price, inventory, edition and capacity fields describe one consistent database snapshot. Availability is informational; future checkout must revalidate and reserve transactionally.

The local MASK 01 exception is a separate development-only identity query, restricted to the exact draft/noncommercial product. It returns no variants, price, finish, edition, capacity or promise. Normal public queries never include drafts. Production/preview cannot opt into this exception through request parameters.

Object routes execute after Next.js request-time connection(). Read failure produces an explicit unavailable result, never a fabricated Product or commercial defaults. A site-native MASK 01 study remains an editorial fallback with no canonical ID when commercial data cannot be read.

Each request owns and closes its PostgreSQL pool, following the [OpenNext database guidance](https://opennext.js.org/cloudflare/howtos/db). No connection is shared between Worker request lifetimes.
