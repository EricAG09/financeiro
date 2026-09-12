import { z } from "zod";

/**
 * Validação de variáveis de ambiente.
 *
 * Regras:
 * - `publicEnv` pode ser lido no browser (valores `NEXT_PUBLIC_*`).
 * - `serverEnv` NUNCA pode ser importado por Client Component (ver eslint.config.mjs).
 * - Na Etapa 1 o Supabase ainda não possui credenciais, então as variáveis são
 *   opcionais e o app degrada de forma explícita via `isSupabaseConfigured`.
 */

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
});

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  AI_PROVIDER: z.string().min(1).optional(),
  AI_API_KEY: z.string().min(1).optional(),
  AI_MODEL: z.string().min(1).optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

function parseOrThrow<T>(schema: z.ZodType<T>, input: unknown, scope: string): T {
  const result = schema.safeParse(input);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");

    // Nunca inclui o valor da variável na mensagem — apenas o nome e o motivo.
    throw new Error(`Variáveis de ambiente inválidas (${scope}):\n${issues}`);
  }

  return result.data;
}

/**
 * Acesso literal a `process.env.NEXT_PUBLIC_*` é obrigatório: o Next.js só
 * substitui a variável no bundle do cliente quando ela aparece de forma literal.
 */
export const publicEnv: PublicEnv = parseOrThrow(
  publicEnvSchema,
  {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  "public",
);

let cachedServerEnv: ServerEnv | null = null;

/** Só pode ser chamado em contexto de servidor. */
export function serverEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("serverEnv() foi acessado no browser. Isso vazaria segredos.");
  }

  cachedServerEnv ??= parseOrThrow(
    serverEnvSchema,
    {
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      AI_PROVIDER: process.env.AI_PROVIDER,
      AI_API_KEY: process.env.AI_API_KEY,
      AI_MODEL: process.env.AI_MODEL,
    },
    "server",
  );

  return cachedServerEnv;
}

/** Indica se o backend Supabase já foi configurado neste ambiente. */
export const isSupabaseConfigured: boolean = Boolean(
  publicEnv.NEXT_PUBLIC_SUPABASE_URL && publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const isProduction: boolean = process.env.NODE_ENV === "production";
