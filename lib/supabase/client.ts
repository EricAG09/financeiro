"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { publicEnv } from "@/config/env";
import type { Database } from "@/types/database";

/**
 * Client do browser. Usa somente a chave anônima — toda a autorização real é
 * aplicada pelo Postgres via RLS (ver docs/security/security-model.md).
 */

let cachedClient: SupabaseClient<Database> | null = null;

export function createClient(): SupabaseClient<Database> {
  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local",
    );
  }

  cachedClient ??= createBrowserClient<Database>(url, anonKey);

  return cachedClient;
}
