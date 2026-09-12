import { Skeleton } from "@/frontend/components/ui/skeleton";
import { cn } from "@/frontend/lib/utils";

interface LoadingStateProps {
  readonly label?: string;
  readonly rows?: number;
  readonly className?: string;
}

/**
 * Estado de carregamento padrão.
 *
 * Usa esqueleto em vez de spinner: preserva o layout e evita o "pulo" de
 * conteúdo, que em telas de dinheiro é especialmente desconfortável.
 */
export function LoadingState({
  label = "Carregando",
  rows = 3,
  className,
}: LoadingStateProps) {
  return (
    <div className={cn("space-y-3", className)} role="status" aria-busy="true">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}
