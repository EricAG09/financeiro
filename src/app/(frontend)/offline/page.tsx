import { WifiOff } from "lucide-react";
import type { Metadata } from "next";
import { EmptyState } from "@/frontend/components/ui/empty-state";

export const metadata: Metadata = { title: "Sem conexão" };

/**
 * Página servida pelo service worker quando a navegação falha.
 *
 * É deliberadamente estática e sem nenhum dado do usuário: é o único documento
 * HTML que o app mantém em cache (ver public/sw.js).
 */
export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg items-center px-4 py-10">
      <EmptyState
        className="w-full"
        icon={WifiOff}
        title="Você está sem conexão"
        description="Seus dados financeiros não ficam salvos no dispositivo. Reconecte-se para consultá-los."
      />
    </div>
  );
}
