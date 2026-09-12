import { parseIsoDate } from "@/backend/domain/dates";
import { siteConfig } from "@/shared/config/site";

/**
 * Formatação de datas para exibição.
 *
 * Só converte em texto. Contas com data (diferença de meses, mês de referência)
 * são domínio e vivem em `@/backend/domain/dates`.
 */

const dayMonthFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});

const monthYearFormatter = new Intl.DateTimeFormat(siteConfig.locale, {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDayMonth(isoDate: string): string {
  return dayMonthFormatter.format(parseIsoDate(isoDate));
}

export function formatMonthYear(isoDate: string): string {
  return monthYearFormatter.format(parseIsoDate(isoDate));
}
