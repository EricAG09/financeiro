"use client";

import { Bot, CheckSquare, Home, Target, WalletCards } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes } from "@/shared/constants/routes";
import { cn } from "@/frontend/lib/utils";

/**
 * Navegação principal: barra inferior.
 *
 * Mobile-first — fica na zona alcançável pelo polegar. Em telas grandes ela
 * sobe para o topo (ver `AppShell`), mas a versão de referência é esta.
 */

const NAV_ITEMS = [
  { href: routes.home, label: "Início", icon: Home },
  { href: routes.transactions, label: "Lançamentos", icon: WalletCards },
  { href: routes.goals, label: "Metas", icon: Target },
  { href: routes.tasks, label: "Tarefas", icon: CheckSquare },
  { href: routes.assistant, label: "Assistente", icon: Bot },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === routes.home ? pathname === href : pathname.startsWith(href);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 safe-bottom backdrop-blur-sm md:hidden"
      style={{ boxShadow: "var(--shadow-nav)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-nav flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-[0.6875rem] font-medium transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  active ? "text-accent" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="size-5 shrink-0" aria-hidden />
                <span className="leading-none">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { NAV_ITEMS };
