import type { Cents } from "@/shared/types/money";

/**
 * Aritmética monetária em centavos.
 *
 * Nunca use `number` com fração para dinheiro. Todas as funções aqui são puras
 * e testadas em `tests/unit/money.test.ts`.
 */

export function toCents(amountInCurrency: number): Cents {
  return Math.round(amountInCurrency * 100);
}

export function toCurrencyNumber(cents: Cents): number {
  return cents / 100;
}

export function sumCents(values: readonly Cents[]): Cents {
  return values.reduce((total, value) => total + value, 0);
}

export function subtractCents(minuend: Cents, subtrahend: Cents): Cents {
  return minuend - subtrahend;
}

/** Multiplica por um fator fracionário mantendo o resultado inteiro. */
export function multiplyCents(cents: Cents, factor: number): Cents {
  return Math.round(cents * factor);
}

/** Divide um valor em `parts` parcelas, distribuindo os centavos restantes. */
export function splitCents(cents: Cents, parts: number): Cents[] {
  if (!Number.isInteger(parts) || parts <= 0) {
    throw new Error("splitCents: `parts` deve ser um inteiro positivo");
  }

  const base = Math.trunc(cents / parts);
  const remainder = cents - base * parts;

  return Array.from({ length: parts }, (_, index) =>
    index < Math.abs(remainder) ? base + Math.sign(remainder) : base,
  );
}

/**
 * Variação percentual entre dois períodos.
 * Retorna `null` quando a base é zero (variação indefinida, não infinita).
 */
export function percentageChange(previous: Cents, current: Cents): number | null {
  if (previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/** Percentual de `part` sobre `total`, limitado a 0–100. */
export function percentageOf(part: Cents, total: Cents): number {
  if (total <= 0) return 0;
  return clamp((part / total) * 100, 0, 100);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
