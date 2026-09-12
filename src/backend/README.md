# `src/backend` — servidor e regras de negócio

```
backend/
├── supabase/
│   ├── client.ts         client de browser (chave anônima, RLS ativo)
│   ├── server.ts         client de servidor — `server-only`
│   ├── admin.ts          service role, IGNORA RLS — `server-only`
│   └── proxy-session.ts  renovação de sessão na borda
├── auth/
│   ├── session.ts        leitura de sessão via getUser() — `server-only`
│   ├── guards.ts         requireUser() para Server Components
│   └── errors.ts         tradução de erro sem vazar detalhe interno
├── ai/
│   ├── provider.ts       interface FinancialAIProvider
│   ├── tools.ts          catálogo somente-leitura do agente
│   └── registry.ts       resolve o provedor — `server-only`
├── domain/               ← regra de negócio pura
│   ├── money.ts          aritmética em centavos
│   ├── dates.ts          aritmética de datas de competência
│   └── calculations/     resumo mensal, metas, orçamento
└── validation/
    ├── primitives.ts     blocos reutilizáveis de schema
    ├── parse-money.ts    "1.234,56" → 123456
    └── schemas/          contratos de auth, lançamento, meta, tarefa
```

## `domain/` é público; o resto, não

`domain/` e `validation/` são funções puras: sem I/O, sem segredo, sem React. O
frontend **deve** importá-los — a regra tem que ser a mesma no formulário e no
servidor.

Os demais módulos são de servidor. `supabase/server.ts`, `supabase/admin.ts`,
`auth/*` e `ai/registry.ts` importam `server-only`, e o ESLint bloqueia os mais
perigosos em `src/frontend/**`.

## Regras

- **Backend não importa do frontend.** Bloqueado no ESLint. Se um valor serve aos
  dois, ele pertence a `@/shared`.
- **Toda entrada é validada** com o schema de `validation/schemas/` — o mesmo que
  o formulário usa.
- **Erro devolvido é genérico**: sem stack trace, sem detalhe interno.
- **Nada aqui é a fronteira de autorização.** Quem autoriza acesso a dado é o
  Postgres, via RLS. Ver `docs/security/security-model.md`.
- **A IA não executa SQL** e, nesta versão, não altera nada.

## O que fica fora

`supabase/` na raiz do projeto guarda migrations, RLS e Edge Functions — é o
projeto do Supabase CLI, que exige aquele nome e aquela posição. Esta pasta aqui
guarda apenas os **clients** que falam com ele.
