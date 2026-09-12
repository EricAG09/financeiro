import { NextResponse, type NextRequest } from "next/server";
import { isBypassedRoute } from "@/constants/routes";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Proxy de borda (antigo middleware.ts — renomeado no Next 16).
 *
 * Responsabilidades:
 * 1. renovar a sessão do Supabase e propagar os cookies;
 * 2. emitir a Content-Security-Policy com nonce por requisição.
 *
 * O que este arquivo NÃO é: a camada de autorização. Bloquear rota aqui é UX.
 * Quem autoriza acesso a dado é o Postgres, via RLS.
 */

function buildContentSecurityPolicy(
  nonce: string,
  supabaseUrl: string | undefined,
): string {
  const isDevelopment = process.env.NODE_ENV !== "production";

  // Em desenvolvimento o Next precisa de eval para o hot reload.
  const scriptSrc = isDevelopment
    ? `'self' 'nonce-${nonce}' 'unsafe-eval' 'strict-dynamic'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const connectSrc = ["'self'", supabaseUrl, isDevelopment ? "ws:" : null]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    // Tailwind injeta estilos em runtime; nonce em <style> não é viável aqui.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export default async function proxy(request: NextRequest): Promise<NextResponse> {
  if (isBypassedRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const nonce = crypto.randomUUID().replaceAll("-", "");
  const csp = buildContentSecurityPolicy(nonce, process.env.NEXT_PUBLIC_SUPABASE_URL);

  // O Next lê `x-nonce` do request para assinar os próprios scripts.
  request.headers.set("x-nonce", nonce);
  request.headers.set("Content-Security-Policy", csp);

  const { response } = await updateSession(request);
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    /*
     * Roda em tudo, menos arquivos estáticos e imagens — eles não têm sessão
     * nem precisam de CSP.
     */
    "/((?!_next/static|_next/image|favicon.ico|icons/|sw.js|manifest.webmanifest|.*\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?)$).*)",
  ],
};
