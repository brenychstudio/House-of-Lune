import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/modules/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next", "next/*", "react", "react/*", "pg", "cloudflare:*", "@opennextjs/*"],
              message: "Commerce domain modules must remain framework, database-client, and platform independent.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".open-next/**",
    ".wrangler/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "cloudflare-env.d.ts",
  ]),
]);

export default eslintConfig;
