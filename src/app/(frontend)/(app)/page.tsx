import { Receipt } from "lucide-react";
import { BalanceCard } from "@/frontend/components/finance/balance-card";
import { FinancialSummary } from "@/frontend/components/finance/financial-summary";
import { QuickActionsGrid } from "@/frontend/components/finance/quick-actions-grid";
import { FoundationStatus } from "@/frontend/components/layout/foundation-status";
import { EmptyState } from "@/frontend/components/ui/empty-state";
import { buildMonthlySummary } from "@/backend/domain/calculations/summary";
import { toReferenceMonth } from "@/backend/domain/dates";
import { formatMonthYear } from "@/frontend/lib/format/date";

/**
 * Dashboard — Etapa 1.
 *
 * A estrutura visual definitiva já está montada, mas NÃO há dados: sem Supabase
 * configurado não existe de onde ler, e valores fictícios em tela de dinheiro
 * são inaceitáveis. Os totais vêm do mesmo cálculo real
 * (`buildMonthlySummary`) aplicado a uma lista vazia.
 */
export default function DashboardPage() {
  const referenceMonth = toReferenceMonth();

  const summary = buildMonthlySummary({
    referenceMonth,
    transactions: [],
    plannedSavings: 0,
  });

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-muted-foreground">Olá</p>
        <h1 className="text-xl font-semibold tracking-tight">
          Seu resumo de {formatMonthYear(referenceMonth)}
        </h1>
      </header>

      <BalanceCard
        label="Saldo disponível"
        amount={0}
        caption="Conecte o Supabase para carregar seus dados reais."
      />

      <FinancialSummary summary={summary} />

      <section aria-labelledby="acoes-rapidas" className="space-y-2.5">
        <h2 id="acoes-rapidas" className="text-sm font-medium">
          Ações rápidas
        </h2>
        <QuickActionsGrid />
      </section>

      <section aria-labelledby="lancamentos" className="space-y-2.5">
        <h2 id="lancamentos" className="text-sm font-medium">
          Últimos lançamentos
        </h2>
        <EmptyState
          icon={Receipt}
          title="Nenhum lançamento ainda"
          description="O registro de receitas e despesas entra na próxima etapa, junto com o banco de dados."
        />
      </section>

      <FoundationStatus />
    </div>
  );
}
