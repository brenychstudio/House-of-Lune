# House of Lune dependency and deployment report

## Dependency baseline

| Area | Version | Finding |
|---|---|---|
| Next.js | 16.2.3 | Build passes; direct high-severity advisory range reported by npm audit |
| React / React DOM | 19.2.3 | Compatible baseline; patch releases available |
| TypeScript | 5.9.3 installed from `^5` | Strict mode enabled; typecheck passes |
| Tailwind CSS | 4.2.1 installed from `^4` | Single global CSS entry works |
| Motion | 12.35.0 | Used for legacy editorial animations; remove with old runtime |
| Three | 0.183.2 | Used only by procedural legacy hero |
| React Three Fiber / Drei | 9.5.0 / 10.7.7 | R3F used; Drei declared but no source import found |
| OpenNext Cloudflare | 1.19.4 | Adapter configuration present; 1.20.6 is current compatible release at audit time |
| Wrangler | 4.85.0 | Direct high-severity advisory range reported; current adapter expects `^4.125.0` |

`npm audit --json` reported 21 affected package nodes: 3 low, 3 moderate, 15 high, and 0 critical. Direct affected packages were Next.js and Wrangler; transitive reports included miniflare, undici, ws, sharp, postcss, browserslist, and build-tool dependencies. No `npm audit fix --force` was run.

## Build/deploy baseline

- `npm run build` uses `next build --webpack` and passed.
- `preview:cf` builds and launches local OpenNext/Wrangler preview; it was not part of the pristine baseline command set.
- `deploy:cf` exists and would deploy immediately. It must be removed from the milestone scripts to avoid accidental production side effects.
- `wrangler.jsonc` points to `.open-next/worker.js`, serves `.open-next/assets`, enables observability, and uses `global_fetch_strictly_public` plus `nodejs_compat` under compatibility date `2026-04-24`.
- Worker identity `house-of-lune` and legacy public URL fallback must not survive the migration.
- No production route or custom domain is declared in the repository config.

## Current platform decision

Retain Next.js App Router and OpenNext. Update to Next.js 16.3.4, OpenNext Cloudflare 1.20.6, and Wrangler 4.129.x as one measured compatibility slice. Set a current compatibility date, no production route, and a non-production Worker name. PostgreSQL runtime connection details remain outside Wrangler until a later infrastructure milestone; BR-02 uses local PostgreSQL and a provider-neutral `DATABASE_URL`.

