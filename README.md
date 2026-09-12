# Finance AI

Controle financeiro pessoal **mobile-first**, instalável como PWA, com Supabase
no backend e um assistente de IA somente-leitura sobre os próprios dados.

> **Etapa 1 — fundação concluída.** O projeto roda, compila, passa em lint,
> typecheck e testes. Ainda **não** há funcionalidade financeira: sem credenciais
> do Supabase não existe de onde ler, e dado fictício em tela de dinheiro não
> entra neste repositório.

## Começar

```bash
npm install
cp .env.example .env.local     # preencha quando tiver o projeto Supabase
npm run dev                    # http://localhost:3000
```

O app sobe sem Supabase configurado — o cartão "Fundação" na tela inicial mostra
o que está de pé e o que falta.

## Scripts

| Comando                  | O que faz                                    |
| ------------------------ | -------------------------------------------- |
| `npm run dev`            | Servidor de desenvolvimento                  |
| `npm run build`          | Build de produção                            |
| `npm run start`          | Serve o build (necessário para testar o PWA) |
| `npm run lint`           | ESLint                                       |
| `npm run lint:fix`       | ESLint com correção automática               |
| `npm run typecheck`      | `tsc --noEmit`                               |
| `npm run format`         | Prettier                                     |
| `npm run test`           | Vitest                                       |
| `npm run test:coverage`  | Cobertura do núcleo financeiro               |
| `npm run verify`         | `typecheck` + `lint` + `test`                |
| `npm run generate:icons` | Regenera os ícones do PWA                    |

Ganchos de git: `pre-commit` roda lint-staged; `pre-push` roda typecheck e testes.

## Variáveis de ambiente

Modelo completo em [`.env.example`](.env.example). Nenhum valor real está
versionado.

| Variável                                | Obrigatória                          | Exposta ao browser      |
| --------------------------------------- | ------------------------------------ | ----------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`              | a partir da Etapa 2                  | sim                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`         | a partir da Etapa 2                  | sim (protegida por RLS) |
| `NEXT_PUBLIC_APP_URL`                   | não (padrão `http://localhost:3000`) | sim                     |
| `SUPABASE_SERVICE_ROLE_KEY`             | só para rotina administrativa        | **nunca**               |
| `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL` | só na etapa do assistente            | **nunca**               |

A service role key ignora RLS. Jamais prefixe com `NEXT_PUBLIC_`.

## Estrutura

Todo o código fica em `src/`, dividido em três camadas. A raiz guarda só
configuração.

```
src/
├── app/                    roteamento (exigência do Next.js)
│   ├── (frontend)/         telas
│   │   ├── (app)/          área autenticada, com AppShell
│   │   └── offline/        página servida pelo service worker
│   ├── (backend)/api/      route handlers
│   └── layout.tsx · error · loading · not-found · manifest · ícones
│
├── frontend/               ← o que desenha
│   ├── components/{ui,layout,finance,goals,tasks,assistant,charts,theme,providers,pwa}
│   ├── hooks/              conectividade, media query, instalação do PWA
│   ├── lib/                `cn` e formatação de moeda/data em pt-BR
│   └── styles/globals.css  tokens do Design System
│
├── backend/                ← servidor e regra de negócio
│   ├── supabase/           clients: browser, servidor, admin, sessão de borda
│   ├── auth/               sessão, guards, tradução de erros
│   ├── ai/                 provider, catálogo de ferramentas, registry
│   ├── domain/             dinheiro, datas, cálculos — puro e testado
│   └── validation/         primitivas, parse de moeda, schemas Zod
│
├── shared/                 ← vocabulário comum, sem lógica
│   ├── types/              tipos de domínio e do banco
│   ├── constants/          rotas e catálogo de categorias
│   └── config/             validação de env e metadados do produto
│
└── proxy.ts                borda: renova a sessão e emite a CSP

public/     estáticos e service worker
supabase/   migrations (rascunho), seed, edge functions
docs/       arquitetura, segurança, banco, IA, design system, PWA
tests/      unitários, componentes, integração (RLS)
scripts/    geração de ícones
```

Dentro de `app/`, os parênteses são _route groups_: organizam o diretório sem
entrar na URL. `(frontend)/(app)/metas/page.tsx` responde em `/metas`.

Cada camada tem um `README.md` com a sua regra —
[`src/README.md`](src/README.md) explica quem pode importar quem.

## Fundamentos

**Mobile-first.** Barra de navegação inferior, alvos de toque de 44px, coluna
única. O desktop é evolução do mobile, não o contrário.

**Dinheiro em centavos inteiros.** Sempre, no código e no banco. `MoneyDisplay` é
o único componente que renderiza valor monetário.

**Autorização é do banco.** RLS no Postgres, habilitada na mesma migration que
cria a tabela. O frontend protege experiência, não dados.

**A IA explica; o sistema calcula.** O modelo nunca executa SQL e, nesta versão,
nunca altera nada.

**Cache não guarda dinheiro.** O service worker cacheia shell e estáticos.
Nenhuma resposta com dado financeiro é gravada no dispositivo.

## Documentação

| Documento                                                              | Assunto                                       |
| ---------------------------------------------------------------------- | --------------------------------------------- |
| [`docs/architecture/overview.md`](docs/architecture/overview.md)       | Camadas, fluxo de dados, decisões, etapas     |
| [`docs/security/security-model.md`](docs/security/security-model.md)   | RLS, sessão, segredos, CSP, o que ainda falta |
| [`docs/database/schema.md`](docs/database/schema.md)                   | Modelagem e o que ainda precisa ser decidido  |
| [`docs/ai/agent-architecture.md`](docs/ai/agent-architecture.md)       | Ferramentas, limites e fluxo do agente        |
| [`docs/design-system/principles.md`](docs/design-system/principles.md) | Tokens, componentes, acessibilidade           |
| [`docs/pwa/offline-strategy.md`](docs/pwa/offline-strategy.md)         | Cache, instalação, iOS                        |

## Próxima etapa

Banco e autenticação: revisar a modelagem, aplicar as migrations com RLS,
construir cadastro/login/recuperação e escrever os testes de RLS. Depende das
credenciais do Supabase.
