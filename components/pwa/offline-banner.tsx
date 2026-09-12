"use client";

import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

/**
 * Aviso de conexão indisponível.
 *
 * Em app financeiro é obrigatório sinalizar que os números na tela podem estar
 * desatualizados — o usuário não pode tomar decisão achando que viu o saldo atual.
 */
export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-2 bg-warning-subtle px-4 py-2 text-sm text-warning-foreground"
    >
      <WifiOff className="size-4 shrink-0" aria-hidden />
      <span className="text-foreground">
        Sem conexão. Os valores exibidos podem estar desatualizados.
      </span>
    </div>
  );
}
