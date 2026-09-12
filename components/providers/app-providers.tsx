"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
