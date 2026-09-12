-- =============================================================================
-- Finance AI — migration inicial (RASCUNHO)
-- =============================================================================
-- STATUS: NÃO APLICADA. Nenhum projeto Supabase foi provisionado ainda.
--
-- Este arquivo é o ponto de partida da modelagem e deve ser REVISADO antes de
-- rodar (ver supabase/migrations/README.md e docs/database/schema.md).
--
-- Princípios aplicados aqui:
--   1. Dinheiro em BIGINT de CENTAVOS. Nunca float, nunca double precision.
--   2. Toda tabela de usuário tem `user_id` e RLS habilitado nesta mesma
--      migration — nunca "depois".
--   3. Policies usam `(select auth.uid())`: o Postgres avalia uma vez por
--      query em vez de uma vez por linha.
--   4. `revoke`/`grant` explícitos: a role `anon` não toca nada.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensões
-- -----------------------------------------------------------------------------
create extension if not exists "pgcrypto" with schema extensions;

-- -----------------------------------------------------------------------------
-- Tipos
-- -----------------------------------------------------------------------------
create type public.transaction_kind as enum ('income', 'expense');

create type public.account_kind as enum (
  'checking',
  'savings',
  'cash',
  'wallet',
  'credit_card'
);

-- -----------------------------------------------------------------------------
-- Gatilho de `updated_at`
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- profiles — dados do usuário fora de auth.users
-- =============================================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) between 1 and 80),
  locale text not null default 'pt-BR',
  currency text not null default 'BRL',
  time_zone text not null default 'America/Fortaleza',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Perfil do usuário. O `id` é o próprio auth.users.id — não existe outro dono possível.';

-- Cria o perfil no momento do cadastro, sem depender do cliente.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- accounts — contas e carteiras
-- =============================================================================
create table public.accounts (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  kind public.account_kind not null default 'checking',
  -- Saldo inicial; o saldo corrente é derivado de `transactions`.
  opening_balance_cents bigint not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index accounts_user_id_idx on public.accounts (user_id) where archived = false;

-- =============================================================================
-- transaction_categories — catálogo por usuário
-- =============================================================================
create table public.transaction_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9-]{1,40}$'),
  label text not null check (char_length(label) between 1 and 60),
  kind public.transaction_kind not null,
  icon text not null default 'Ellipsis',
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);

-- =============================================================================
-- transactions — lançamentos
-- =============================================================================
create table public.transactions (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  account_id uuid not null references public.accounts (id) on delete restrict,
  category_id uuid references public.transaction_categories (id) on delete set null,
  kind public.transaction_kind not null,
  -- Sempre positivo: o sinal é dado por `kind`, não pelo valor.
  amount_cents bigint not null check (amount_cents > 0),
  description text not null check (char_length(description) between 1 and 120),
  occurred_on date not null,
  notes text check (char_length(notes) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index transactions_user_occurred_idx
  on public.transactions (user_id, occurred_on desc);

create index transactions_user_category_idx
  on public.transactions (user_id, category_id);

-- A conta e a categoria precisam pertencer ao mesmo dono do lançamento.
-- Sem isso, um usuário poderia referenciar a conta de outro.
create or replace function public.assert_transaction_ownership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.accounts a
    where a.id = new.account_id and a.user_id = new.user_id
  ) then
    raise exception 'conta não pertence ao usuário';
  end if;

  if new.category_id is not null and not exists (
    select 1 from public.transaction_categories c
    where c.id = new.category_id and c.user_id = new.user_id
  ) then
    raise exception 'categoria não pertence ao usuário';
  end if;

  return new;
end;
$$;

create trigger transactions_ownership_check
  before insert or update on public.transactions
  for each row execute function public.assert_transaction_ownership();

-- =============================================================================
-- audit_logs — trilha de operações sensíveis
-- =============================================================================
create table public.audit_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_user_created_idx on public.audit_logs (user_id, created_at desc);

comment on table public.audit_logs is
  'Append-only. O usuário lê a própria trilha; ninguém altera ou apaga pela API.';

-- =============================================================================
-- Triggers de updated_at
-- =============================================================================
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger accounts_updated_at before update on public.accounts
  for each row execute function public.set_updated_at();

create trigger transactions_updated_at before update on public.transactions
  for each row execute function public.set_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------
-- Habilitado em TODAS as tabelas. Sem policy, nada passa.
-- =============================================================================
alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.transaction_categories enable row level security;
alter table public.transactions enable row level security;
alter table public.audit_logs enable row level security;

-- A role anônima não tem nenhum acesso a dado de usuário.
revoke all on public.profiles from anon;
revoke all on public.accounts from anon;
revoke all on public.transaction_categories from anon;
revoke all on public.transactions from anon;
revoke all on public.audit_logs from anon;

-- profiles ---------------------------------------------------------------
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- O insert é feito pelo trigger `handle_new_user`; não há policy de insert.
-- O delete acontece via cascade de auth.users.

-- accounts ---------------------------------------------------------------
create policy "accounts_select_own" on public.accounts
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "accounts_insert_own" on public.accounts
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "accounts_update_own" on public.accounts
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "accounts_delete_own" on public.accounts
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- transaction_categories -------------------------------------------------
create policy "categories_select_own" on public.transaction_categories
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "categories_insert_own" on public.transaction_categories
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "categories_update_own" on public.transaction_categories
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "categories_delete_own" on public.transaction_categories
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- transactions -----------------------------------------------------------
create policy "transactions_select_own" on public.transactions
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "transactions_insert_own" on public.transactions
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "transactions_update_own" on public.transactions
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "transactions_delete_own" on public.transactions
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- audit_logs -------------------------------------------------------------
-- Leitura da própria trilha. Escrita só pelo servidor (service role),
-- que ignora RLS: não existe policy de insert, update ou delete.
create policy "audit_logs_select_own" on public.audit_logs
  for select to authenticated
  using ((select auth.uid()) = user_id);
