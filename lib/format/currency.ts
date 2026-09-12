import { siteConfig } from "@/config/site";
import { toCurrencyNumber } from "@/lib/finance/money";
import type { Cents } from "@/types/money";

/**
 * Formatação para exibição. Única camada autorizada a converter centavos em
 * texto — componentes não devem montar strings de dinheiro manualmente.
 */

const currencyFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
});

const compactFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
  notation: "compact",
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "percent",
  maximumFractionDigits: 1,
});

export function formatCents(cents: Cents): string {
  return currencyFormatter.format(toCurrencyNumber(cents));
}

/** Versão compacta para cards apertados em telas pequenas: "R$ 2,4 mil". */
export function formatCentsCompact(cents: Cents): string {
  return compactFormatter.format(toCurrencyNumber(cents));
}

/** Recebe 0–100 e devolve "26,3%". */
export function formatPercentage(value: number): string {
  return percentFormatter.format(value / 100);
}

/** Prefixa explicitamente o sinal — usado em comparativos mês a mês. */
export function formatSignedPercentage(value: number): string {
  const formatted = formatPercentage(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}
