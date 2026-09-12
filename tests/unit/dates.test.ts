import { describe, expect, it } from "vitest";
import { monthsBetween, parseIsoDate, toReferenceMonth } from "@/backend/domain/dates";

describe("parseIsoDate", () => {
  it("ancora a data ao meio-dia UTC", () => {
    // Meio-dia evita que o dia mude em qualquer offset entre -12h e +12h.
    expect(parseIsoDate("2026-06-10").toISOString()).toBe("2026-06-10T12:00:00.000Z");
  });

  it("mantém o dia 31 no mês certo", () => {
    expect(parseIsoDate("2026-01-31").getUTCMonth()).toBe(0);
    expect(parseIsoDate("2026-01-31").getUTCDate()).toBe(31);
  });
});

describe("monthsBetween", () => {
  it("conta meses completos", () => {
    expect(monthsBetween("2026-01-10", "2026-07-10")).toBe(6);
  });

  it("não conta o mês quando o dia ainda não chegou", () => {
    expect(monthsBetween("2026-01-20", "2026-07-10")).toBe(5);
  });

  it("atravessa a virada de ano", () => {
    expect(monthsBetween("2025-11-05", "2026-02-05")).toBe(3);
  });

  it("devolve negativo quando a data final é anterior", () => {
    expect(monthsBetween("2026-07-10", "2026-01-10")).toBe(-6);
  });
});

describe("toReferenceMonth", () => {
  it("normaliza para o primeiro dia do mês", () => {
    expect(toReferenceMonth(new Date(2026, 5, 17))).toBe("2026-06-01");
  });

  it("preenche o mês com dois dígitos", () => {
    expect(toReferenceMonth(new Date(2026, 0, 3))).toBe("2026-01-01");
  });
});
