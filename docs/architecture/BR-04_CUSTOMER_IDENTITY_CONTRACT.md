# BR-04 Customer Identity Contract

## Authority and lifecycle

BRENYCH Commerce Core owns the canonical Customer ID and customer account state. Browsing creates neither a customer nor a guest session. A guest session is created only when a stateful guest flow explicitly asks for one, contains no PII, and is not identity evidence.

The account lifecycle is `GUEST → INVITED → ACTIVE → DISABLED`. An invitation is an internal action against an existing canonical customer. Activation consumes a one-time `ACCOUNT_ACTIVATION` challenge, links the normalized verified account email, and creates a fresh authenticated session. An `ACTIVE` customer may receive a `SIGN_IN` challenge. Public access requests always use the same success-shaped response and do not reveal eligibility.

`DISABLED` is fail-closed. Disabled customers cannot use existing sessions; the disable service also revokes every open session without deleting commercial history.

## Tokens, challenges, and sessions

Passwordless, guest-session, and authenticated-session tokens use 32 bytes (256 bits) from the runtime cryptographic random generator. The raw base64url value exists only at the browser/delivery boundary. PostgreSQL stores only its SHA-256 digest.

Passwordless challenges are provider-neutral, one-time, effective for 15 minutes, and limited to `ACCOUNT_ACTIVATION` or `SIGN_IN`. Invitation state, its challenge, and audit receipt commit atomically after locking the canonical customer; delivery always uses the email read under that lock. Public sign-in requests are coalesced for one minute by hashed address and bounded by a hashed caller window, so retries do not invalidate a still-valid link. Expired limiter rows are pruned in bounded batches. Atomic conditional update makes replay and concurrent double-consumption fail closed.

Authenticated sessions are opaque server-side records with a 30-day idle timeout, 90-day absolute lifetime, last-seen time, revocation state/reason, customer ownership, and originating challenge. Authentication never promotes a guest token: a fresh token is generated, and a valid browser guest session may only be revoked and bound as explicit transition context. Logout revokes the server row before removing the cookie.

HTTPS environments use `__Host-br_session` with `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, and no `Domain`. Plain-HTTP local development uses the explicit `br_session_dev` exception with the remaining protections unchanged. No authentication value is stored in localStorage, sessionStorage, or a client-readable JWT.

## Identity evidence and privacy

Email normalization trims and lowercases the complete address under one project policy, validates one syntactic `@` boundary, and never applies provider-specific dot or plus collapsing. `VERIFIED_EMAIL` is globally deterministic. `EXTERNAL_SUBJECT` is deterministic only inside its normalized provider namespace. A unique PostgreSQL identity index arbitrates races.

Linking the same identity to the same Customer ID is idempotent. A claim by another customer returns conflict and never auto-merges records. Display names, postal addresses, phone numbers, and unverified emails are not evidence. Audits contain entity IDs, action/outcome, and non-secret state; they do not copy tokens, addresses, or emails.

## Ownership boundaries

Address create/list/read/update/delete always carries the authenticated Customer ID into the repository predicate. Missing and cross-customer resources share not-found behavior. Address fields are validated server-side and are never identity evidence.

Authenticated order reads require `orders.customer_id = authenticatedCustomerId`. A guest order can be claimed only while unowned and when a persisted `VERIFIED_EMAIL` of the claimant exactly matches normalized `orders.guest_email`. The conditional PostgreSQL update is transactional and never reassigns an owned order.

Owned Objects is a deliberately empty typed projection in BR-04. Browsing, inquiries, cart contents, names, or addresses never imply ownership.

## Passkey-ready boundary

Each customer receives one random stable PostgreSQL UUID as a non-PII WebAuthn user handle. `passkey_credentials` can store multiple owner-scoped credential IDs, public keys, signature counters, transports, last-use time, and revocation time. Credential IDs are globally unique. Private keys never belong in BRENYCH storage.

BR-04 includes no WebAuthn registration/assertion ceremony, passkey UI, recovery, or runtime dependency. These remain deferred to the security milestone.

## Application and runtime boundary

Customer domain decisions are independent of Next.js, PostgreSQL clients, Cloudflare, and provider SDKs. Focused PostgreSQL repositories and application services perform transactions and audits. Next.js Route Handlers only translate HTTP/cookie state into those services.

The account route is request-time, `no-store`, `private`, `noindex`, and `no-referrer`. Database failure returns no fallback identity and no private data; it renders a restrained unavailable state while public storefront routes remain usable. Public access responses have one generic shape and response floor; eligible delivery runs with the runtime's post-response lifecycle rather than extending the observable response. Link creation and the clean redirect use the validated configured site origin, never request host headers. Cloudflare observability redacts query strings.

The development delivery/harness is active only with the development environment, explicit harness flag, per-run random bearer secret, and loopback hostname. A deliberately slow development adapter is used in E2E to prove provider latency does not alter the public response boundary. It never logs a raw link and is not a production provider. Logout removes its cookie only after durable revocation; a database failure returns `503` and preserves the cookie for a safe retry.

## Deferred

- Checkout/customer creation trigger and cart guest-to-customer merge policy: BR-05.
- Payment, tax, shipping, CRM, and production delivery adapters: later provider milestones.
- WebAuthn ceremonies, passkey management, and recovery: BR-20.
- Physical ownership/provenance and presentation manifests: BR-09/BR-13.
- Three.js/WebGPU account presentation: optional future spatial work after semantic authorization.
