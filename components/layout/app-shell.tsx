import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { TopNav } from "@/components/layout/top-nav";
import { OfflineBanner } from "@/components/pwa/offline-banner";

/**
 * Casca da aplicação.
 *
 * Mobile: conteúdo em coluna única + navegação inferior.
 * Desktop (>= md): a mesma coluna, centralizada, com a navegação no topo.
 * O espaçamento inferior reserva a altura da barra e a safe area do iOS.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopNav />
      <OfflineBanner />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 pt-4 pb-[calc(var(--spacing-nav)+1.5rem)] md:max-w-5xl md:px-6 md:pb-10">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
