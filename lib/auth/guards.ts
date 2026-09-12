import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { routes } from "@/constants/routes";
import { getCurrentUser } from "@/lib/auth/session";

/**
 * Guarda de rota para Server Components e Server Actions.
 *
 * IMPORTANTE: esta é uma proteção de UX/roteamento, não a fronteira de
 * segurança. A autorização real é do banco (RLS). Mesmo que este guard falhe,
 * o Postgres deve continuar negando acesso a dados de outro usuário.
 */
export async function requireUser(
  redirectTo: string = routes.auth.signIn,
): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}
