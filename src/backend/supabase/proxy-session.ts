import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, publicEnv } from "@/shared/config/env";
import type { Database } from "@/shared/types/database";

export interface SessionCheck {
  readonly response: NextResponse;
  /** `null` quando não há sessão ou quando o Supabase ainda não foi configurado. */
  readonly userId: string | null;
}

/**
 * Renova a sessão do Supabase a cada requisição e propaga os cookies.
 *
 * Enquanto o Supabase não estiver configurado (Etapa 1), retorna sem sessão em
 * vez de derrubar a aplicação.
 */
export async function updateSession(request: NextRequest): Promise<SessionCheck> {
  let response = NextResponse.next({ request });

  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSupabaseConfigured || !url || !anonKey) {
    return { response, userId: null };
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = NextResponse.next({ request });

        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // `getUser()` revalida o token no servidor de auth. Não use `getSession()`
  // para decisões de acesso: ele apenas lê o cookie, que é controlado pelo cliente.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, userId: user?.id ?? null };
}
