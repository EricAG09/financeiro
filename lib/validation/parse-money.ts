/**
 * Conversão de entrada do usuário (string) para centavos.
 *
 * Aceita os formatos comuns em pt-BR: "1.234,56", "1234,56", "1234.56", "1234".
 * Retorna `null` quando a entrada não é um valor monetário válido —
 * o chamador decide como reportar o erro.
 */
export function parseCurrencyToCents(input: string): number | null {
  const normalized = input.trim().replace(/\s/g, "").replace(/^R\$/i, "");

  if (normalized.length === 0) return null;
  if (!/^-?[\d.,]+$/.test(normalized)) return null;

  const hasComma = normalized.includes(",");
  const hasDot = normalized.includes(".");

  let decimalSeparator: "," | "." | null = null;

  if (hasComma && hasDot) {
    decimalSeparator =
      normalized.lastIndexOf(",") > normalized.lastIndexOf(".") ? "," : ".";
  } else if (hasComma) {
    decimalSeparator = ",";
  } else if (hasDot) {
    // Um único ponto com 1–2 casas é decimal; caso contrário é separador de milhar.
    const [, fraction] = normalized.split(".");
    const isSingleDot = normalized.indexOf(".") === normalized.lastIndexOf(".");
    decimalSeparator =
      isSingleDot && fraction !== undefined && fraction.length <= 2 ? "." : null;
  }

  let integerPart = normalized;
  let fractionPart = "";

  if (decimalSeparator !== null) {
    const index = normalized.lastIndexOf(decimalSeparator);
    integerPart = normalized.slice(0, index);
    fractionPart = normalized.slice(index + 1);
    if (fractionPart.length > 2) return null;
  }

  const digitsOnlyInteger = integerPart.replace(/[.,]/g, "");
  const sign = digitsOnlyInteger.startsWith("-") ? -1 : 1;
  const unsignedInteger = digitsOnlyInteger.replace("-", "");

  if (unsignedInteger.length === 0 && fractionPart.length === 0) return null;
  if (!/^\d*$/.test(unsignedInteger) || !/^\d*$/.test(fractionPart)) return null;

  const cents =
    Number(unsignedInteger || "0") * 100 + Number(fractionPart.padEnd(2, "0") || "0");

  if (!Number.isSafeInteger(cents)) return null;

  return sign * cents;
}
