# Contributing

BRENYCH is developed as a modular monolith with explicit domain boundaries.

1. Read the canonical brief and relevant ADRs.
2. Start from a clean branch and make the smallest coherent change.
3. Add a failing behavioral test before production code.
4. Keep `src/modules` free of framework, database-client, and provider imports.
5. Run `npm run lint`, `npm run typecheck`, and the relevant tests before committing.
6. Use `npm run verify` when PostgreSQL and the browser test runtime are available.

Do not add public prices, stock, edition sizes, translations, or commercial claims without an approved product decision.
