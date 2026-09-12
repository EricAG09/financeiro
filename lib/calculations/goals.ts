import { clamp, percentageOf } from "@/lib/finance/money";
import { monthsBetween, todayIsoDate } from "@/lib/format/date";
import type { FinancialGoal, GoalProgress } from "@/types/goals";

/**
 * Progresso de metas — função pura.
 *
 * Responde: quanto falta, percentual concluído, quanto guardar por mês e se a
 * meta já foi atingida.
 */
export function calculateGoalProgress(
  goal: FinancialGoal,
  referenceDate: string = todayIsoDate(),
): GoalProgress {
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const percentage = percentageOf(goal.currentAmount, goal.targetAmount);
  const isAchieved = remaining === 0;

  if (goal.targetDate === null) {
    return {
      remaining,
      percentage,
      monthsRemaining: null,
      requiredMonthlyContribution: null,
      isAchieved,
    };
  }

  const monthsRemaining = clamp(
    monthsBetween(referenceDate, goal.targetDate),
    0,
    Number.MAX_SAFE_INTEGER,
  );

  // Sem prazo restante, o valor que falta precisa ser aportado de uma vez.
  const requiredMonthlyContribution = isAchieved
    ? 0
    : monthsRemaining === 0
      ? remaining
      : Math.ceil(remaining / monthsRemaining);

  return {
    remaining,
    percentage,
    monthsRemaining,
    requiredMonthlyContribution,
    isAchieved,
  };
}
