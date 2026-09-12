"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/frontend/components/layout/bottom-nav";
import { ThemeToggle } from "@/frontend/components/theme/theme-toggle";
import { routes } from "@/shared/constants/routes";
import { siteConfig } from "@/shared/config/site";
import { cn } from "@/frontend/lib/utils";

/**
 * Navegação de telas largas.
 *
 * É uma evolução da barra inferior — mesmos destinos, mesma ordem, mesmos
 * rótulos. Nunca introduza aqui um destino que não exista no mobile.
 */
export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-card/95 backdrop-blur-sm md:block">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-6 px-6">
        <Link href={routes.home} className="text-base font-semibold tracking-tight">
          {siteConfig.name}
        </Link>

        <nav aria-label="Navegação principal" className="flex flex-1 items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === routes.home
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
