import type { Cents } from "@/types/money";

export type AIMessageRole = "user" | "assistant";

export interface AIMessage {
  readonly id: string;
  readonly role: AIMessageRole;
  readonly content: string;
  readonly createdAt: string;
}

/**
 * Contexto financeiro enviado ao modelo.
 *
 * Regra: apenas agregados já calculados pelo sistema. Nunca a base bruta do
 * usuário, nunca identificadores desnecessários.
 * Ver docs/ai/agent-architecture.md.
 */
export interface FinancialContext {
  readonly referenceMonth: string;
  readonly currency: string;
  readonly availableBalance: Cents;
  readonly monthlyIncome: Cents;
  readonly monthlyExpenses: Cents;
  readonly expensesByCategory: readonly {
    readonly label: string;
    readonly amount: Cents;
  }[];
}
