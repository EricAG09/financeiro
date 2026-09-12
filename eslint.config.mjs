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
    /**
     * Fronteira do frontend.
     *
     * `src/backend/domain` é puro e pode ser importado aqui — a regra
     * financeira é a mesma dos dois lados. O que não pode atravessar é código
     * que carrega segredo ou fala com o servidor.
     */
    name: "finance-ai/frontend-boundary",
    files: ["src/frontend/**/*.{ts,tsx}", "src/app/(frontend)/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/backend/supabase/admin"],
              message:
                "O client service-role ignora RLS e é server-only. Use @/backend/supabase/server ou /client.",
            },
            {
              group: ["@/backend/ai/registry"],
              message:
                "A resolução do provedor de IA lê a chave da API. Server-only: chame por um route handler em src/app/(backend).",
            },
          ],
          paths: [
            {
              name: "@/shared/config/env",
              importNames: ["serverEnv"],
              message: "serverEnv() expõe segredos. No frontend use publicEnv.",
            },
          ],
        },
      ],
    },
  },

  {
    /**
     * Fronteira do backend.
     *
     * Servidor não desenha. Importar componente aqui significa que a
     * responsabilidade está no lugar errado.
     */
    name: "finance-ai/backend-boundary",
    files: ["src/backend/**/*.ts", "src/app/(backend)/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/frontend/*", "@/frontend/**"],
              message:
                "O backend não importa do frontend. Se o valor é comum aos dois, mova para @/shared.",
            },
          ],
        },
      ],
    },
  },

  {
    /**
     * `src/shared` é vocabulário: tipos, constantes e configuração.
     * Sem lógica de negócio e sem dependência de nenhum dos dois lados.
     */
    name: "finance-ai/shared-boundary",
    files: ["src/shared/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/frontend/*", "@/frontend/**", "@/backend/*", "@/backend/**"],
              message:
                "src/shared não pode depender de frontend nem de backend — são eles que dependem dele.",
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
