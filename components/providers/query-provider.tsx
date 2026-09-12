"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/**
 * TanStack Query.
 *
 * Cuidado com dados financeiros: `staleTime` curto e nenhuma persistência em
 * disco. Dado sensível vive só em memória e some quando a aba fecha.
 * Ver docs/pwa/offline-strategy.md.
 */
function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  // `useState` garante um client por montagem — não compartilhado entre usuários.
  const [queryClient] = useState(createQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
