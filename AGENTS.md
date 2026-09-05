# Repository working agreement

Read `docs/canon/BRENYCH_CANONICAL_MASTER_BRIEF_V1.md` before structural work.

- Audit before structural changes and preserve a clean, recoverable Git baseline.
- Use PowerShell-compatible operational commands and scripts.
- Never mutate the existing live `brenych.com`, DNS, registrar, or production deployment from this repository without a separate explicit task.
- Do not couple runtime code to Spatial Product Platform or mutate Brenych Asset Forge.
- Keep commerce domains independent of Next.js, Cloudflare, PostgreSQL clients, and provider SDKs.
- Put external services behind typed provider-neutral adapters.
- Keep secrets and personal data out of source control and client bundles.
- Use test-first development for behavior and real PostgreSQL for database invariants.
- Run relevant verification before each coherent commit and record evidence before claiming a gate passed.
- Keep repository and production surfaces tool- and vendor-neutral.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
