# House of Lune route map

## Baseline runtime routes

| Route | Rendering | Observed response | Baseline responsibility | Migration classification |
|---|---|---:|---|---|
| `/` | Static redirect | 307 to `/en` | Default locale entry | ADAPT |
| `/[lang]` | Static for en/fr/es | 200 | Editorial home and hero scene | REBUILD |
| `/[lang]/collection` | Static | 200 | Hardcoded product collection | REBUILD |
| `/[lang]/piece/[slug]` | Static for four slugs/locales | 200 known, 404 unknown | Hardcoded product story | REBUILD |
| `/[lang]/craftsmanship` | Static | 200 | Invented craft editorial | REBUILD |
| `/[lang]/maison` | Static | 200 | Invented maison editorial | REBUILD |
| `/[lang]/journal` | Static | 200 | Invented journal entries | REBUILD |
| `/[lang]/contact` | Dynamic | 200 | Contact UI | REBUILD |
| `/api/inquiry` | Dynamic POST | 200 for complete form; 500 for untyped empty POST | No-op form acknowledgement | REMOVE |
| `/opengraph-image` | Static image | generated | Legacy social image | REBUILD |
| `/twitter-image` | Static image | generated | Re-export of OG image | REBUILD |
| `/robots.txt` | Static metadata | generated | Allows indexing | ADAPT |
| `/sitemap.xml` | Static metadata | generated | Legacy route/product sitemap | REBUILD |
| unsupported locale/path | not found | 404 | Correct rejection | KEEP pattern |

The baseline build generated 39 entries: locale shells for three locales, four product slugs per locale, global metadata routes, and one dynamic API route.

## Target route mapping

| Baseline | BRENYCH target |
|---|---|
| `/[lang]` | `/[locale]` |
| `/[lang]/collection` | `/[locale]/objects` and `/[locale]/collections` |
| `/[lang]/piece/[slug]` | `/[locale]/objects/[slug]` |
| `/[lang]/craftsmanship` | `/[locale]/atelier` |
| `/[lang]/maison` | `/[locale]/about` |
| `/[lang]/journal` | `/[locale]/journal` |
| `/[lang]/contact` | `/[locale]/private-inquiry` |
| none | `/[locale]/account` |
| none | `/[locale]/bag` |
| `/api/inquiry` | intentionally absent until a durable inquiry milestone |

