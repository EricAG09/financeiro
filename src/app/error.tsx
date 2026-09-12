"use client";

import { useEffect } from "react";
import { ErrorState } from "@/frontend/components/ui/error-state";

/**
 * Fronteira de erro da aplicação.
 *
 * A mensagem exibida é sempre genérica. O detalhe do erro fica no log do
 * servidor — nunca na tela, nunca com stack trace.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro na aplicação", { digest: error.digest });
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 items-center px-4 py-10">
      <ErrorState
        onRetry={reset}
        description="Não foi possível exibir esta página. Tente novamente em alguns instantes."
        className="w-full"
      />
    </div>
  );
}
