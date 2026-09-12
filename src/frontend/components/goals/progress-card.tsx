import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Progress } from "@/frontend/components/ui/progress";
import { formatPercentage } from "@/frontend/lib/format/currency";
import { cn } from "@/frontend/lib/utils";

interface ProgressCardProps {
  readonly title: string;
  readonly icon?: LucideIcon;
  /** 0–100. */
  readonly percentage: number;
  readonly primaryValue: ReactNode;
  readonly secondaryValue?: ReactNode;
  readonly footer?: ReactNode;
  readonly className?: string;
}

/**
 * Card genérico de progresso. Base de `GoalCard` e de qualquer indicador de
 * avanço — evita cada área reinventar o mesmo layout.
 */
export function ProgressCard({
  title,
  icon: Icon,
  percentage,
  primaryValue,
  secondaryValue,
  footer,
  className,
}: ProgressCardProps) {
  return (
    <Card className={cn("shadow-none", className)}>
      <CardContent className="space-y-3 px-4 py-4">
        <div className="flex items-center gap-2">
          {Icon ? (
            <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          ) : null}
          <p className="min-w-0 flex-1 truncate text-sm font-medium">{title}</p>
          <span className="tabular text-xs text-muted-foreground">
            {formatPercentage(percentage)}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          {primaryValue}
          {secondaryValue}
        </div>

        <Progress
          value={percentage}
          aria-label={`Progresso de ${title}`}
          className="h-2 [&>[data-slot=progress-indicator]]:bg-accent"
        />

        {footer ? <div className="text-xs text-muted-foreground">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}
