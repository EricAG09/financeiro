<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Finance AI — regras do projeto

Leia `docs/architecture/overview.md` antes de mexer em estrutura e
`docs/security/security-model.md` antes de mexer em qualquer coisa que toque dado
de usuário.

## Inegociáveis

1. **Dinheiro em centavos inteiros** (`number` no código, `bigint` no banco).
   Nunca ponto flutuante. Formatação só em `lib/format/currency.ts`, exibição só
   via `MoneyDisplay`.
2. **RLS na mesma migration que cria a tabela.** Nunca "depois".
3. **Sem `any`.** Sem `eslint-disable` para calar um erro. Sem afrouxar o
   TypeScript para o build passar.
4. **Segredo nunca chega ao browser.** `SUPABASE_SERVICE_ROLE_KEY` e chave de IA
   são server-only, e o ESLint bloqueia o import em `components/**` e `hooks/**`.
5. **Nada de dado financeiro fictício** em código, seed ou tela.
6. **A IA não executa SQL** e, nesta versão, não altera nada.
7. **Sem cache de dado financeiro** no service worker.

## Convenções

- Regra financeira vive em `lib/calculations/`, é pura e tem teste.
- Componente não faz I/O nem conta.
- Schema de validação em `schemas/`, usado no cliente **e** no servidor.
- Nenhum hexadecimal em componente: use token de `app/globals.css`.
- Mobile-first: projete a tela de 360px primeiro; o desktop acrescenta.
- Toda lista tem estado vazio, de carregamento e de erro.
- `getUser()`, nunca `getSession()`, para qualquer decisão.

## Antes de terminar

```bash
npm run verify   # typecheck + lint + test
npm run build
```
