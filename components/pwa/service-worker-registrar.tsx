"use client";

import { useEffect } from "react";

/**
 * Registra o service worker.
 *
 * Só em produção: em desenvolvimento um SW ativo mascara alterações de código e
 * atrapalha o diagnóstico.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch((error: unknown) => {
          console.error("Falha ao registrar o service worker", error);
        });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}

/**
 * Remove todo o conteúdo em cache do dispositivo.
 * Deve ser chamado no logout — ver docs/pwa/offline-strategy.md.
 */
export async function purgeServiceWorkerCaches(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.getRegistration();
  registration?.active?.postMessage({ type: "PURGE_CACHES" });
}
