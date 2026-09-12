import { describe, expect, it } from "vitest";
import { calculateGoalProgress } from "@/backend/domain/calculations/goals";
import type { FinancialGoal } from "@/shared/types/goals";

function makeGoal(overrides: Partial<FinancialGoal> = {}): FinancialGoal {
  return {
    id: "goal-1",
    name: "Reserva de emergência",
    targetAmount: 1_000_000,
    currentAmount: 250_000,
    targetDate: null,
    status: "active",
    ...overrides,
  };
}

describe("calculateGoalProgress", () => {
  it("calcula quanto falta e o percentual concluído", () => {
    const progress = calculateGoalProgress(makeGoal());

    expect(progress.remaining).toBe(750_000);
    expect(progress.percentage).toBe(25);
    expect(progress.isAchieved).toBe(false);
  });

  it("não exige aporte mensal quando não há prazo", () => {
    const progress = calculateGoalProgress(makeGoal());

    expect(progress.monthsRemaining).toBeNull();
    expect(progress.requiredMonthlyContribution).toBeNull();
  });

  it("divide o valor restante pelos meses até o prazo", () => {
    const progress = calculateGoalProgress(
      makeGoal({ targetDate: "2026-12-12" }),
      "2026-06-12",
    );

    expect(progress.monthsRemaining).toBe(6);
    expect(progress.requiredMonthlyContribution).toBe(125_000);
  });

  it("cobra o valor restante de uma vez quando o prazo já chegou", () => {
    const progress = calculateGoalProgress(
      makeGoal({ targetDate: "2026-06-12" }),
      "2026-06-12",
    );

    expect(progress.monthsRemaining).toBe(0);
    expect(progress.requiredMonthlyContribution).toBe(750_000);
  });

  it("marca a meta como concluída sem exigir novo aporte", () => {
    const progress = calculateGoalProgress(
      makeGoal({ currentAmount: 1_000_000, targetDate: "2026-12-12" }),
      "2026-06-12",
    );

    expect(progress.isAchieved).toBe(true);
    expect(progress.remaining).toBe(0);
    expect(progress.percentage).toBe(100);
    expect(progress.requiredMonthlyContribution).toBe(0);
  });
});
