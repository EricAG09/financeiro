/**
 * Paleta dos gráficos.
 *
 * Os componentes de gráfico leem daqui, nunca de hexadecimais soltos. Os
 * valores apontam para os tokens de tema, então claro e escuro funcionam sem
 * código condicional.
 */
export const chartPalette = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
] as const;

export const chartSemanticColors = {
  income: "var(--color-income)",
  expense: "var(--color-expense)",
  planned: "var(--color-muted-foreground)",
} as const;

export function chartColorAt(index: number): string {
  return chartPalette[index % chartPalette.length] ?? chartPalette[0];
}
