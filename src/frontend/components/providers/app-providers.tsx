"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "@/frontend/components/providers/query-provider";
import { ThemeProvider } from "@/frontend/components/theme/theme-provider";
import { TooltipProvider } from "@/frontend/components/ui/tooltip";

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
