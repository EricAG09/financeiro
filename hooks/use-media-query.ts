"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Consulta de media query.
 *
 * O layout é mobile-first: use este hook apenas para *adicionar* comportamento
 * em telas maiores, nunca para construir a versão mobile a partir da desktop.
 * No servidor devolve `false` — a versão mobile é sempre o ponto de partida.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onChange);

      return () => mediaQuery.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export const useIsDesktop = (): boolean => useMediaQuery("(min-width: 768px)");
