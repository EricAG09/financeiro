import { siteConfig } from "@/config/site";

/**
 * Datas de competência são armazenadas como `YYYY-MM-DD` (sem fuso), para que
 * um lançamento do dia 31 não mude de mês conforme o timezone do dispositivo.
 */

function parseIsoDate(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00Z`);
}

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

/** Mês de referência (`YYYY-MM-01`) a partir de uma data ou de "hoje". */
export function toReferenceMonth(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

/** Diferença em meses completos entre duas datas `YYYY-MM-DD`. */
export function monthsBetween(fromIsoDate: string, toIsoDate: string): number {
  const from = parseIsoDate(fromIsoDate);
  const to = parseIsoDate(toIsoDate);

  const years = to.getUTCFullYear() - from.getUTCFullYear();
  const months = to.getUTCMonth() - from.getUTCMonth();
  const dayAdjustment = to.getUTCDate() < from.getUTCDate() ? -1 : 0;

  return years * 12 + months + dayAdjustment;
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}
