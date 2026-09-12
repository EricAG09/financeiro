import { MoneyDisplay } from "@/components/finance/money-display";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { BudgetStatus } from "@/lib/calculations/budget";
import { formatPercentage } from "@/lib/format/currency";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  readonly categoryLabel: string;
  readonly status: BudgetStatus;
  readonly className?: string;
}

const HEALTH_LABEL: Record<BudgetStatus["health"], string> = {
  on_track: "Dentro do planejado",
  warning: "Perto do limite",
  exceeded: "Orçamento excedido",
};

const HEALTH_TEXT: Record<BudgetStatus["health"], string> = {
  on_track: "text-muted-foreground",
  warning: "text-warning",
  exceeded: "text-critical",
};

const HEALTH_INDICATOR: Record<BudgetStatus["health"], string> = {
  on_track: "[&>[data-slot=progress-indicator]]:bg-success",
  warning: "[&>[data-slot=progress-indicator]]:bg-warning",
  exceeded: "[&>[data-slot=progress-indicator]]:bg-critical",
};

/** Situação de um orçamento por categoria. O cálculo vem de `lib/calculations/budget.ts`. */
export function BudgetCard({ categoryLabel, status, className }: BudgetCardProps) {
  return (
    <Card className={cn("shadow-none", className)}>
      <CardContent className="space-y-3 px-4 py-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium">{categoryLabel}</p>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(status.usagePercentage)}
          </p>
        </div>

        <Progress
          value={status.usagePercentage}
          aria-label={`Uso do orçamento de ${categoryLabel}`}
          className={cn("h-2", HEALTH_INDICATOR[status.health])}
        />

        <div className="flex items-center justify-between gap-2 text-xs">
          <span className={HEALTH_TEXT[status.health]}>
            {HEALTH_LABEL[status.health]}
          </span>
          <span className="text-muted-foreground">
            <MoneyDisplay amount={status.spentAmount} size="sm" /> de{" "}
            <MoneyDisplay amount={status.plannedAmount} size="sm" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
