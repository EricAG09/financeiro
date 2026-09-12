# `app/(backend)` — superfície HTTP do servidor

Route handlers, callbacks e webhooks. Nada aqui renderiza interface. Os
parênteses mantêm a pasta fora da URL: `(backend)/api/health/route.ts` responde
em `/api/health`.

```
(backend)/
└── api/
    └── health/route.ts    →  GET /api/health
```

## O que entra aqui

- **Route handlers** que o browser chama (`/api/*`).
- **Callbacks de autenticação** do Supabase (`/auth/callback`, `/auth/sair`) —
  Etapa 2.
- **Endpoint do assistente**, que executa as ferramentas somente-leitura de
  `src/backend/ai/tools.ts` — Etapa 6.
- **Webhooks**, se algum dia houver.

## O que NÃO entra aqui

O "backend" deste sistema não é só esta pasta. A maior parte dele vive fora:

| Onde                               | O quê                                 |
| ---------------------------------- | ------------------------------------- |
| `src/backend/supabase/`            | Clients de browser, servidor e admin  |
| `src/backend/auth/`                | Sessão, guards, tradução de erros     |
| `src/backend/domain/calculations/` | Regra financeira pura                 |
| `src/proxy.ts`                     | Renovação de sessão e CSP na borda    |
| `supabase/`                        | Migrations, RLS, Edge Functions       |
| Postgres                           | **A autorização de verdade**, via RLS |

Esta pasta é só a porta de entrada HTTP. A lógica fica nos módulos acima, para
poder ser testada sem subir um servidor.

## Regras

- Toda entrada é validada com o schema de `src/backend/validation/schemas/`, o mesmo usado no cliente.
- Resposta de erro é genérica: sem stack trace, sem detalhe interno.
- Segredo (`SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`) só pode ser lido aqui ou em
  Edge Function — nunca em componente.
- Um handler nunca é a única barreira de acesso a dado: a RLS continua valendo.
