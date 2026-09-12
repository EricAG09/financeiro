import { describe, expect, it } from "vitest";
import { buildMonthlySummary, expensesByCategory } from "@/lib/calculations/summary";
import type { Transaction } from "@/types/finance";

function makeTransaction(
  overrides: Partial<Transaction> & Pick<Transaction, "id">,
): Transaction {
  return {
    accountId: "account-1",
    categoryId: null,
    kind: "expense",
    amount: 10_000,
    description: "Lançamento",
    occurredOn: "2026-06-10",
    notes: null,
    ...overrides,
  };
}

describe("buildMonthlySummary", () => {
  it("soma receitas e despesas e devolve o resultado líquido", () => {
    const summary = buildMonthlySummary({
      referenceMonth: "2026-06-01",
      transactions: [
        makeTransaction({ id: "1", kind: "income", amount: 500_000 }),
        makeTransaction({ id: "2", kind: "expense", amount: 120_000 }),
        makeTransaction({ id: "3", kind: "expense", amount: 120_000 }),
      ],
      plannedSavings: 100_000,
    });

    expect(summary.income).toBe(500_000);
    expect(summary.expenses).toBe(240_000);
    expect(summary.net).toBe(260_000);
  });

  it("devolve zeros para um mês sem lançamentos", () => {
    const summary = buildMonthlySummary({
      referenceMonth: "2026-06-01",
      transactions: [],
      plannedSavings: 0,
    });

    expect(summary).toEqual({
      referenceMonth: "2026-06-01",
      income: 0,
      expenses: 0,
      net: 0,
      plannedSavings: 0,
    });
  });
});

describe("expensesByCategory", () => {
  it("agrupa apenas despesas, da maior para a menor", () => {
    const totals = expensesByCategory([
      makeTransaction({ id: "1", categoryId: "alimentacao", amount: 30_000 }),
      makeTransaction({ id: "2", categoryId: "moradia", amount: 150_000 }),
      makeTransaction({ id: "3", categoryId: "alimentacao", amount: 20_000 }),
      makeTransaction({
        id: "4",
        kind: "income",
        categoryId: "salario",
        amount: 900_000,
      }),
    ]);

    expect(totals).toEqual([
      { categoryId: "moradia", amount: 150_000 },
      { categoryId: "alimentacao", amount: 50_000 },
    ]);
  });
});
