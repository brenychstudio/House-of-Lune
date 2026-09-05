# BR-01 Shell QA

Date: 2026-09-05
Status: **PASS**

## Scope verified

- BRENYCH identity and “Objects for the Body” positioning replace the legacy public identity.
- `/` deterministically redirects to `/en`; the ten canonical English routes render.
- Unsupported locales and object slugs return 404.
- Header, footer, skip link, keyboard menu, focus restoration, focus trap, and scroll lock work.
- The mobile menu occupies the full viewport; a regression assertion requires a height above 700 px at 390×844.
- Home and object experiences remain complete with the fallback-only spatial capability.
- Site-native typed content contains no public prices, stock assertions, or simulated inquiry success.
- Development/preview environments emit `noindex`; production requires an HTTPS canonical origin before becoming indexable.

## Automated receipt

| Gate | Result |
| --- | --- |
| Unit suite | PASS — 9 files, 30 tests |
| Browser suite | PASS — 30 executed, 2 intentionally skipped by viewport |
| Accessibility | PASS — no serious/critical axe violations on the shell |
| Responsive overflow | PASS — 1440×900, 1024×1366, 390×844 |
| Production build | PASS — 17 static/SSG outputs |
| Cloudflare/OpenNext build | PASS — worker bundle generated locally |
| Cloudflare local preview | PASS — `/`, `/en`, `/en/objects`, `/en/objects/mask-01` returned 200 after redirect handling |
| Public identity leak scan | PASS — 0 matches under `src` and `public` |
| Public price scan | PASS — 0 currency-symbol-plus-number matches |

## Visual evidence

The automated capture checks one `h1`, no horizontal overflow, successful responses, no console/page errors, and no failed subresources before writing each image.

- `docs/evidence/br-01/home-{1440x900,1024x1366,390x844}.png`
- `docs/evidence/br-01/objects-{1440x900,1024x1366,390x844}.png`
- `docs/evidence/br-01/mask-01-{1440x900,1024x1366,390x844}.png`
- `docs/evidence/br-01/menu-390x844.png`
- `docs/evidence/br-01/capture-receipt.json`

Manual inspection confirmed readable hierarchy, consistent graphite/metal palette, complete static MASK 01 presentation, visible development status, and a full-height compact menu. Mobile evidence was captured with reduced motion enabled.

## Boundaries preserved

No production deployment, DNS change, live `brenych.com` mutation, commerce provider integration, SPP coupling, BAF mutation, or invented product imagery was performed.
