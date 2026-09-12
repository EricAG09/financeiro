import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    name: "finance-ai/rules",
    rules: {
      // Regra 21: proibido `any`.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      // Sem HTML arbitrário (XSS).
      "react/no-danger": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "smart"],
    },
  },

  {
    // Segredos server-side nunca podem ser importados por código de cliente.
    name: "finance-ai/no-server-secrets-in-client",
    files: ["components/**/*.{ts,tsx}", "hooks/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/supabase/admin",
              message:
                "O client service-role é server-only. Nunca importe em componentes ou hooks.",
            },
            {
              name: "@/config/env",
              importNames: ["serverEnv"],
              message: "serverEnv contém segredos. Use publicEnv no cliente.",
            },
          ],
        },
      ],
    },
  },

  {
    // Scripts de linha de comando reportam progresso no stdout — é a interface deles.
    name: "finance-ai/scripts",
    files: ["scripts/**/*.mjs"],
    rules: {
      "no-console": "off",
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    "public/sw.js",
  ]),
]);

export default eslintConfig;
