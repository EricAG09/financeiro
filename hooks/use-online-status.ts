"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);

  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/**
 * Estado de conectividade.
 *
 * `navigator.onLine` só garante que existe interface de rede — não que a API
 * responde. Serve para UX (avisar o usuário), nunca para decidir se um dado
 * financeiro pode ser confiado.
 *
 * No servidor assume "online" para não renderizar o aviso de offline no HTML.
 */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
