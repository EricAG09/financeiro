import { Target } from "lucide-react";
import { MoneyDisplay } from "@/components/finance/money-display";
import { ProgressCard } from "@/components/goals/progress-card";
import { calculateGoalProgress } from "@/lib/calculations/goals";
import { formatMonthYear } from "@/lib/format/date";
import type { FinancialGoal } from "@/types/goals";

interface GoalCardProps {
  readonly goal: FinancialGoal;
  readonly className?: string;
}

/** Card de meta. Todo número exibido vem de `calculateGoalProgress`. */
export function GoalCard({ goal, className }: GoalCardProps) {
  const progress = calculateGoalProgress(goal);

  return (
    <ProgressCard
      className={className}
      title={goal.name}
      icon={Target}
      percentage={progress.percentage}
      primaryValue={
        <MoneyDisplay amount={goal.currentAmount} size="lg" className="font-semibold" />
      }
      secondaryValue={
        <span className="text-xs text-muted-foreground">
          de <MoneyDisplay amount={goal.targetAmount} size="sm" />
        </span>
      }
      footer={
        progress.isAchieved ? (
          <span className="font-medium text-success">Meta concluída</span>
        ) : (
          <span>
            Faltam <MoneyDisplay amount={progress.remaining} size="sm" />
            {progress.requiredMonthlyContribution !== null && goal.targetDate !== null ? (
              <>
                {" · guardar "}
                <MoneyDisplay amount={progress.requiredMonthlyContribution} size="sm" />
                {`/mês até ${formatMonthYear(goal.targetDate)}`}
              </>
            ) : null}
          </span>
        )
      }
    />
  );
}
