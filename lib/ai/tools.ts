import { z } from "zod";
import {
  nonNegativeCents,
  positiveCents,
  referenceMonth,
} from "@/lib/validation/primitives";

/**
 * Catálogo de ferramentas do agente financeiro.
 *
 * Princípios inegociáveis:
 * 1. O modelo NUNCA executa SQL. Ele só pode pedir uma ferramenta desta lista.
 * 2. Na Etapa 1 todas as ferramentas são SOMENTE LEITURA (`mutates: false`).
 * 3. Toda entrada é validada por schema antes de tocar o banco.
 * 4. A execução roda no servidor, sob a sessão do usuário, com RLS ativo.
 *
 * Este arquivo declara o contrato. As implementações chegam na etapa do agente.
 */

export const emptyInput = z.object({});
export const monthInput = z.object({ referenceMonth });

export interface AITool<TInput extends z.ZodType> {
  readonly name: string;
  readonly description: string;
  readonly input: TInput;
  /** Sempre `false` na Etapa 1. Ver docs/ai/agent-architecture.md. */
  readonly mutates: false;
}

function readOnlyTool<TInput extends z.ZodType>(tool: {
  name: string;
  description: string;
  input: TInput;
}): AITool<TInput> {
  return { ...tool, mutates: false };
}

export const aiTools = {
  get_current_balance: readOnlyTool({
    name: "get_current_balance",
    description: "Saldo disponível somando todas as contas ativas do usuário.",
    input: emptyInput,
  }),
  get_monthly_income: readOnlyTool({
    name: "get_monthly_income",
    description: "Total de receitas registradas no mês de referência.",
    input: monthInput,
  }),
  get_monthly_expenses: readOnlyTool({
    name: "get_monthly_expenses",
    description: "Total de despesas registradas no mês de referência.",
    input: monthInput,
  }),
  get_expenses_by_category: readOnlyTool({
    name: "get_expenses_by_category",
    description: "Despesas do mês agrupadas por categoria, da maior para a menor.",
    input: monthInput,
  }),
  get_previous_month_comparison: readOnlyTool({
    name: "get_previous_month_comparison",
    description: "Comparativo de receitas e despesas com o mês anterior.",
    input: monthInput,
  }),
  get_upcoming_bills: readOnlyTool({
    name: "get_upcoming_bills",
    description: "Contas e despesas recorrentes com vencimento nos próximos dias.",
    input: z.object({ daysAhead: z.int().min(1).max(90).default(30) }),
  }),
  get_financial_goals: readOnlyTool({
    name: "get_financial_goals",
    description: "Metas do usuário com progresso já calculado pelo sistema.",
    input: emptyInput,
  }),
  get_budget_status: readOnlyTool({
    name: "get_budget_status",
    description: "Situação dos orçamentos por categoria no mês de referência.",
    input: monthInput,
  }),
  simulate_purchase: readOnlyTool({
    name: "simulate_purchase",
    description:
      "Simula o impacto de uma compra no saldo projetado. Não registra nada no banco.",
    input: z.object({
      amount: positiveCents,
      referenceMonth,
      plannedSavings: nonNegativeCents.default(0),
    }),
  }),
} as const;

export type AIToolName = keyof typeof aiTools;

export const aiToolNames: readonly AIToolName[] = Object.keys(aiTools) as AIToolName[];

/**
 * Operações explicitamente proibidas ao agente. Serve como documentação
 * executável e como base para os testes de segurança do agente.
 */
export const forbiddenAICapabilities: readonly string[] = [
  "executar SQL arbitrário",
  "transferir dinheiro",
  "pagar contas",
  "excluir transações",
  "alterar saldo",
  "alterar configurações da conta",
];
