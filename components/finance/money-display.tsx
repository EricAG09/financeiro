import { formatCents, formatCentsCompact } from "@/lib/format/currency";
import { cn } from "@/lib/utils";
import type { Cents } from "@/types/money";

type MoneyTone = "neutral" | "income" | "expense" | "auto";
type MoneySize = "sm" | "md" | "lg" | "xl";

interface MoneyDisplayProps {
  readonly amount: Cents;
  readonly tone?: MoneyTone;
  readonly size?: MoneySize;
  /** Mostra "+" / "−" antes do valor. Útil em listas de lançamentos. */
  readonly showSign?: boolean;
  /** Formato reduzido ("R$ 2,4 mil") para caber em cards estreitos. */
  readonly compact?: boolean;
  /** Oculta o valor visualmente (modo privacidade), mantendo-o para leitores de tela. */
  readonly hidden?: boolean;
  readonly className?: string;
}

const SIZE_CLASSES: Record<MoneySize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl font-semibold tracking-tight",
  xl: "text-4xl font-semibold tracking-tight",
};

const TONE_CLASSES: Record<Exclude<MoneyTone, "auto">, string> = {
  neutral: "text-foreground",
  income: "text-income",
  expense: "text-expense",
};

/**
 * Exibição de valores monetários.
 *
 * Único componente autorizado a renderizar dinheiro. Garante dígitos tabulares,
 * formatação pt-BR consistente e semântica de cor uniforme em todo o app.
 */
export function MoneyDisplay({
  amount,
  tone = "neutral",
  size = "md",
  showSign = false,
  compact = false,
  hidden = false,
  className,
}: MoneyDisplayProps) {
  const resolvedTone =
    tone === "auto" ? (amount < 0 ? "expense" : amount > 0 ? "income" : "neutral") : tone;

  const formatted = compact
    ? formatCentsCompact(Math.abs(amount))
    : formatCents(Math.abs(amount));
  const sign = !showSign ? "" : amount > 0 ? "+" : amount < 0 ? "\u2212" : "";

  return (
    <span
      className={cn("tabular", SIZE_CLASSES[size], TONE_CLASSES[resolvedTone], className)}
    >
      <span
        aria-hidden={hidden ? undefined : true}
        className={cn(hidden && "select-none")}
      >
        {hidden ? "•••••" : `${sign}${formatted}`}
      </span>
      {hidden ? <span className="sr-only">{`${sign}${formatted}`}</span> : null}
    </span>
  );
}
