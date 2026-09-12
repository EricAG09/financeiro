import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MoneyDisplay } from "@/components/finance/money-display";

describe("MoneyDisplay", () => {
  it("formata centavos em real brasileiro", () => {
    render(<MoneyDisplay amount={240_000} />);

    expect(screen.getByText(/2\.400,00/)).toBeInTheDocument();
  });

  it("aplica o sinal correto para receita e despesa", () => {
    const { rerender } = render(<MoneyDisplay amount={5_000} showSign />);
    expect(screen.getByText(/^\+/)).toBeInTheDocument();

    rerender(<MoneyDisplay amount={-5_000} showSign />);
    expect(screen.getByText(/^−/)).toBeInTheDocument();
  });

  it("mantém o valor acessível quando está oculto na tela", () => {
    render(<MoneyDisplay amount={123_456} hidden />);

    // O texto visível é mascarado, mas leitores de tela continuam recebendo o valor.
    expect(screen.getByText("•••••")).toBeInTheDocument();
    expect(screen.getByText(/1\.234,56/)).toBeInTheDocument();
  });
});
