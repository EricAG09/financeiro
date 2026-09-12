import "server-only";

import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/config/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Leitura de sessão no servidor.
 *
 * Sempre via `getUser()`, que valida o token junto ao Supabase Auth.
 * `getSession()` lê apenas o cookie e não é confiável para autorização.
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) return null;

  return data.user;
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getCurrentUser()) !== null;
}
