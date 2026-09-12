import { describe, expect, it } from "vitest";
import { aiToolNames, aiTools } from "@/backend/ai/tools";

/**
 * Testes de segurança do agente.
 *
 * Estes testes travam a regra mais importante da arquitetura de IA: na Etapa 1
 * o agente é SOMENTE LEITURA. Se alguém adicionar uma ferramenta que escreve,
 * a suíte quebra antes de chegar em produção.
 */
describe("catálogo de ferramentas do agente", () => {
  it("não expõe nenhuma ferramenta que altere dados", () => {
    for (const name of aiToolNames) {
      expect(aiTools[name].mutates, `${name} não pode mutar dados`).toBe(false);
    }
  });

  it("declara um schema de entrada para toda ferramenta", () => {
    for (const name of aiToolNames) {
      expect(aiTools[name].input).toBeDefined();
    }
  });

  it("rejeita mês de referência fora do formato esperado", () => {
    const parsed = aiTools.get_monthly_expenses.input.safeParse({
      referenceMonth: "junho/2026",
    });

    expect(parsed.success).toBe(false);
  });

  it("rejeita simulação de compra com valor não inteiro", () => {
    const parsed = aiTools.simulate_purchase.input.safeParse({
      amount: 35_000.5,
      referenceMonth: "2026-06-01",
    });

    expect(parsed.success).toBe(false);
  });
});
