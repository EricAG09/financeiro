import { NextResponse } from "next/server";

/**
 * Verificação de disponibilidade. Rota: `GET /api/health`.
 *
 * Endpoint público — responde apenas que o servidor está de pé. Nada de versão,
 * estado de configuração, variáveis de ambiente ou dependências: em um app
 * financeiro, health check é superfície de reconhecimento para quem sonda.
 *
 * Também serve de âncora para o grupo `(backend)`: é a prova de que a pasta
 * está roteando. Pode ser removido quando existirem rotas de verdade.
 */
export const dynamic = "force-dynamic";

export function GET(): NextResponse {
  return NextResponse.json(
    { status: "ok" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
