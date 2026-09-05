# BRENYCH — CANONICAL MASTER BRIEF V1

**Status:** CANONICAL / DEVELOPER HANDOFF  
**Purpose:** Product, brand, technical architecture, commerce architecture, operations model, implementation constraints, and full strategic development roadmap for BRENYCH.com.  
**Primary domain:** `BRENYCH.com`  
**Launch markets:** European Union + United Kingdom + United States  
**Document role:** This file is the authoritative V1 brief for implementation. If an implementation decision conflicts with this document, stop and resolve the conflict before proceeding.

---

## 0. Executive Canon

BRENYCH is a founder-led premium brand for **wearable sculptural objects, jewelry, masks, body objects and limited physical editions**. The brand is built around the surname **BRENYCH** rather than an invented label, so the product line compounds the value of the existing public creative identity and authorship behind the work.

BRENYCH.com is not a conventional jewelry template, not an Etsy landing page, and not a generic WebGL showroom. It is the **canonical brand headquarters, principal store and direct-commerce authority**: a cinematic, editorial, spatially directed digital maison where technology is subordinate to art direction and the physical product remains the commercial center.

The project reuses the strongest architectural foundation of the existing **House of Lune** Next.js project, but House of Lune is only a migration source. Its brand identity, old visual assumptions and demo-level presentation are not canonical. BRENYCH must emerge as a new production-grade system at a substantially higher level of design, engineering and commerce maturity.

The canonical technology/business direction is:

- BRENYCH.com is the primary sales channel and source of truth for direct commerce.
- Etsy is a secondary marketplace/discovery/acquisition channel, synchronized with BRENYCH rather than controlling it.
- The storefront remains Next.js-based and uses a progressive WebGPU spatial layer for cinematic product presentation.
- Commerce is fully independent: no Shopify, Medusa or conventional commerce backend as authority.
- PostgreSQL is the transactional database.
- Stripe is the payment processor; Stripe Tax is the tax-calculation/obligation-monitoring adapter.
- Sendcloud is the V1 shipping orchestration adapter behind a BRENYCH-owned fulfillment abstraction.
- SprintCRM remains the relationship authority for client/collector lifecycle when integrated.
- A conventional CMS is not required. Site-native typed content is canonical; Native Site Control is the future governed post-CMS control plane when production-ready.
- Operations are automation-first, exception-first, auditable and approval-gated.
- Security, reliability, recoverability, observability and product compliance are release gates.

---

# PART I — BRAND & PRODUCT CANON

## 1. Brand Architecture

### 1.1 Master brand

The public master brand is:

**BRENYCH**

The wordmark/logo should remain clean and independent. Descriptive lines may change by context without becoming part of the legal/master name.

Approved positioning language includes:

- **Wearable Objects**
- **Sculptural Jewelry**
- **Objects for the Body**

The strongest broad descriptor for the long term is **Objects for the Body**, because it can contain masks, jewelry, neck objects, head objects, body objects and future fashion categories without forcing the brand into traditional jewelry semantics.

### 1.2 Founder and provenance

The brand should visibly communicate authorship rather than behave like an anonymous marketplace label. Product pages, About/Atelier content, press materials, certificates and packaging may identify the founder/designer and Barcelona origin where appropriate.

The brand relationship should remain clear:

- **BRENYCH** — physical fashion / wearable objects / collector-facing brand.
- **Brenych Studio** — broader creative and technology practice.

Do not collapse the two into one storefront identity.

### 1.3 What BRENYCH is not

BRENYCH must not present itself as:

- a “3D-print shop”;
- a costume-prop seller;
- a generic cyber/futuristic Etsy brand;
- a mass-discount ecommerce store;
- a template jewelry store;
- a technology demo with products attached.

3D printing, WebGPU, automation and digital-twin methods are production technologies. They are not the primary value proposition presented to a luxury customer.

---

## 2. Product Positioning

BRENYCH products are **wearable sculptural objects engineered for real use**.

Initial commercial categories should center on a tightly curated capsule rather than a large catalog:

- iconic couture mask / face object;
- one or more neck pieces;
- sculptural earrings / ear objects;
- smaller face/body accessories;
- later: additional limited masks, head objects and atelier pieces.

A strong initial target is approximately **6–10 exceptional SKUs**, not dozens of mediocre listings.

The iconic mask functions as the hero object that creates attention and brand distinction. Smaller objects create lower-friction entry points and more frequent sales.

---

## 3. Physical Product Principles

### 3.1 Wearability target

For full-face masks, the canonical product target is:

**2–4 hours of continuous event wear with normal walking, social interaction and head movement.**

The product is not designed for driving, cycling, sports or strenuous activity.

### 3.2 Mask fit-system principle

The decorative shell and the fitting system must be treated as separate but integrated product systems.

The shell is the permanent visible couture object. The internal fit system is replaceable and engineered for comfort.

Canonical fit-system direction:

- reinforced hidden temple attachment interfaces;
- adjustable premium occipital strap;
- upper anti-rotation stabilizer and/or hidden hair-comb/headband mechanism where needed;
- replaceable soft contact pads at forehead/temple/selected cheek zones;
- minimal load on the nose;
- approximately 2–4 mm clearance from skin across most of the shell where practical;
- replaceable strap, pads and internal chassis;
- quick removal without tools;
- no obvious external buckles, costume-style holes or cheap visible hardware.

Target mass for a full mask should be aggressively controlled. A practical design target is approximately **≤150 g**, with ~200 g treated as an upper warning threshold rather than a desirable specification.

### 3.3 Fit variants

Avoid multiplying shell geometries prematurely. Prefer a universal shell plus an adaptable fitting system with multiple pad thicknesses and/or chassis configurations. A future Fit Kit may contain pad options such as 2 / 4 / 6 mm plus strap sizing.

Do not store full biometric face scans in V1. Store only the minimum fit measurements/configuration needed for customer service and production.

---

## 4. Product Tiers

BRENYCH supports three commercial scarcity models:

### Core Objects
Repeatable products, commonly made-to-order, with no artificial hard edition cap.

### Limited Objects
Numbered editions such as 01/25 … 25/25. Edition allocation is permanent after successful commercial allocation.

### Unique / Atelier
One-of-one, bespoke or special commission pieces.

Not every product should be a limited edition. Scarcity is used intentionally, not as a universal marketing device.

---

# PART II — EXPERIENCE & SITE CANON

## 5. BRENYCH.com Role

BRENYCH.com is the **canonical commerce authority and brand headquarters**.

The site must simultaneously support:

1. premium editorial storytelling;
2. cinematic/spatial product presentation;
3. accessible and performant product discovery;
4. full direct checkout and account flows;
5. collector ownership/provenance experiences;
6. international commerce for EU + UK + USA;
7. operational integration with production, fulfillment, CRM and marketplace channels.

The site should feel closer to a digital maison / spatial exhibition than a conventional product grid, while preserving uncompromised commerce usability.

---

## 6. Visual & Interaction Direction

Canonical visual language:

- restrained premium minimalism;
- dark / graphite / controlled neutral environments;
- metal, body, negative space and controlled light;
- slow, authored camera motion rather than uncontrolled orbiting;
- cinematic reveals;
- precise typography;
- high-quality editorial imagery;
- quiet motion and micro-interactions;
- premium macro examination of material and craft;
- deliberate sound only where it materially improves the experience;
- no motion for motion’s sake.

The site must visually justify premium product pricing through authorship, materiality, precision, craft, technology and presentation.

---

## 7. Spatial Experience Rule

The WebGPU/spatial layer is a **progressive enhancement**, never a prerequisite for commerce.

Canonical load order:

`DOM / product data → poster or lightweight visual → capability detection → progressive spatial load → appropriate asset quality / LOD → full spatial experience`

If WebGPU is unavailable, the device is weak, Save Data is enabled, connection quality is poor, or the spatial runtime fails, the user must retain a complete premium storefront and checkout experience.

**Absolute rule:** Spatial enhances commerce. Spatial never blocks commerce.

The deep spatial layer must use validated internal techniques and reusable components where available, but BRENYCH must not become tightly coupled to another showcase site or repository.

---

## 8. Recommended Information Architecture

Initial high-level navigation:

- **Objects**
- **Collections**
- **Atelier** / Craft
- **Journal**
- **About**
- **Private Inquiry**
- Account / Collector Space
- Bag / Checkout

Avoid excessive navigation depth at launch.

### Home

The homepage should be an authored cinematic entry into the world of BRENYCH, not a carousel and not a generic ecommerce hero. It should progressively introduce one or a small number of key objects before leading into collections and editorial context.

### Product / Object page

A strong canonical chapter model for important objects:

1. **FORM** — full object and silhouette.
2. **MATERIAL** — finish and macro response.
3. **FIT** — relationship to the body and attachment/fitting system.
4. **CRAFT** — manufacturing and finishing language.
5. **OBJECT** — controlled 3D/spatial examination.
6. **ACQUIRE** — finish/edition/price/availability/checkout action.

Product data and purchase controls must remain semantic DOM content even when the surrounding presentation is spatial.

### Collection

Prefer curated spatial/editorial composition over a default four-column catalog grid, but always provide a fast, clear way to view all purchasable objects.

---

# PART III — HOUSE OF LUNE MIGRATION CANON

## 9. Migration Principle

House of Lune is the **technical foundation and migration source**, not the new brand.

The implementation must begin with an audit and classify every meaningful part of the existing project as:

- **KEEP** — technically sound foundation that remains valuable;
- **ADAPT** — useful architecture requiring BRENYCH contracts or modernization;
- **REBUILD** — conceptually useful but below current UX/visual/engineering requirements;
- **REMOVE** — obsolete demo logic, naming, mock assumptions, dead code or conflicting architecture;
- **NEW** — functionality that did not exist in House of Lune.

### 9.1 Likely KEEP / ADAPT areas

Audit before changing, but expected valuable foundations include:

- Next.js App Router structure;
- TypeScript baseline;
- product route concepts;
- localization route concepts;
- SEO/metadata patterns;
- editorial page concepts;
- private inquiry concepts;
- deployment knowledge and Cloudflare/OpenNext compatibility where still appropriate.

### 9.2 REBUILD areas

Expect a complete or near-complete rebuild of:

- brand identity;
- visual shell;
- typography system;
- motion system;
- navigation experience;
- homepage;
- product presentation;
- mobile experience;
- commerce core;
- accounts;
- operations;
- production/inventory;
- spatial presentation architecture;
- data contracts.

### 9.3 REMOVE rule

No House of Lune branding, stale mock product assumptions or demo-only dependencies should leak into production BRENYCH. Preserve historical code only where needed for audit or migration traceability.

---

# PART IV — SYSTEM ARCHITECTURE CANON

## 10. Architectural Style

Use a **modular monolith first**, not premature microservices.

The system may have multiple deployable surfaces (storefront, operations UI, workers), but transactional business domains must remain clearly bounded, typed and testable. Do not create distributed complexity without a demonstrated need.

Logical domain boundaries are canonical even if their first implementation shares a repository or deployment.

Recommended high-level topology:

```text
BRENYCH.COM / Next.js Storefront
        │
        ├── Spatial Experience Layer
        ├── Editorial / Site-native Content
        └── Commerce API / Application Services
                        │
                        ▼
                BRENYCH Commerce Core
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   PostgreSQL      Background Jobs    Event/Outbox
        │               │                │
        └───────────────┼────────────────┘
                        │
        ┌───────────────┼────────────────────────────┐
        ▼               ▼              ▼             ▼
     Stripe        Stripe Tax       Sendcloud    External Channels
                                                    │
                                             Etsy / SprintCRM
```

---

## 11. Authority / Source-of-Truth Matrix

### BRENYCH Commerce Core owns

- products and commercial product identity;
- product variants and finishes;
- price books;
- inventory;
- production capacity;
- carts;
- checkout state;
- customer canonical IDs;
- orders;
- refunds domain state;
- editions and edition allocation;
- physical instances;
- production orders;
- fulfillment state;
- return/service/warranty cases;
- immutable commercial snapshots;
- commerce events.

### PostgreSQL owns

The canonical persisted transactional state for the Commerce Core.

### Stripe owns

Regulated payment processing, card/wallet authorization, 3DS and payment settlement infrastructure. BRENYCH does not store raw card data.

### Stripe Tax owns

Tax calculation and obligation-monitoring assistance. BRENYCH retains canonical tax snapshots on its orders.

### Sendcloud owns

V1 shipping-carrier orchestration and label/tracking integration behind a BRENYCH provider abstraction. It is not the fulfillment authority.

### SprintCRM owns

Relationship intelligence and client lifecycle when connected: prospects, collectors, conversations, follow-ups, segmentation, private-client relationship state.

SprintCRM must not own order/payment/inventory truth.

### Native Site Control owns, once production-ready

Governed control of site-native editable/publishable surfaces through revisions, validation, approval, deployment and verification. It does not become the commerce database.

### Etsy owns

Its own external marketplace listing/order representation. It is a channel, not the master catalog or direct-commerce authority.

---

# PART V — COMMERCE CORE

## 12. PostgreSQL & Transactional Model

PostgreSQL is the primary transactional database.

Required architectural properties:

- relational domain model;
- ACID transactions;
- database constraints for business invariants;
- typed migrations;
- transactional outbox;
- idempotent command processing;
- immutable order/commercial snapshots;
- auditability;
- point-in-time recovery support.

Do not bind the domain model to a specific managed PostgreSQL vendor. Select the provider during infrastructure implementation based on runtime compatibility, backups/PITR, observability, region, cost and connection model.

---

## 13. Core Domain Model

Canonical product identity hierarchy:

`Product → Variant → Edition → Physical Instance`

### Product
The canonical design/commercial concept, e.g. `MASK 01`.

### Variant
Commercial configuration such as `Polished Silver`, `Shadow Chrome`, fitting option or another finish/configuration.

### Edition
Optional scarcity boundary such as `07/25`.

### Physical Instance
The actual manufactured object with a permanent BRENYCH identity, production history, QC state, ownership/provenance and service history.

Example identity:

`BR-M01-PS-007`

A physical instance must reference the exact approved design/finish/fit revisions used to manufacture it.

---

## 14. Order Snapshot Rule

An order must preserve the commercial truth at purchase time.

At minimum snapshot:

- product name;
- SKU / variant identity;
- finish;
- edition if applicable;
- unit price;
- currency;
- tax amount/rate/jurisdiction data;
- duties if known;
- shipping price/method;
- discounts/credits;
- totals;
- relevant price-book revision;
- relevant product/design identifiers.

Changing the live product later must never rewrite historical order facts.

---

## 15. Customer Identity & Accounts

Canonical customer model:

**Guest-first commerce + optional passwordless BRENYCH Account + canonical Customer ID owned by BRENYCH Commerce Core.**

Rules:

- browsing does not require login;
- guest checkout remains available;
- a customer identity is established/linked during checkout or other explicit identity flows;
- after purchase, invite the customer to activate the account rather than forcing registration before payment;
- passwordless-first authentication;
- support modern passkey capability where appropriate;
- identity must be designed to merge legitimate cross-channel records without unsafe automatic assumptions.

### Collector Space

The account evolves into a premium ownership environment, not a generic “My Orders” page.

It should eventually expose:

- owned physical objects;
- edition/serial information;
- authenticity/provenance;
- order and production status;
- care guidance;
- fit configuration;
- service history;
- private releases / collector access;
- private inquiry history where appropriate.

---

## 16. Cart & Checkout

BRENYCH owns the cart and checkout experience.

Stripe is used as the payment rail, not as the owner of commerce UX or order state.

Canonical flow:

`BRENYCH checkout → validate price/tax/inventory/capacity → initiate Stripe payment → handle SCA/3DS/wallet → verified webhook → BRENYCH payment/order state transition → inventory/edition/production actions → outbox events`

All webhook processing must be authenticated, idempotent and replay-safe.

---

## 17. Payment Architecture

**Stripe = canonical payment processor for EU + UK + USA.**

Support cards and appropriate wallets while minimizing PCI scope. No raw card numbers are stored or transmitted through BRENYCH application infrastructure.

The BRENYCH order/payment state is driven by verified processor events and explicit internal state transitions, not optimistic browser redirects.

Refund domain state belongs to BRENYCH. Stripe performs the financial execution.

---

## 18. Tax Architecture

**Stripe Tax = canonical V1 tax-calculation and obligation-monitoring adapter.**

BRENYCH Commerce Core remains authority for tax data captured in an immutable order snapshot.

Architecture must be ready for:

- Spain/EU VAT and OSS workflows;
- UK-specific VAT/import rules;
- US state sales-tax nexus monitoring/calculation;
- market/location evidence required for compliant calculation;
- accounting/report exports.

V1 scope is **calculate → collect → record → report/export**. Do not build autonomous tax filing into the first production release.

Actual registrations/filing obligations must be verified with qualified tax/accounting professionals before production launch.

---

## 19. Pricing & Currency

Use **market-specific price books**, not live FX conversion as pricing strategy.

Canonical launch books:

- EU → EUR
- UK → GBP
- USA → USD

Example:

```text
MASK 01 / Polished Silver
EU   €890
UK   £790
USA  $950
```

Exact numbers are commercial decisions; architecture must support deliberate per-market pricing.

Rules:

- price books are versioned/effective-dated;
- orders snapshot the exact applied prices;
- currencies do not fluctuate in the storefront with every FX movement;
- promotions remain restrained;
- support private-client offers, compensation credits and controlled collector offers without turning BRENYCH into a discount-driven store.

### Bespoke pricing

Bespoke/Atelier uses a formal:

`Inquiry → Specification → Quote → Acceptance → Deposit/Payment → Production Order`

Quotes are immutable commercial records with validity period, currency, item specification and payment/deposit conditions.

---

# PART VI — INVENTORY, PRODUCTION & PHYSICAL OBJECTS

## 20. Fulfillment Modes

BRENYCH must support:

- **In Stock**
- **Made to Order**
- **Bespoke / Atelier**

Do not model made-to-order as merely `stock_quantity = 0`.

---

## 21. Inventory + Production Capacity

Canonical model is hybrid:

- physical inventory for already manufactured instances;
- production capacity/slots for made-to-order products;
- separate bespoke capacity where necessary.

Example:

```text
MASK production capacity / Sep 2026: 12
Reserved: 7
Available: 5
```

The system must prevent selling more made-to-order capacity than can reasonably be delivered within the promised window.

---

## 22. Production Orders

A successful made-to-order purchase creates a `Production Order` linked to the customer order and product/variant/edition.

Canonical generic lifecycle:

`QUEUED → MATERIAL PREP → FABRICATION → CLEANUP → FINISHING → ASSEMBLY/FIT → QUALITY CONTROL → READY FOR PACKAGING → PACKAGED → READY TO SHIP`

Product families may have different recipes. Do not hardcode one pipeline for every product.

Examples:

- mask recipe;
- ear-object recipe;
- neck-object recipe;
- bespoke recipe.

Production recipes should support lead-time calculation and capacity planning.

---

## 23. Immutable Production Timeline

Production history is append-oriented. Corrective transitions do not erase previous events.

Example:

```text
FINISHING_STARTED
QC_FAILED
RETURNED_TO_FINISHING
QC_PASSED
```

This history can become part of provenance for limited/high-value objects.

---

## 24. Edition Allocation

Edition numbers must not be casually blocked by abandoned carts.

Use a short controlled reservation during checkout if necessary, with permanent allocation only upon a safe successful payment/order transition.

The database must enforce that the same edition number cannot be allocated to two physical instances.

---

# PART VII — SHIPPING & FULFILLMENT

## 25. Fulfillment Authority

**BRENYCH Commerce Core = fulfillment authority.**  
**Sendcloud = V1 shipping orchestration adapter.**

All carrier-specific functionality must sit behind a BRENYCH-owned provider interface so another provider/direct-carrier integration can be introduced without rewriting the order domain.

Provider capability should cover, where available:

- rates/quotes;
- shipment creation;
- labels;
- cancellation;
- tracking;
- return shipments;
- customs data/documents.

---

## 26. Customer Shipping UX

Do not expose a long carrier list to premium customers.

Storefront options should be productized as BRENYCH service levels such as:

- **Standard**
- **Express**

The fulfillment engine chooses the appropriate carrier/service based on destination, dimensions, product value, insurance, SLA, reliability, price and DDP capability.

---

## 27. International Shipping Policy

Canonical direction is **DDP-first wherever technically/legalistically available** to minimize surprise duties/fees at delivery.

EU, UK and USA must be treated as distinct customs/tax scenarios.

Where DDP is unavailable, clearly disclose the alternative before purchase rather than surprising the customer after shipment.

For high-value objects, default requirements:

- tracking required;
- insurance required;
- signature required where supported;
- premium protective packaging;
- complete customs/product data outside the EU.

---

## 28. Production Time vs Transit Time

Customer promises must distinguish:

- production lead time;
- QC/fulfillment buffer;
- carrier transit time;
- estimated delivery window.

Do not advertise “2–4 day shipping” on a product that requires 10 days of production without clearly separating those concepts.

---

# PART VIII — RETURNS, SERVICE, WARRANTY & AFTERCARE

## 29. Returns

A Return is a first-class domain object, not merely a refund flag.

Suggested lifecycle:

`REQUESTED → AUTHORIZED → IN TRANSIT → RECEIVED → INSPECTED → REFUND / EXCHANGE / SERVICE / REJECTED`

Return eligibility/policy must be product-policy driven because standard, limited, bespoke and personalized items may differ legally and commercially.

---

## 30. Service & Repair

A Physical Instance remains active in the BRENYCH system after delivery.

Service cases may include:

- finish restoration;
- lattice repair;
- strap replacement;
- pad replacement;
- internal chassis replacement;
- fit adjustment;
- other aftercare.

Service history is linked to the permanent physical-instance identity and can be surfaced in Collector Space.

---

## 31. Warranty

Legal consumer rights, voluntary BRENYCH warranty/service promises and paid aftercare are separate concepts. Model them separately.

Warranty claims require structured coverage, inspection, decision and resolution records.

---

# PART IX — DIGITAL DESIGN, ASSETS & SPATIAL PRESENTATION

## 32. Digital-Twin Principle

The physical object and digital presentation should derive from a traceable approved design revision.

Canonical hierarchy:

`Source Master → Approved Design Revision → Runtime/Media Derivatives → Physical Instances`

Do not treat the Blender source, runtime GLB and manufactured physical object as the same entity.

---

## 33. Canonical Design Revision

Every production-relevant design has a revision identity.

A Physical Instance should retain references to relevant exact revisions, e.g.:

- design revision;
- fit-system revision;
- finish specification revision;
- production recipe revision where useful.

Future improvements to MASK 01 must not rewrite the history of earlier manufactured instances.

---

## 34. Digital Asset Registry

PostgreSQL stores asset metadata/registry records, not heavy binaries.

Registry metadata may include:

- asset ID;
- revision;
- role/type;
- product/variant binding;
- status;
- content hash;
- byte size;
- MIME/type;
- dimensions/runtime characteristics;
- created/approved/published timestamps.

Large binaries such as GLB, textures, HDRI, images and video belong in object storage/CDN behind a provider abstraction.

---

## 35. Spatial Presentation Manifest

Spatial experiences should be manifest/configuration driven rather than hardcoded into each product page.

The conceptual manifest should be able to bind:

- runtime geometry / LODs;
- finish/material variants;
- scene configuration;
- cameras;
- lights;
- authored interaction states;
- animation/choreography;
- fallback media;
- performance profile.

Next.js product pages should consume an approved presentation reference without needing to understand renderer internals.

---

## 36. Digital Asset Lifecycle

Canonical lifecycle:

`DRAFT → TECHNICAL QA → ART DIRECTION REVIEW → APPROVED → PUBLISHED → RETIRED`

Only approved/published assets may be used in production storefront presentation.

---

# PART X — CONTENT, EDITORIAL & POST-CMS MODEL

## 37. No Conventional CMS

BRENYCH V1 does not require a conventional external CMS.

Canonical content source is **site-native, typed, versioned content/data living with the product/code system**.

This covers:

- editorial text;
- product stories;
- collections;
- campaigns;
- Journal;
- Atelier/Craft content;
- navigation/composition;
- spatial-presentation bindings;
- fallback-media bindings;
- localized content.

Do not introduce Contentful/Sanity/Strapi/etc. merely because the site needs editable content.

---

## 38. Native Site Control Readiness

Native Site Control is the future governed post-CMS control plane once it is production-ready.

BRENYCH must therefore expose clear typed editable/publishable surfaces from the beginning, allowing future governed revisions without a site rewrite.

Target governance model:

`Live State → Working Change → Revision → Validation → Human Approval → Apply/Git → Deployment → Verification`

Native Site Control must never become the source of truth for orders, payments or inventory.

Until it is production-ready, operate the same content contracts directly through controlled code/Git workflows.

---

## 39. Localization

Launch-market architecture must be localization-ready from the beginning.

House of Lune localization patterns should be audited and preserved/adapted where sound.

Do not couple currency directly to language. Market, locale and currency are distinct concepts.

Initial languages should be chosen as a commercial/editorial decision; architecture must support adding languages without duplicating application logic.

---

# PART XI — SPRINTCRM & CUSTOMER RELATIONSHIPS

## 40. CRM Role

SprintCRM remains the canonical relationship-intelligence system when integrated.

Boundary:

**Commerce Core owns transactions. SprintCRM owns relationships.**

SprintCRM may receive projections/events including:

- customer created/updated;
- inquiry created;
- order paid/fulfilled/refunded;
- product interest where consent and privacy policy permit;
- collector tier changes;
- service cases;
- channel/acquisition attribution.

SprintCRM must not be required for successful checkout.

If CRM is unavailable, transactional commerce completes and relationship events are queued/retried asynchronously.

---

## 41. Customer Lifecycle

Canonical relationship lifecycle concept:

`VISITOR → PROSPECT → ENGAGED → CLIENT → RETURNING CLIENT → COLLECTOR → VIP / PRIVATE CLIENT`

Do not treat every person in the same communication flow.

Collector/private-client workflows may include:

- early access;
- private releases;
- bespoke inquiries;
- fitting consultation;
- owner-specific service;
- controlled collector communication.

---

# PART XII — ETSY CHANNEL

## 42. Etsy Role

Etsy is a **secondary marketplace, discovery and acquisition channel**, not the BRENYCH authority.

BRENYCH.com remains the principal brand/commerce destination.

The Etsy channel should be used strategically for:

- marketplace discovery;
- early demand validation;
- reviews/social proof;
- international acquisition;
- selling selected appropriate SKUs.

Do not position BRENYCH as “an Etsy 3D-print shop.”

---

## 43. Etsy Synchronization Principles

Use a channel adapter rather than scattering Etsy-specific logic across product/order code.

The adapter should eventually support controlled synchronization of:

- SKU/product mapping;
- approved listing assets/text;
- variants;
- selected price/channel rules;
- inventory/availability where applicable;
- orders;
- fulfillment/tracking updates.

External marketplace data must not silently overwrite canonical BRENYCH state. Conflicts require explicit policies and auditability.

Cross-channel customer identity should be merged only with sufficient deterministic evidence and privacy-safe rules.

The brand’s own Etsy automation technology may consume these adapter boundaries, but BRENYCH must remain operational even if that automation is temporarily unavailable.

---

# PART XIII — OPERATIONS / BACK OFFICE

## 44. BRENYCH Operations Console

Build a private **BRENYCH Operations Console** as the canonical internal control plane.

It is not another source of truth. It operates the authoritative domains through typed commands/queries.

Primary areas:

- Dashboard / Today;
- Products / Variants / Finishes / Editions;
- Pricing;
- Inventory / Capacity;
- Production Queue / Recipes / QC;
- Orders / Payments / Refunds;
- Physical Instances / Provenance;
- Customers / CRM projection;
- Private Inquiries / Quotes;
- Shipping / Exceptions;
- Returns / Service / Warranty;
- Digital / Spatial Asset Registry;
- Channel Sync;
- Automations / Jobs / Failures;
- Approvals;
- Audit Log;
- System Health.

---

## 45. Exception-First Operations

Normal successful processes should execute automatically when policy allows.

Humans should primarily handle exceptions such as:

- payment review;
- QC failure;
- production delay;
- capacity conflict;
- address/customs issue;
- high-value review;
- VIP/private client action;
- refund request;
- service case;
- integration/automation failure.

This is a core operating principle, not merely an admin UI preference.

---

## 46. Approval Engine

Use one reusable risk-based approval system for sensitive actions, regardless of whether the proposal came from a human, AI, automation or external system.

Risk examples:

### Low risk
May execute automatically under policy.

### Medium risk
May execute automatically only under explicit policy/rules.

### High risk
Requires human approval.

High-impact examples include:

- large or unusual refunds;
- price changes;
- edition-allocation overrides;
- production-capacity overrides;
- publishing critical product revisions;
- destructive customer-data operations;
- high-value bespoke quotes;
- physical-instance write-offs.

Every critical execution produces an audit receipt.

---

# PART XIV — SECURITY CANON

## 47. Security Is a Release Gate

BRENYCH is not production-ready without security validation.

### Staff authentication

- passkey/WebAuthn-first where practical;
- secure controlled recovery;
- stronger controls than customer authentication;
- no reliance on obscurity or UI-only authorization.

### Authorization

All sensitive permissions are enforced server-side.

Initial role concepts may include:

- Owner;
- Operations;
- Atelier;
- Client Relations;
- Content;
- Read Only.

Do not implement unnecessary enterprise complexity in V1, but the authorization boundary must be real from the start.

---

## 48. Secrets & PII

Rules:

- no secrets in frontend bundles;
- no secrets committed to repository;
- use deployment/runtime secret management;
- least-privilege provider credentials;
- no raw payment card storage;
- PII access is permissioned and auditable;
- data export/delete workflows must be designed for privacy compliance;
- collect only fit/customer data that the business actually needs;
- do not store biometric face scans in V1.

---

## 49. Idempotency & Replay Safety

All external mutations and critical commands must be idempotent by design.

Repeated Stripe/webhook/provider deliveries must not create duplicate orders, production allocations, refunds, emails or edition assignments.

Use durable event IDs/idempotency keys and database-backed processing guarantees.

---

## 50. Audit Trail

Critical state changes must record:

- actor/system identity;
- action;
- affected resource;
- timestamp;
- correlation ID;
- before/after or domain event where appropriate;
- approval reference where required;
- result/receipt.

Audit history for business-critical operations should be append-only/immutable by policy.

---

# PART XV — EVENTS, AUTOMATION & OBSERVABILITY

## 51. Transactional Outbox

When a domain state transition must generate an external event, persist both the business state and the outbox event in the same database transaction.

Example:

`ORDER PAID + outbox(order.paid)`

Downstream failures must never silently erase the event.

---

## 52. Async Integration Model

Classify integrations by whether they are required synchronously for the user’s action.

Payment/tax validation needed to complete checkout is critical synchronous work.

CRM, Etsy sync, email, analytics and many fulfillment preparations should normally be asynchronous reliable work with retries.

A CRM outage must not cancel an otherwise valid purchase.

---

## 53. Retry / Dead Letter

Background work requires:

- bounded retry policy;
- exponential/backoff strategy appropriate to provider;
- durable failure recording;
- dead-letter state after repeated failure;
- inspect/retry tools in Operations;
- idempotent re-execution.

No important commerce event may disappear because an external provider timed out.

---

## 54. Correlation & Tracing

A business flow should be traceable through one correlation identifier across checkout, payment, order, production, CRM, email and fulfillment events.

Operations should be able to answer “what failed?” without manual log archaeology.

---

## 55. Observability Layers

### Technical

- API latency/error rate;
- database health;
- worker health/queue lag;
- webhook failures;
- spatial runtime errors;
- asset/CDN failures.

### Commerce

- payment failure rate;
- checkout conversion;
- inventory/edition conflicts;
- production delays;
- refund anomalies;
- shipment exceptions.

### Automation

- queued/completed/failed jobs;
- retry counts;
- dead-letter items;
- approval backlog;
- external channel health.

### Spatial experience

Measure capability/fallback usage, runtime errors, load performance and meaningful product-experience engagement without making analytics block rendering or commerce.

---

# PART XVI — RELIABILITY & DISASTER RECOVERY

## 56. Environment Isolation

At minimum:

- Local development;
- Preview/PR environment;
- Staging/integration environment;
- Production.

Real production credentials and real customer data must not leak into local/preview environments.

Use provider sandbox/test modes in staging.

---

## 57. PostgreSQL Recovery

Production database requirements:

- automated backups;
- point-in-time recovery where supported;
- documented recovery procedure;
- periodic restore tests proving backups are usable;
- monitoring of backup health.

Critical records include orders, payments, edition allocations, physical instances, provenance, production history and audit data.

---

## 58. Safe Deployment

Production deploy pipeline should include:

`Build → Static/Type/Test Gates → Migration Safety Check → Staging → Smoke Tests → Production → Post-deploy Health Check → PASS or Controlled Rollback`

Database migrations should be forward/backward compatible when feasible. Prefer expand/migrate/contract over destructive single-step schema changes.

---

## 59. Graceful Degradation

Expected degraded behavior:

- spatial runtime unavailable → commerce works;
- SprintCRM unavailable → commerce works, relationship events queue;
- Etsy unavailable → direct commerce works, sync queues;
- Sendcloud unavailable → valid orders may be accepted and fulfillment waits, subject to policy;
- analytics unavailable → commerce works;
- tax/payment cannot be safely determined → checkout fails closed with a clear recoverable state.

Define service-specific RPO/RTO objectives during infrastructure implementation and test incident procedures before launch.

---

# PART XVII — COMPLIANCE & CUSTOMER TRUST

## 60. Product Compliance Gate

Before selling physical wearable products, complete a market-appropriate compliance/safety review for EU + UK + USA.

This includes, as applicable:

- general product safety obligations;
- traceability/manufacturer identity;
- material/contact safety;
- finish/plating restrictions (including skin-contact considerations);
- warnings/care instructions;
- product-specific risk review;
- packaging information;
- returns/warranty terms;
- tax/customs registrations and documentation.

Compliance evidence must be versioned alongside the relevant product/design revision where practical.

Do not launch a wearable product based only on visual validation.

---

## 61. Authenticity & Provenance

Limited and unique Physical Instances should have a durable authenticity/provenance record connected to their permanent BRENYCH identity.

Collector-facing presentation may include:

- object identity;
- product/edition;
- design revision;
- finish;
- completion date;
- verification state;
- care/service history;
- ownership link where privacy policy permits.

Avoid speculative blockchain/NFT complexity unless a real future requirement justifies it. BRENYCH’s own signed/verifiable records are sufficient for V1.

---

# PART XVIII — NON-NEGOTIABLE ENGINEERING RULES

## 62. Rules for the Developer

1. **Audit first, modify second.** Never rewrite House of Lune blindly.
2. Preserve a recoverable pre-migration baseline before structural changes.
3. Prefer modular monolith/domain boundaries over premature microservices.
4. Do not introduce Shopify, Medusa or a conventional CMS.
5. Do not make WebGPU/spatial runtime a prerequisite for navigation, SEO, product data or checkout.
6. Do not duplicate source-of-truth data across systems without an explicit projection/sync contract.
7. Every external provider lives behind a typed adapter boundary.
8. Every external webhook/critical mutation is idempotent and authenticated.
9. Use ACID transactions for commerce invariants and transactional outbox for reliable events.
10. Preserve immutable order snapshots, edition integrity, production history and audit receipts.
11. High-impact automation requires approval gates.
12. No secrets in code/repository/client bundles.
13. Accessibility, mobile and fallback behavior are first-class, not final polish.
14. Security, backup/recovery and compliance are launch gates.
15. Avoid unnecessary abstractions. Extract reusable systems only when the reuse case is real.
16. Keep BRENYCH-specific art direction/content out of generic reusable engine modules.
17. Every milestone ends with tests, QA evidence and a clean documented baseline before moving forward.

---

# PART XIX — STRATEGIC DEVELOPMENT ROADMAP

The roadmap below is ordered intentionally. Do not jump directly to cinematic polish while transactional, security or content foundations are unstable. Each milestone must leave a working, testable system.

## BR-00 — Project Audit, Preservation & Migration Baseline

**Goal:** Understand House of Lune exactly and establish a safe baseline.

Deliverables:

- complete repository audit;
- dependency/runtime/build/deploy inventory;
- route and feature map;
- existing content/product model map;
- SEO/i18n/deployment assessment;
- KEEP / ADAPT / REBUILD / REMOVE / NEW classification;
- baseline screenshots and behavior record;
- test/build status;
- clean Git baseline / migration branch or isolated worktree;
- documented target architecture mapping from this brief.

**Gate:** No destructive migration until audit is reviewed.

---

## BR-01 — BRENYCH Technical Foundation & Identity Migration

**Goal:** Convert the project foundation from House of Lune to BRENYCH without yet building full commerce.

Deliverables:

- BRENYCH naming/metadata/brand tokens;
- removal/isolation of obsolete House of Lune branding;
- dependency modernization where justified;
- TypeScript strictness and lint/test baseline;
- environment configuration model;
- route skeleton aligned with BRENYCH IA;
- design-token foundation;
- base responsive shell;
- deployment preview working.

**Gate:** New BRENYCH shell builds, deploys and has no unintended House of Lune identity leakage.

---

## BR-02 — Domain Contracts & PostgreSQL Foundation

**Goal:** Establish the canonical transactional model before checkout UI.

Deliverables:

- Product / Variant / Edition / Physical Instance contracts;
- Customer / identity contracts;
- Price Book contracts;
- Cart / Order / Payment / Refund contracts;
- Inventory / Reservation / Capacity contracts;
- Production Order / Recipe / QC contracts;
- Shipment / Return / Service / Warranty contracts;
- PostgreSQL schema and migrations;
- constraints for edition uniqueness and key invariants;
- repository/service boundaries;
- transactional outbox schema;
- audit/correlation primitives;
- integration tests for transactions and invariants.

**Gate:** Domain tests prove critical invariants before external providers are connected.

---

## BR-03 — Catalog, Variants, Editions & Price Books

**Goal:** Make BRENYCH product data authoritative and market-aware.

Deliverables:

- product/variant CRUD through internal application services;
- Core/Limited/One-of-One modes;
- finish configuration;
- EU/GBP/USD price books;
- effective-date/version handling;
- availability representation;
- made-to-order metadata;
- public read models for storefront;
- first canonical MASK 01 product record.

**Gate:** Product page can render entirely from canonical BRENYCH product data with no hardcoded price/availability assumptions.

---

## BR-04 — Customer Identity, Guest Checkout Foundation & Collector Account Shell

**Goal:** Establish customer identity without forcing registration.

Deliverables:

- guest/session identity;
- canonical Customer ID;
- passwordless account activation;
- passkey-ready account architecture;
- address model;
- account security/session rules;
- Collector Space shell;
- order ownership authorization;
- privacy-safe identity-linking rules.

**Gate:** Guest can become an account holder without duplicating the customer or order.

---

## BR-05 — Cart & Checkout Core

**Goal:** Build BRENYCH-owned cart and checkout before payment integration.

Deliverables:

- cart domain/services;
- market/currency selection;
- server-side price validation;
- inventory/capacity validation;
- edition reservation strategy;
- shipping address and market validation;
- checkout state machine;
- resilient cart persistence;
- semantic accessible checkout UI.

**Gate:** Checkout reaches payment-ready state using server-verified commercial data.

---

## BR-06 — Stripe Payments

**Goal:** Enable secure real payment processing while BRENYCH retains order authority.

Deliverables:

- Stripe adapter;
- PaymentIntent/payment-method flow as appropriate;
- wallets / SCA / 3DS support;
- authenticated webhook handler;
- idempotency keys and replay tests;
- payment/order transition rules;
- refund execution adapter;
- staging sandbox coverage;
- operations visibility into payment failures.

**Gate:** Test payments prove one financial event produces exactly one canonical state transition.

---

## BR-07 — Tax & Market Rules

**Goal:** Make EU + UK + USA checkout tax-aware.

Deliverables:

- Stripe Tax adapter;
- tax-location inputs/evidence model;
- tax category support;
- immutable tax snapshot on orders;
- EU/OSS-ready records;
- UK-specific route/market handling;
- US nexus-monitoring integration boundary;
- tax reporting/export baseline;
- failure-closed behavior when tax cannot be determined safely.

**Gate:** Market-specific staged test orders reconcile tax snapshots correctly.

---

## BR-08 — Orders, Outbox & Reliable Events

**Goal:** Complete reliable post-payment transaction orchestration.

Deliverables:

- order creation/finalization;
- immutable order snapshots;
- outbox publisher;
- durable job/retry infrastructure;
- dead-letter state;
- correlation IDs;
- idempotent event consumers;
- Operations-visible event failures.

**Gate:** Simulated provider failures do not lose order events or duplicate downstream actions.

---

## BR-09 — Inventory, Production Capacity & Physical Instances

**Goal:** Turn purchases into manufacturable work.

Deliverables:

- ready-stock inventory;
- made-to-order capacity/slots;
- production recipes;
- Production Orders;
- production timeline;
- QC gates;
- edition allocation;
- Physical Instance generation/identity;
- provenance link to design/finish/fit revisions;
- delay/re-estimation logic.

**Gate:** A paid made-to-order MASK 01 can progress from order to QC-passed physical instance without manual database edits.

---

## BR-10 — Shipping & Fulfillment

**Goal:** Deliver completed objects internationally through a provider-independent fulfillment model.

Deliverables:

- BRENYCH ShippingProvider interface;
- Sendcloud V1 adapter;
- Standard/Express storefront service levels;
- customs fields;
- DDP/DAP policy handling;
- insurance/signature policies;
- shipment creation, labels and tracking;
- shipment events;
- production + transit ETA model;
- shipment-exception Operations flow.

**Gate:** Staging shipment lifecycle can be created, tracked and reconciled without changing canonical order truth in Sendcloud.

---

## BR-11 — Returns, Repairs, Warranty & Aftercare

**Goal:** Extend the physical-object lifecycle beyond delivery.

Deliverables:

- Return/RMA domain;
- service/repair cases;
- warranty policy/claim records;
- refund integration;
- return-shipping integration;
- replaceable fit-component catalog/service flow;
- service history on Physical Instance;
- Collector Space aftercare views.

**Gate:** A delivered physical instance can enter and complete a service/return lifecycle with full audit history.

---

## BR-12 — Site-Native Editorial & Publishing Contracts

**Goal:** Rebuild the content layer without introducing a traditional CMS.

Deliverables:

- typed editorial/content contracts;
- collections;
- product-story chapters;
- Atelier content;
- Journal;
- campaigns;
- navigation/composition data;
- localization model;
- draft/approved/published semantics where required;
- clear future Native Site Control capability surfaces;
- code/Git publishing workflow until Native Site Control is ready.

**Gate:** Editorial content can change without rewriting page components and without an external CMS database.

---

## BR-13 — Digital Asset Registry & Design Revision System

**Goal:** Establish traceable digital/physical product lineage.

Deliverables:

- Canonical Design Revision records;
- fit/finish revision bindings;
- Digital Asset Registry;
- object-storage/CDN adapter;
- asset hashes/metadata;
- approval/publish lifecycle;
- runtime-derivative references;
- Physical Instance revision links;
- product fallback-media bindings.

**Gate:** A product, runtime asset and physical instance can all be traced to the correct approved design revision without conflating their identities.

---

## BR-14 — Spatial Experience Foundation

**Goal:** Introduce BRENYCH’s cinematic spatial layer without compromising the storefront.

Deliverables:

- capability detection;
- progressive loading;
- renderer/runtime boundary;
- scene lifecycle/memory cleanup;
- LOD strategy;
- material/finish presentation;
- camera and lighting choreography primitives;
- fallback poster/video path;
- mobile/degraded mode;
- runtime error handling;
- spatial telemetry.

**Gate:** Spatial runtime can fail completely and BRENYCH remains a usable premium store.

---

## BR-15 — MASK 01 Flagship Product Experience

**Goal:** Use the first hero mask as the definitive end-to-end BRENYCH product specimen.

Deliverables:

- final product story;
- FORM / MATERIAL / FIT / CRAFT / OBJECT / ACQUIRE flow;
- approved WebGPU presentation;
- premium silver/finish variations;
- fit-system explanation;
- product media and macro views;
- real price/availability/edition data;
- add-to-bag and checkout handoff;
- fallback equivalent;
- accessibility/performance QA.

**Gate:** MASK 01 passes visual, technical, mobile, fallback and commerce review as one coherent product experience.

---

## BR-16 — Homepage, Collections & Brand World

**Goal:** Scale the approved visual language from one product into the complete maison experience.

Deliverables:

- cinematic homepage;
- curated collection experience;
- Objects index;
- Atelier/About;
- Journal shell/content;
- Private Inquiry entry;
- responsive navigation;
- reduced-motion experience;
- SEO and structured metadata.

**Gate:** Entire public brand journey is coherent without relying on a conventional ecommerce grid/template.

---

## BR-17 — BRENYCH Operations Console

**Goal:** Operate the business from a single control plane rather than multiple provider dashboards.

Deliverables:

- secure staff app/surface;
- Dashboard/Today;
- Products/Prices/Editions;
- Orders/Payments;
- Inventory/Capacity;
- Production/QC;
- Physical Instances;
- Shipping;
- Returns/Service;
- Asset Registry;
- Approvals;
- Automation failures/DLQ;
- audit viewer;
- system health.

**Gate:** Core daily operations can be completed without direct production database manipulation.

---

## BR-18 — SprintCRM Integration

**Goal:** Add relationship intelligence without making CRM transactional authority.

Deliverables:

- CRM adapter;
- customer/client projections;
- commerce event sync;
- private inquiry/opportunity flow;
- collector lifecycle/tier projection;
- outage retry behavior;
- privacy/consent rules;
- direct links from Ops to deeper CRM context.

**Gate:** CRM can be offline without breaking checkout/order processing, and later recovers via queued events.

---

## BR-19 — Etsy Channel Integration

**Goal:** Make Etsy a controlled secondary acquisition/sales channel.

Deliverables:

- channel mapping model;
- listing/product mapping;
- selected SKU publication/sync;
- inventory/availability policy;
- order ingestion;
- fulfillment/tracking sync;
- deterministic customer-linking rules;
- conflict handling;
- sync health in Operations.

**Gate:** Etsy never becomes the accidental source of truth for canonical product/order state.

---

## BR-20 — Security Hardening & Approval Governance

**Goal:** Lock down production staff/customer/business surfaces.

Deliverables:

- passkey/WebAuthn staff authentication;
- server-side authorization policies;
- role baseline;
- universal approval engine;
- secret-management audit;
- PII access controls;
- CSRF/session/security-header review;
- webhook authenticity tests;
- rate limits/abuse controls where necessary;
- destructive-action safeguards;
- security regression tests.

**Gate:** Security review signs off before production launch.

---

## BR-21 — Observability, Reliability & Disaster Recovery

**Goal:** Prove the system can be operated and recovered under failure.

Deliverables:

- centralized structured logs;
- metrics/traces/error tracking;
- business-health monitoring;
- provider-health views;
- queue/DLQ alerts;
- PostgreSQL backups/PITR;
- tested restore procedure;
- staged deployment gates;
- rollback procedure;
- migration safety practices;
- explicit RPO/RTO targets;
- incident playbook;
- degraded-mode tests.

**Gate:** Execute at least one controlled recovery/restore exercise before launch.

---

## BR-22 — Legal, Product Safety & Commercial Compliance

**Goal:** Ensure the business can legally and safely sell the actual products in launch markets.

Deliverables:

- product safety/compliance pack per relevant family;
- material/skin-contact review;
- labeling/traceability;
- care/warning content;
- Terms / Privacy / Returns / Warranty policies;
- cookie/consent implementation where required;
- VAT/OSS/UK/US tax-registration review with professionals;
- customs/export data validation;
- insurer/liability requirements review;
- accessibility/legal storefront review.

**Gate:** No physical product launches without its compliance record and approved customer-facing policy content.

---

## BR-23 — Full QA, Performance & UAT

**Goal:** Validate the complete system like a real international customer and a real operator.

Test matrix must cover at minimum:

- desktop/mobile/tablet;
- WebGPU capable and fallback paths;
- reduced motion;
- EU / UK / USA checkout scenarios;
- EUR / GBP / USD;
- guest and account customer;
- successful/failed/retried payment;
- tax calculation failure;
- limited-edition concurrency;
- production capacity exhaustion;
- shipping provider failure;
- CRM/Etsy outage;
- return/refund flow;
- service case;
- staff permission denial;
- approval gate;
- restore/rollback evidence;
- SEO/metadata;
- accessibility;
- performance/Core Web Vitals;
- security scan/review.

**Gate:** All release-blocking issues closed with documented evidence.

---

## BR-24 — Controlled Soft Launch

**Goal:** Expose production to a small real audience before broad promotion.

Deliverables:

- production environment live;
- limited initial products/stock/capacity;
- payment/tax/shipping verified with real low-risk transactions;
- production workflow tested end-to-end;
- operational alerts active;
- support/returns procedures active;
- analytics baseline;
- daily launch review.

**Gate:** Stable real transactions and fulfillment without critical incidents.

---

## BR-25 — Public Launch

**Goal:** Launch BRENYCH.com as the primary commercial and brand destination.

Deliverables:

- final public collection;
- flagship MASK 01 experience;
- campaign/editorial launch material;
- international checkout for approved markets;
- Collector Account;
- Operations monitoring;
- selected Etsy listings/channel sync;
- customer support/aftercare processes;
- press/social launch assets.

**Gate:** Production health remains stable under launch traffic and real order activity.

---

## BR-26 — Post-Launch Optimization

**Goal:** Improve based on evidence without destabilizing the premium product.

Priorities:

- conversion and checkout friction;
- spatial performance and fallback rates;
- product interest/favorites/inquiries;
- production bottlenecks;
- shipping cost/reliability;
- returns/fit issues;
- customer/collector retention;
- marketplace acquisition quality;
- margin by SKU/market;
- operational automation opportunities.

Avoid reflexive discounting as a growth strategy.

---

## BR-27 — Scale & Advanced Capabilities

Only after the core business is stable, progressively consider:

- larger product catalog;
- improved search/discovery if catalog size justifies it;
- more sophisticated collector/private-client programs;
- additional international markets;
- additional carriers/direct contracts;
- further automation;
- deeper Native Site Control integration;
- AR/fitting experiences where genuinely valuable;
- advanced authenticity/resale/service capabilities;
- new physical product categories.

Every expansion must preserve the authority boundaries defined in this canon.

---

# PART XX — RELEASE DEFINITION OF DONE

## 63. BRENYCH V1 Is Not “Done” Because the Homepage Looks Good

A production launch requires all of the following to be true:

- BRENYCH identity is complete and House of Lune identity is removed from production;
- product data is canonical, not hardcoded ad hoc;
- real EU/UK/USA market pricing works;
- checkout/payment/tax work securely;
- inventory/capacity/edition invariants are enforced transactionally;
- made-to-order production works end-to-end;
- shipping and tracking work;
- returns/service/warranty have operational paths;
- account/Collector Space is secure;
- Operations Console can run the business;
- integrations fail safely and recover;
- spatial presentation is progressive and has premium fallbacks;
- public pages meet SEO/accessibility/mobile requirements;
- critical actions are authorized/audited;
- backups and restore have been tested;
- product compliance and commercial policies are approved;
- monitoring and incident response are live;
- soft launch has validated real transactions.

---

# PART XXI — FINAL IMPLEMENTATION MANDATE

The developer should treat BRENYCH as a **real premium physical-product business and production software system**, not a portfolio mockup.

The implementation order is deliberate:

1. preserve and understand the existing foundation;
2. establish BRENYCH identity and technical baseline;
3. establish transactional truth and domain invariants;
4. connect secure commerce providers through adapters;
5. establish production/physical-object operations;
6. build the site-native editorial and digital-asset system;
7. layer cinematic spatial presentation on top of a complete storefront;
8. build internal operations and relationship/channel integrations;
9. harden security/reliability/compliance;
10. soft-launch, verify and only then scale.

The north-star outcome is not merely “a beautiful jewelry website.” It is:

> **BRENYCH — a founder-led premium wearable-object brand with cinematic digital presentation, independent direct commerce, traceable physical editions, automated production/operations, collector relationships, reliable international fulfillment, and a technology architecture strong enough to operate as a real business.**

---

**END OF CANON — BRENYCH CANONICAL MASTER BRIEF V1**
