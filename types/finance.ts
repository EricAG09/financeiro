import type { Cents } from "@/types/money";

export type TransactionKind = "income" | "expense";

export type AccountKind = "checking" | "savings" | "cash" | "wallet" | "credit_card";

export type RecurrenceFrequency = "monthly" | "weekly" | "yearly";

export interface Account {
  readonly id: string;
  readonly name: string;
  readonly kind: AccountKind;
  readonly currentBalance: Cents;
  readonly archived: boolean;
}

export interface TransactionCategory {
  readonly id: string;
  readonly slug: string;
  readonly label: string;
  readonly kind: TransactionKind;
  readonly icon: string;
}

export interface Transaction {
  readonly id: string;
  readonly accountId: string;
  readonly categoryId: string | null;
  readonly kind: TransactionKind;
  readonly amount: Cents;
  readonly description: string;
  /** Data de competência no formato `YYYY-MM-DD`. */
  readonly occurredOn: string;
  readonly notes: string | null;
}

export interface RecurringTransaction {
  readonly id: string;
  readonly accountId: string;
  readonly categoryId: string | null;
  readonly kind: TransactionKind;
  readonly amount: Cents;
  readonly description: string;
  readonly frequency: RecurrenceFrequency;
  /** Dia do mês (1–31) para recorrência mensal. */
  readonly dayOfMonth: number | null;
  readonly active: boolean;
}

export interface Budget {
  readonly id: string;
  readonly categoryId: string;
  /** Primeiro dia do mês de referência, `YYYY-MM-01`. */
  readonly referenceMonth: string;
  readonly plannedAmount: Cents;
}

/** Resultado de `lib/calculations/summary.ts`. Nunca calculado pela IA. */
export interface MonthlySummary {
  readonly referenceMonth: string;
  readonly income: Cents;
  readonly expenses: Cents;
  readonly net: Cents;
  readonly plannedSavings: Cents;
}
