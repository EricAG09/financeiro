import { sumCents } from "@/backend/domain/money";
import type { MonthlySummary, Transaction } from "@/shared/types/finance";
import type { Cents } from "@/shared/types/money";

/**
 * Cálculos de resumo mensal.
 *
 * Funções puras, sem I/O e sem React. A IA NUNCA executa estas contas —
 * ela apenas descreve o resultado (ver docs/ai/agent-architecture.md).
 */

export function totalByKind(
  transactions: readonly Transaction[],
  kind: Transaction["kind"],
): Cents {
  return sumCents(
    transactions.filter((transaction) => transaction.kind === kind).map((t) => t.amount),
  );
}

export function buildMonthlySummary(input: {
  readonly referenceMonth: string;
  readonly transactions: readonly Transaction[];
  readonly plannedSavings: Cents;
}): MonthlySummary {
  const income = totalByKind(input.transactions, "income");
  const expenses = totalByKind(input.transactions, "expense");

  return {
    referenceMonth: input.referenceMonth,
    income,
    expenses,
    net: income - expenses,
    plannedSavings: input.plannedSavings,
  };
}

export interface CategoryTotal {
  readonly categoryId: string | null;
  readonly amount: Cents;
}

/** Agrupa despesas por categoria, ordenadas da maior para a menor. */
export function expensesByCategory(
  transactions: readonly Transaction[],
): readonly CategoryTotal[] {
  const totals = new Map<string | null, Cents>();

  for (const transaction of transactions) {
    if (transaction.kind !== "expense") continue;
    totals.set(
      transaction.categoryId,
      (totals.get(transaction.categoryId) ?? 0) + transaction.amount,
    );
  }

  return [...totals.entries()]
    .map(([categoryId, amount]) => ({ categoryId, amount }))
    .sort((a, b) => b.amount - a.amount);
}
