import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/shared/config/env";
import type { Database } from "@/shared/types/database";

/**
 * Client administrativo (service role).
 *
 * ⚠️ ESTE CLIENT IGNORA RLS.
 *
 * Regras de uso:
 * - jamais importar em Client Component ou hook (bloqueado no ESLint);
 * - jamais usar para atender requisição de usuário sem autorização explícita;
 * - toda operação sensível deve gerar registro em `audit_logs`;
 * - preferir sempre `createServerSupabaseClient()` com RLS.
 *
 * Casos legítimos: rotinas de manutenção, jobs agendados, migrações de dados.
 */
export function createAdminClient(): SupabaseClient<Database> {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = serverEnv().SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Client administrativo indisponível: SUPABASE_SERVICE_ROLE_KEY não configurada.",
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
