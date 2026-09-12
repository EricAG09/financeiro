"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/**
 * Evento de instalação de PWA (Chromium). Não faz parte do lib.dom padrão.
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: readonly string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface InstallPromptState {
  readonly canInstall: boolean;
  readonly isStandalone: boolean;
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
}

const STANDALONE_QUERY = "(display-mode: standalone)";

function subscribeToStandalone(onChange: () => void): () => void {
  const mediaQuery = window.matchMedia(STANDALONE_QUERY);
  mediaQuery.addEventListener("change", onChange);
  window.addEventListener("appinstalled", onChange);

  return () => {
    mediaQuery.removeEventListener("change", onChange);
    window.removeEventListener("appinstalled", onChange);
  };
}

function getStandaloneSnapshot(): boolean {
  // iOS usa `navigator.standalone`; os demais usam display-mode.
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone;

  return window.matchMedia(STANDALONE_QUERY).matches || iosStandalone === true;
}

/**
 * Estado de instalação do PWA.
 *
 * No iOS não existe `beforeinstallprompt`: a instalação é manual, via
 * "Compartilhar > Adicionar à Tela de Início". A UI deve instruir, não prometer
 * um botão que não existe — por isso `canInstall` e `isStandalone` são separados.
 */
export function useInstallPrompt(): InstallPromptState {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  const isStandalone = useSyncExternalStore(
    subscribeToStandalone,
    getStandaloneSnapshot,
    () => false,
  );

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredEvent(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => setDeferredEvent(null);

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredEvent) return "unavailable" as const;

    await deferredEvent.prompt();
    const { outcome } = await deferredEvent.userChoice;
    setDeferredEvent(null);

    return outcome;
  }, [deferredEvent]);

  return { canInstall: deferredEvent !== null, isStandalone, promptInstall };
}
