import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { MoneyDisplay } from "@/frontend/components/finance/money-display";
import { formatDayMonth } from "@/frontend/lib/format/date";
import { cn } from "@/frontend/lib/utils";
import type { TransactionKind } from "@/shared/types/finance";
import type { Cents } from "@/shared/types/money";

interface TransactionItemProps {
  readonly description: string;
  readonly categoryLabel?: string;
  readonly kind: TransactionKind;
  readonly amount: Cents;
  /** Data de competência `YYYY-MM-DD`. */
  readonly occurredOn: string;
  readonly className?: string;
}

/** Linha de lançamento. Alvo de toque confortável e valor sempre à direita. */
export function TransactionItem({
  description,
  categoryLabel,
  kind,
  amount,
  occurredOn,
  className,
}: TransactionItemProps) {
  const isIncome = kind === "income";
  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;

  return (
    <div
      className={cn(
        "flex min-h-touch items-center gap-3 rounded-xl px-1 py-2.5",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          isIncome ? "bg-success-subtle text-success" : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{description}</p>
        <p className="truncate text-xs text-muted-foreground">
          {categoryLabel ? `${categoryLabel} · ` : ""}
          {formatDayMonth(occurredOn)}
        </p>
      </div>

      <MoneyDisplay
        amount={isIncome ? amount : -amount}
        tone="auto"
        size="sm"
        showSign
        className="shrink-0 font-medium"
      />
    </div>
  );
}
