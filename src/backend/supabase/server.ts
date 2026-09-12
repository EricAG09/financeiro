import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { publicEnv } from "@/shared/config/env";
import type { Database } from "@/shared/types/database";

/**
 * Client de servidor (Server Components, Route Handlers, Server Actions).
 *
 * Continua usando a chave anônima: a sessão do usuário vem do cookie e o
 * Postgres aplica RLS. Não use este client para tarefas administrativas.
 */
export async function createServerSupabaseClient(): Promise<SupabaseClient<Database>> {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local",
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components não podem escrever cookies. A renovação de sessão
          // acontece no middleware (lib/supabase/middleware.ts), então ignorar
          // aqui é seguro e esperado.
        }
      },
    },
  });
}
