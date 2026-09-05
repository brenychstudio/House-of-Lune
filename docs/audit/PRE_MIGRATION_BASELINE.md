# Pre-migration baseline

Recorded: 2026-09-05T12:08:51+02:00

## Repository receipt

- Workspace: `C:\Users\CONCEPT2048\house-of-lune`
- BDB workspace identifier from task: `ws_house_of_lune`
- BDB execution status: unavailable in this environment; local Git was used as the permitted evidence fallback.
- Baseline branch: `main`
- Baseline HEAD: `ac86caf4dc4abeebcd0f02a4cdc7b7e9ce6580c1`
- Remote: `origin https://github.com/brenychstudio/House-of-Lune.git`
- Initial worktree state: clean (`git status --short` returned no paths).
- Recoverable reference: annotated tag `house-of-lune-pre-brenych-20260905`
- Tag target: `ac86caf4dc4abeebcd0f02a4cdc7b7e9ce6580c1`
- Migration branch: `migration/br-00-02-brenych`
- Detached audit worktree: `C:\Users\CONCEPT2048\AppData\Local\Temp\house-of-lune-br00-audit-ac86caf`

Recovery is non-destructive:

```powershell
git switch --detach house-of-lune-pre-brenych-20260905
```

## Environment receipt

- Windows PowerShell: `5.1.22621.6133`
- Git: `2.53.0.windows.1`
- Node.js: `v24.13.0`
- npm: `11.6.2`
- GitHub CLI: `2.96.0`, authenticated
- Docker CLI: `29.7.2`
- Docker Compose: `v5.3.1`
- Docker daemon at preflight: unavailable (`dockerDesktopLinuxEngine` pipe absent)
- PostgreSQL client: unavailable
- Playwright CLI/browser at first check: package/browser absent; Chromium `1243` was subsequently installed for local evidence capture.
- Free space on `C:` at preflight: 19,363,000,320 bytes

## Package and repository baseline

- Package: `house-of-lune@0.1.0`
- Next.js `^16.2.3`; React/React DOM `19.2.3`; TypeScript `^5`; Tailwind `^4`
- Motion `^12.35.0`; Three `^0.183.2`; R3F `^9.5.0`; Drei `^10.7.7`
- OpenNext Cloudflare `^1.19.4`; Wrangler `^4.85.0`
- Lockfile version: `3`; lock package entries: `854`
- Tracked files: `7,775`
- Tracked `node_modules` paths: `7,625`
- Tracked `.next`, `.open-next`, and `.wrangler` paths: `0`

## Baseline commands

| Command | Directory | Exit | Result |
|---|---|---:|---|
| `npm ci` | detached audit worktree | 0 | 722 packages installed; 21 vulnerabilities reported |
| `npm run lint` | detached audit worktree | 1 | one error in `SiteHeader.tsx`; two `no-img-element` warnings |
| `npx tsc --noEmit` | detached audit worktree | 0 | typecheck passed |
| `npm run build` | detached audit worktree | 0 | production build passed; 39 static/dynamic route outputs |
| `npm audit --json` | detached audit worktree | 1 | 3 low, 3 moderate, 15 high, 0 critical |

The lint failure is baseline evidence, not attributed to the migration branch. No baseline automated unit, integration, or e2e test files existed.

```text
BASELINE_RECORDED=YES
RECOVERABLE_REFERENCE=YES
MAIN_HISTORY_REWRITTEN=NO
```

