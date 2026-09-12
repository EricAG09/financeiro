import { describe, expect, it } from "vitest";
import {
  multiplyCents,
  percentageChange,
  percentageOf,
  splitCents,
  sumCents,
  toCents,
} from "@/lib/finance/money";
import { parseCurrencyToCents } from "@/lib/validation/parse-money";

describe("aritmética em centavos", () => {
  it("não acumula erro de ponto flutuante", () => {
    expect(sumCents([toCents(0.1), toCents(0.2)])).toBe(30);
  });

  it("arredonda a multiplicação para centavo inteiro", () => {
    expect(multiplyCents(1000, 0.075)).toBe(75);
    expect(multiplyCents(333, 1 / 3)).toBe(111);
  });

  it("distribui os centavos restantes ao dividir", () => {
    const parts = splitCents(1000, 3);
    expect(parts).toEqual([334, 333, 333]);
    expect(sumCents(parts)).toBe(1000);
  });

  it("rejeita divisão inválida", () => {
    expect(() => splitCents(100, 0)).toThrow();
  });

  it("trata base zero como variação indefinida", () => {
    expect(percentageChange(0, 5000)).toBeNull();
  });

  it("calcula a variação mês a mês", () => {
    // R$ 1.900 -> R$ 2.400
    expect(percentageChange(190_000, 240_000)).toBeCloseTo(26.3, 1);
  });

  it("limita o percentual a 100", () => {
    expect(percentageOf(15_000, 10_000)).toBe(100);
    expect(percentageOf(5_000, 0)).toBe(0);
  });
});

describe("parseCurrencyToCents", () => {
  it("aceita os formatos usados no Brasil", () => {
    expect(parseCurrencyToCents("1.234,56")).toBe(123_456);
    expect(parseCurrencyToCents("1234,56")).toBe(123_456);
    expect(parseCurrencyToCents("1234.56")).toBe(123_456);
    expect(parseCurrencyToCents("1234")).toBe(123_400);
    expect(parseCurrencyToCents("R$ 350")).toBe(35_000);
  });

  it("interpreta ponto como separador de milhar quando não é decimal", () => {
    expect(parseCurrencyToCents("1.234")).toBe(123_400);
  });

  it("rejeita entradas inválidas", () => {
    expect(parseCurrencyToCents("")).toBeNull();
    expect(parseCurrencyToCents("abc")).toBeNull();
    expect(parseCurrencyToCents("10,999")).toBeNull();
  });
});
