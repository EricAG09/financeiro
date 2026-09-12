# Modelagem de dados

> Nenhuma migration foi aplicada. O rascunho do núcleo está em
> [`supabase/migrations/20260912000000_core_schema.sql`](../../supabase/migrations/20260912000000_core_schema.sql)
> e precisa ser revisado antes de rodar.

## Convenções

| Assunto              | Regra                                                                       |
| -------------------- | --------------------------------------------------------------------------- |
| Dono do dado         | `user_id uuid not null references auth.users(id) on delete cascade`         |
| Dinheiro             | `bigint` em centavos, sufixo `_cents`, sempre positivo                      |
| Sinal                | Vem de `kind` (`income` / `expense`), nunca de valor negativo               |
| Datas de competência | `date` (sem fuso), para o dia 31 não trocar de mês                          |
| Carimbos             | `timestamptz`, `created_at` e `updated_at`                                  |
| Chaves               | `uuid` com `gen_random_uuid()`, exceto `audit_logs` (identidade sequencial) |
| RLS                  | Habilitado na mesma migration que cria a tabela                             |

## Núcleo (rascunho pronto para revisão)

### `profiles`

Perfil do usuário. `id` **é** `auth.users.id` — não existe outro dono possível.
Criado por trigger no cadastro, não pelo cliente.

`id`, `display_name`, `locale`, `currency`, `time_zone`, `created_at`, `updated_at`

### `accounts`

Contas e carteiras. `opening_balance_cents` guarda o saldo inicial; o saldo
corrente é **derivado** dos lançamentos, nunca um campo mutável — campo de saldo
editável é a origem clássica de divergência.

`id`, `user_id`, `name`, `kind`, `opening_balance_cents`, `archived`

### `transaction_categories`

Catálogo por usuário, semeado a partir de `constants/categories.ts`.
Único por `(user_id, slug)`.

`id`, `user_id`, `slug`, `label`, `kind`, `icon`

### `transactions`

Lançamentos. `amount_cents > 0` por constraint; um trigger garante que a conta e
a categoria referenciadas pertencem ao mesmo usuário.

`id`, `user_id`, `account_id`, `category_id`, `kind`, `amount_cents`,
`description`, `occurred_on`, `notes`

Índices: `(user_id, occurred_on desc)` e `(user_id, category_id)`.

### `audit_logs`

Append-only. Leitura da própria trilha; escrita só pelo servidor.

`id`, `user_id`, `action`, `entity`, `entity_id`, `metadata jsonb`, `created_at`

## Domínios planejados

Entram em migrations próprias, cada um na sua etapa. Modelar cedo demais gera
tabela que ninguém usa e migration que ninguém entende.

| Tabela                            | Etapa | Notas de modelagem                                                                                             |
| --------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------- |
| `recurring_transactions`          | 3     | `frequency`, `day_of_month`, `active`. Materializa lançamentos por job.                                        |
| `budgets`                         | 4     | Único por `(user_id, category_id, reference_month)`.                                                           |
| `financial_goals`                 | 4     | `target_amount_cents`, `current_amount_cents`, `target_date`, `status`. Progresso é calculado, não armazenado. |
| `goal_contributions`              | 4     | Opcional: histórico de aportes, se o valor atual precisar ser auditável.                                       |
| `task_lists`                      | 5     | `kind` = `todo` \| `shopping`.                                                                                 |
| `tasks`                           | 5     | `estimated_amount_cents` opcional — é o elo com o planejamento.                                                |
| `shopping_list_items`             | 5     | Pode ser `tasks` com `list_id`; decidir na etapa, sem duplicar conceito.                                       |
| `notifications`                   | 7     | Com preferências por tipo de alerta.                                                                           |
| `ai_conversations`, `ai_messages` | 6     | Mensagens em texto puro; sem dado sensível além do necessário.                                                 |
| `ai_usage`                        | 6     | Tokens e custo por usuário, para limite de uso.                                                                |

## Consultas que a modelagem precisa servir bem

O desenho acima existe para responder rápido a:

- saldo disponível: saldo inicial das contas ativas + soma dos lançamentos;
- receitas e despesas de um mês: `(user_id, occurred_on)` cobre o filtro;
- despesas por categoria no mês: `(user_id, category_id)` cobre o agrupamento;
- comparativo com o mês anterior: mesma consulta, outro intervalo;
- contas a vencer: `recurring_transactions` ativas com `day_of_month` à frente.

Todas são feitas em SQL ou por funções puras de `lib/calculations/`, nunca pelo
modelo de IA.

## Pontos a decidir antes das migrations finais

1. Saldo de conta derivado a cada consulta, ou materializado em view/tabela com
   trigger? Começar derivado; medir antes de otimizar.
2. Categorias por usuário (atual) ou catálogo global compartilhado? Por usuário
   permite personalização, ao custo de duplicar o seed.
3. `shopping_list_items` como tabela própria ou `tasks` com `list_id`?
4. Transferência entre contas: par de lançamentos vinculados ou tipo próprio?
   Não está no escopo inicial, mas muda o enum `transaction_kind` se entrar.
