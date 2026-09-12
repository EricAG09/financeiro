import type { Cents } from "@/shared/types/money";

export type GoalStatus = "active" | "achieved" | "paused" | "cancelled";

export interface FinancialGoal {
  readonly id: string;
  readonly name: string;
  readonly targetAmount: Cents;
  readonly currentAmount: Cents;
  /** `YYYY-MM-DD` ou `null` quando a meta não tem prazo. */
  readonly targetDate: string | null;
  readonly status: GoalStatus;
}

/** Resultado de `lib/calculations/goals.ts`. */
export interface GoalProgress {
  readonly remaining: Cents;
  /** 0–100, já limitado (clamped). */
  readonly percentage: number;
  readonly monthsRemaining: number | null;
  readonly requiredMonthlyContribution: Cents | null;
  readonly isAchieved: boolean;
}
