import { describe, expect, it } from "vitest";
import { calculateBudgetStatus, simulatePurchaseImpact } from "@/lib/calculations/budget";

describe("calculateBudgetStatus", () => {
  it("classifica orçamento dentro do planejado", () => {
    const status = calculateBudgetStatus({ plannedAmount: 100_000, spentAmount: 40_000 });

    expect(status.health).toBe("on_track");
    expect(status.remaining).toBe(60_000);
    expect(status.usagePercentage).toBe(40);
  });

  it("alerta ao atingir o limite de atenção", () => {
    const status = calculateBudgetStatus({ plannedAmount: 100_000, spentAmount: 80_000 });
    expect(status.health).toBe("warning");
  });

  it("aponta orçamento excedido e saldo negativo", () => {
    const status = calculateBudgetStatus({
      plannedAmount: 100_000,
      spentAmount: 130_000,
    });

    expect(status.health).toBe("exceeded");
    expect(status.remaining).toBe(-30_000);
  });
});

describe("simulatePurchaseImpact", () => {
  it("indica quando a compra não invade o valor reservado", () => {
    const result = simulatePurchaseImpact({
      projectedBalance: 200_000,
      purchaseAmount: 35_000,
      plannedSavings: 100_000,
    });

    expect(result.balanceAfterPurchase).toBe(165_000);
    expect(result.fitsWithoutTouchingSavings).toBe(true);
  });

  it("indica quando a compra consome a reserva planejada", () => {
    const result = simulatePurchaseImpact({
      projectedBalance: 120_000,
      purchaseAmount: 35_000,
      plannedSavings: 100_000,
    });

    expect(result.fitsWithoutTouchingSavings).toBe(false);
    expect(result.savingsAfterPurchase).toBe(85_000);
  });
});
