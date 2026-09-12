"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Escuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // O tema só é conhecido no cliente; renderizar antes disso causa hydration mismatch.
  const isHydrated = useIsHydrated();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Alternar tema"
          className="size-touch"
        >
          {isHydrated && theme === "dark" ? (
            <Moon className="size-5" />
          ) : (
            <Sun className="size-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => setTheme(option.value)}>
            <option.icon className="size-4" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
