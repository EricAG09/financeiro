# Migrations

## Estado atual

Nenhuma migration foi aplicada. O projeto Supabase ainda não existe e as
credenciais não foram fornecidas.

`20260912000000_core_schema.sql` é um **rascunho revisável**, não um arquivo
pronto para produção. Ele cobre apenas o núcleo (`profiles`, `accounts`,
`transaction_categories`, `transactions`, `audit_logs`) — os demais domínios
estão descritos em [`docs/database/schema.md`](../../docs/database/schema.md) e
entram em migrations próprias, quando cada área for implementada.

## Antes de aplicar

1. Revisar a modelagem com calma (nomes, tipos, cascatas, índices).
2. Criar o projeto no Supabase e preencher `.env.local`.
3. `npx supabase link --project-ref <ref>`
4. `npx supabase db push`
5. `npm run db:types` para regenerar `types/database.ts`.
6. Rodar os testes de RLS (`tests/integration/`) antes de considerar pronto.

## Regras

- RLS é habilitado na mesma migration que cria a tabela. Nunca em uma migration
  posterior — entre uma e outra a tabela fica aberta.
- Toda tabela de usuário carrega `user_id` com `references auth.users (id) on
delete cascade`.
- Dinheiro é `bigint` em centavos. Nunca `float`, `real` ou `double precision`.
- Migrations são imutáveis depois de aplicadas: corrija com uma nova migration.
