# Arquitetura do agente financeiro

> Nada da IA está implementado. O que existe na Etapa 1 é o contrato:
> `lib/ai/provider.ts`, `lib/ai/tools.ts`, `lib/ai/registry.ts` e os testes em
> `tests/unit/ai-tools.test.ts`.

## Regra que não se negocia

**O modelo nunca executa SQL.** Não recebe conexão, não recebe query, não recebe
nome de tabela. Ele pode apenas pedir uma das ferramentas declaradas em
`lib/ai/tools.ts`, e o servidor decide se atende.

Na primeira versão o agente é **somente leitura**. Toda ferramenta carrega
`mutates: false`, e um teste falha se alguém mudar isso.

O agente não pode, em hipótese alguma:

```
transferir dinheiro · pagar contas · excluir transações
alterar saldo · executar SQL · alterar configurações da conta
```

## Ferramentas

| Ferramenta                      | Entrada                                      | Devolve                           |
| ------------------------------- | -------------------------------------------- | --------------------------------- |
| `get_current_balance`           | —                                            | Saldo somado das contas ativas    |
| `get_monthly_income`            | `referenceMonth`                             | Receitas do mês                   |
| `get_monthly_expenses`          | `referenceMonth`                             | Despesas do mês                   |
| `get_expenses_by_category`      | `referenceMonth`                             | Despesas agrupadas, maior → menor |
| `get_previous_month_comparison` | `referenceMonth`                             | Variação contra o mês anterior    |
| `get_upcoming_bills`            | `daysAhead` (1–90)                           | Contas e recorrências a vencer    |
| `get_financial_goals`           | —                                            | Metas com progresso calculado     |
| `get_budget_status`             | `referenceMonth`                             | Situação dos orçamentos           |
| `simulate_purchase`             | `amount`, `referenceMonth`, `plannedSavings` | Impacto simulado; não grava nada  |

Toda entrada passa por schema Zod antes de tocar o banco. Toda execução roda no
servidor, sob a sessão do usuário, com RLS ativo — mesmo que uma ferramenta
tivesse bug, o Postgres continuaria limitando o alcance ao dono dos dados.

## Quem faz a conta

```
Postgres (RLS)
      ↓
lib/calculations/*        ← a matemática acontece aqui, testada
      ↓
resultado estruturado
      ↓
modelo de IA              ← recebe números prontos
      ↓
explicação em linguagem natural
```

O sistema calcula:

```
Gasto mensal:   R$ 2.400
Mês anterior:   R$ 1.900
Diferença:      +26,3%
```

O modelo escreve:

> "Seus gastos aumentaram cerca de 26% em relação ao mês anterior, puxados
> principalmente por alimentação."

Se o modelo fizesse a conta, um erro de aritmética viraria uma decisão financeira
errada, sem aviso. Modelo de linguagem não é calculadora — e aqui não precisa ser.

## Contexto enviado ao modelo

Somente agregados, no formato de `FinancialContext` (`types/ai.ts`): mês de
referência, moeda, saldo, receitas, despesas e totais por categoria.

Nunca vão para o modelo:

- a base bruta de lançamentos;
- identificadores internos (`user_id`, `account_id`, ids de linha);
- e-mail, nome ou qualquer dado de identificação;
- nada de outro usuário.

## Abstração de provedor

```ts
interface FinancialAIProvider {
  chat(input: FinancialAIInput): Promise<FinancialAIResponse>;
}
```

`lib/ai/registry.ts` resolve o provedor a partir de `AI_PROVIDER`. Nenhum
fornecedor está registrado hoje — `resolveAIProvider()` lança
`AIProviderNotConfiguredError`, de propósito. Trocar de provedor (ou rodar um
modelo local) é implementar a interface e registrar.

A chave da API vive só no servidor ou em uma Edge Function. Nunca no browser,
nunca em variável `NEXT_PUBLIC_`.

## Quando houver operação que altera dados

Fluxo obrigatório, sem atalho:

```
recomendação da IA
      ↓
confirmação explícita do usuário   (ação humana, com o valor à vista)
      ↓
validação no servidor              (mesmo schema de sempre)
      ↓
operação
      ↓
registro em audit_logs
```

A confirmação é do usuário sobre a operação concreta — nunca uma autorização
geral para "a IA agir em meu nome".

## Limites operacionais

- `ai_usage` registra tokens e custo por usuário, com teto configurável.
- Rate limiting no endpoint do assistente (pendente, ver
  [`docs/security/security-model.md`](../security/security-model.md)).
- O histórico enviado ao modelo é truncado pelo chamador, não pelo provedor.
- A resposta é renderizada como **texto puro**. Saída de LLM é entrada não
  confiável: nada de HTML, nada de `dangerouslySetInnerHTML`.
