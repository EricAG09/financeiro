import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MoneyDisplay } from "@/components/finance/money-display";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MonthlySummary } from "@/types/finance";
import type { Cents } from "@/types/money";

interface SummaryTileProps {
  readonly label: string;
  readonly amount: Cents;
  readonly icon: LucideIcon;
  readonly tone: "income" | "expense";
}

function SummaryTile({ label, amount, icon: Icon, tone }: SummaryTileProps) {
  return (
    <Card className="shadow-none">
      <CardContent className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-full",
              tone === "income"
                ? "bg-success-subtle text-success"
                : "bg-critical-subtle text-critical",
            )}
          >
            <Icon className="size-3.5" aria-hidden />
          </span>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        </div>

        <MoneyDisplay
          amount={amount}
          tone={tone}
          size="md"
          className="mt-2 block font-semibold"
        />
      </CardContent>
    </Card>
  );
}

/** Receitas x despesas do mês, lado a lado. */
export function FinancialSummary({ summary }: { summary: MonthlySummary }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SummaryTile
        label="Receitas do mês"
        amount={summary.income}
        icon={ArrowDownLeft}
        tone="income"
      />
      <SummaryTile
        label="Despesas do mês"
        amount={summary.expenses}
        icon={ArrowUpRight}
        tone="expense"
      />
    </div>
  );
}
