import "server-only";

import { serverEnv } from "@/config/env";
import {
  AIProviderNotConfiguredError,
  type FinancialAIProvider,
} from "@/lib/ai/provider";

/**
 * Resolução do provedor de IA.
 *
 * Na Etapa 1 nenhum provedor está implementado — a função existe para que o
 * restante do sistema já dependa da abstração, e não de um fornecedor.
 */

type ProviderFactory = () => FinancialAIProvider;

const providers = new Map<string, ProviderFactory>();

export function registerAIProvider(id: string, factory: ProviderFactory): void {
  providers.set(id, factory);
}

export function resolveAIProvider(): FinancialAIProvider {
  const providerId = serverEnv().AI_PROVIDER;

  if (!providerId) throw new AIProviderNotConfiguredError();

  const factory = providers.get(providerId);

  if (!factory) throw new AIProviderNotConfiguredError();

  return factory();
}

export function isAIConfigured(): boolean {
  const { AI_PROVIDER, AI_API_KEY } = serverEnv();
  return Boolean(AI_PROVIDER && AI_API_KEY && providers.has(AI_PROVIDER));
}
