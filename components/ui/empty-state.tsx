import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  readonly icon?: LucideIcon;
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

/** Estado vazio padrão. Toda lista da aplicação deve usar este componente. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center",
        className,
      )}
    >
      {Icon ? (
        <div className="rounded-full bg-muted p-3 text-muted-foreground">
          <Icon className="size-6" aria-hidden />
        </div>
      ) : null}

      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {action}
    </div>
  );
}
