import { Bot, ListChecks, Minus, Plus, ShoppingCart, Target } from "lucide-react";
import { QuickAction } from "@/frontend/components/finance/quick-action";
import { routes } from "@/shared/constants/routes";

/**
 * Ações rápidas do dashboard.
 *
 * Os destinos apontam para as rotas definitivas; as telas de criação chegam nas
 * próximas etapas. Ordem pensada para o polegar: o que é mais frequente vem primeiro.
 */
const ACTIONS = [
  { href: routes.transactions, label: "Gasto", icon: Minus, emphasis: true },
  { href: routes.transactions, label: "Receita", icon: Plus },
  { href: routes.goals, label: "Meta", icon: Target },
  { href: routes.tasks, label: "Tarefa", icon: ListChecks },
  { href: routes.tasks, label: "Lista", icon: ShoppingCart },
  { href: routes.assistant, label: "Assistente", icon: Bot },
] as const;

export function QuickActionsGrid() {
  return (
    <div className="grid grid-cols-3 gap-2.5 md:grid-cols-6">
      {ACTIONS.map((action) => (
        <QuickAction
          key={`${action.href}-${action.label}`}
          href={action.href}
          label={action.label}
          icon={action.icon}
          emphasis={"emphasis" in action ? action.emphasis : false}
        />
      ))}
    </div>
  );
}
