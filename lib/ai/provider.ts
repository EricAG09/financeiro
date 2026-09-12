import type { AIMessage, FinancialContext } from "@/types/ai";

/**
 * Abstração do provedor de IA.
 *
 * O sistema nunca depende de um fornecedor específico. Implementações futuras
 * (OpenAI, Gemini, modelo local) devem satisfazer esta interface.
 * Ver docs/ai/agent-architecture.md.
 */

export interface FinancialAIInput {
  /** Pergunta atual do usuário. */
  readonly question: string;
  /** Histórico recente da conversa, já truncado pelo chamador. */
  readonly history: readonly AIMessage[];
  /** Agregados calculados pelo sistema. Nunca a base bruta do usuário. */
  readonly context: FinancialContext;
}

export interface FinancialAIResponse {
  readonly content: string;
  readonly usage?: {
    readonly inputTokens: number;
    readonly outputTokens: number;
  };
}

export interface FinancialAIProvider {
  readonly id: string;
  chat(input: FinancialAIInput): Promise<FinancialAIResponse>;
}

export class AIProviderNotConfiguredError extends Error {
  constructor() {
    super("Nenhum provedor de IA configurado.");
    this.name = "AIProviderNotConfiguredError";
  }
}
