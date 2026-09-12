"use client";

import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  // O valor nunca muda depois da hidratação, então não há nada para assinar.
  return () => {};
}

/**
 * `false` durante o render do servidor e na primeira passada do cliente;
 * `true` depois da hidratação.
 *
 * Use quando o componente depende de algo que só existe no browser (tema,
 * `matchMedia`, `localStorage`) e renderizá-lo cedo causaria divergência de
 * hidratação. É preferível a `useState` + `useEffect`: não dispara re-render
 * em cascata.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
