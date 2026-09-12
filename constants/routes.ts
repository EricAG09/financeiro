/**
 * Fonte única de verdade para rotas.
 *
 * ATENÇÃO: esta lista serve para navegação e UX. Ela NÃO é a camada de
 * autorização — autorização real acontece no banco via RLS
 * (ver docs/security/security-model.md).
 */

export const routes = {
  home: "/",
  transactions: "/transacoes",
  goals: "/metas",
  tasks: "/tarefas",
  assistant: "/assistente",
  auth: {
    signIn: "/entrar",
    signUp: "/cadastrar",
    forgotPassword: "/recuperar-senha",
    resetPassword: "/redefinir-senha",
    callback: "/auth/callback",
    signOut: "/auth/sair",
  },
} as const;

/** Rotas acessíveis sem sessão autenticada. */
export const publicRoutes: readonly string[] = [
  routes.auth.signIn,
  routes.auth.signUp,
  routes.auth.forgotPassword,
  routes.auth.resetPassword,
  routes.auth.callback,
];

/** Prefixos ignorados pelo middleware de sessão. */
export const bypassedPrefixes: readonly string[] = [
  "/_next",
  "/icons",
  "/favicon",
  "/manifest.webmanifest",
  "/sw.js",
];

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function isBypassedRoute(pathname: string): boolean {
  return bypassedPrefixes.some((prefix) => pathname.startsWith(prefix));
}
