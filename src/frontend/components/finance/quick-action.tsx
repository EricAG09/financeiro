import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/frontend/lib/utils";

interface QuickActionProps {
  readonly href: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly emphasis?: boolean;
  readonly className?: string;
}

/**
 * Ação rápida do dashboard.
 *
 * Registrar uma despesa pelo celular precisa caber em um toque — por isso o
 * alvo é generoso e o rótulo é curto.
 */
export function QuickAction({
  href,
  label,
  icon: Icon,
  emphasis = false,
  className,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-touch flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2 py-3 transition-colors",
        "hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        emphasis && "border-accent/40 bg-accent/5",
        className,
      )}
    >
      <Icon
        className={cn("size-5", emphasis ? "text-accent" : "text-muted-foreground")}
        aria-hidden
      />
      <span className="text-center text-xs leading-tight font-medium">{label}</span>
    </Link>
  );
}
