"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  readonly title?: string;
  /**
   * Mensagem já tratada para exibição. Nunca passe `error.message` cru nem
   * stack trace — ver docs/security/security-model.md.
   */
  readonly description?: string;
  readonly onRetry?: () => void;
  readonly className?: string;
}

export function ErrorState({
  title = "Algo deu errado",
  description = "Não foi possível carregar estas informações. Tente novamente.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-critical/30 bg-critical-subtle px-6 py-10 text-center",
        className,
      )}
    >
      <TriangleAlert className="size-6 text-critical" aria-hidden />
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      ) : null}
    </div>
  );
}
