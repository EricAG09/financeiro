/**
 * Aritmética de datas de competência — domínio, não apresentação.
 *
 * Datas de competência são `YYYY-MM-DD` sem fuso, para que um lançamento do dia
 * 31 não troque de mês conforme o timezone do dispositivo. Toda leitura usa
 * meio-dia UTC como âncora, o que mantém o resultado estável em qualquer offset.
 *
 * A formatação para exibição fica em `@/frontend/lib/format/date`.
 */

/** Converte `YYYY-MM-DD` em `Date`, ancorado ao meio-dia UTC. */
export function parseIsoDate(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00Z`);
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
