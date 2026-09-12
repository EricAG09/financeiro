import { percentageOf } from "@/backend/domain/money";
import type { Cents } from "@/shared/types/money";

export type BudgetHealth = "on_track" | "warning" | "exceeded";

export interface BudgetStatus {
  readonly plannedAmount: Cents;
  readonly spentAmount: Cents;
  readonly remaining: Cents;
  /** 0–100, limitado. */
  readonly usagePercentage: number;
  readonly health: BudgetHealth;
}

/** Limite a partir do qual o orçamento entra em estado de atenção. */
export const BUDGET_WARNING_THRESHOLD = 80;

export function calculateBudgetStatus(input: {
  readonly plannedAmount: Cents;
  readonly spentAmount: Cents;
}): BudgetStatus {
  const { plannedAmount, spentAmount } = input;
  const remaining = plannedAmount - spentAmount;
  const usagePercentage = percentageOf(spentAmount, plannedAmount);

  const health: BudgetHealth =
    spentAmount > plannedAmount
      ? "exceeded"
      : usagePercentage >= BUDGET_WARNING_THRESHOLD
        ? "warning"
        : "on_track";

  return { plannedAmount, spentAmount, remaining, usagePercentage, health };
}

/**
 * Simula o impacto de uma compra no saldo projetado do mês.
 * Base do tool `simulate_purchase()` do agente — o cálculo fica no sistema.
 */
export function simulatePurchaseImpact(input: {
  readonly projectedBalance: Cents;
  readonly purchaseAmount: Cents;
  readonly plannedSavings: Cents;
}): {
  readonly balanceAfterPurchase: Cents;
  readonly savingsAfterPurchase: Cents;
  readonly fitsWithoutTouchingSavings: boolean;
} {
  const balanceAfterPurchase = input.projectedBalance - input.purchaseAmount;
  const savingsAfterPurchase = Math.min(input.plannedSavings, balanceAfterPurchase);

  return {
    balanceAfterPurchase,
    savingsAfterPurchase,
    fitsWithoutTouchingSavings: balanceAfterPurchase >= input.plannedSavings,
  };
}
