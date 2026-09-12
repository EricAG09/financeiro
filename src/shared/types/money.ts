/**
 * Dinheiro é sempre representado em CENTAVOS (inteiro) dentro do domínio.
 *
 * Motivo: ponto flutuante não é seguro para cálculo financeiro
 * (0.1 + 0.2 !== 0.3). Conversão para exibição acontece apenas na borda de UI,
 * em `lib/format/currency.ts`.
 */
export type Cents = number;

export type CurrencyCode = "BRL";
