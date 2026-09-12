import { Eye, EyeOff } from "lucide-react";
import { MoneyDisplay } from "@/frontend/components/finance/money-display";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { cn } from "@/frontend/lib/utils";
import type { Cents } from "@/shared/types/money";

interface BalanceCardProps {
  readonly label: string;
  readonly amount: Cents;
  readonly caption?: string;
  /** Estado do modo privacidade. Controlado pelo pai para valer no app todo. */
  readonly hidden?: boolean;
  readonly onToggleVisibility?: () => void;
  readonly className?: string;
}

/**
 * Card de saldo — elemento de maior hierarquia do dashboard.
 * Fundo escuro da marca para separar do restante da tela em ambos os temas.
 */
export function BalanceCard({
  label,
  amount,
  caption,
  hidden = false,
  onToggleVisibility,
  className,
}: BalanceCardProps) {
  return (
    <Card
      className={cn("border-0 bg-primary text-primary-foreground shadow-none", className)}
    >
      <CardContent className="px-5 py-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-primary-foreground/70">{label}</p>

          {onToggleVisibility ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleVisibility}
              aria-label={hidden ? "Mostrar valores" : "Ocultar valores"}
              className="size-8 text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground"
            >
              {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          ) : null}
        </div>

        <MoneyDisplay
          amount={amount}
          size="xl"
          hidden={hidden}
          className="mt-1 block text-primary-foreground"
        />

        {caption ? (
          <p className="mt-2 text-xs text-primary-foreground/60">{caption}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
