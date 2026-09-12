# Edge Functions

Vazio por enquanto.

Candidatas naturais, quando chegarem as etapas correspondentes:

| Função                   | Responsabilidade                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `ai-chat`                | Executar as ferramentas somente-leitura de `lib/ai/tools.ts` e chamar o provedor de IA com a chave que nunca chega ao browser. |
| `recurring-transactions` | Materializar despesas recorrentes no início de cada mês.                                                                       |
| `alerts`                 | Avaliar orçamentos, metas em risco e contas próximas do vencimento.                                                            |

Regras:

- a função roda no servidor e é o único lugar onde uma chave de provedor de IA
  pode existir;
- toda entrada é validada com o mesmo schema usado no cliente;
- operação sensível grava em `audit_logs`.
