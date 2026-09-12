# Arquitetura — visão geral

## O que o sistema é

Finance AI é um app de finanças pessoais **mobile-first**, instalável como PWA,
com Supabase como backend e um assistente de IA somente-leitura sobre os dados do
próprio usuário.

Hoje o produto é de uso individual. A arquitetura, porém, nasce multiusuário: o
dono do dado é sempre um `user_id`, e a autorização vive no banco. Abrir para
outras pessoas é questão de convidar usuários, não de refatorar.

## Stack

| Camada        | Escolha                                            |
| ------------- | -------------------------------------------------- |
| Framework     | Next.js 16 (App Router, React 19, Turbopack)       |
| Linguagem     | TypeScript em modo estrito, sem `any`              |
| Estilo        | Tailwind CSS v4 + shadcn/ui (base Radix)           |
| Formulários   | React Hook Form + Zod                              |
| Dados remotos | TanStack Query                                     |
| Gráficos      | Recharts                                           |
| Backend       | Supabase (Postgres, Auth, Storage, Edge Functions) |
| Testes        | Vitest + Testing Library                           |

## Fluxo de uma leitura

```
src/app/(frontend)/…            Server Component
      ↓  createServerSupabaseClient()  (chave anônima + cookie de sessão)
Postgres com RLS ativo
      ↓  linhas do usuário, e apenas dele
src/backend/domain/calculations (funções puras, sem I/O)
      ↓  resultado estruturado
src/frontend/components/finance (apresentação)
```

Nenhum passo intermediário decide quem pode ver o quê. Isso é responsabilidade
exclusiva do Postgres.

## Camadas e o que cabe em cada uma

Todo o código vive em `src/`, em três camadas. A raiz do repositório guarda
apenas configuração.

| Camada          | Papel                                                      | Não pode                                          |
| --------------- | ---------------------------------------------------------- | ------------------------------------------------- |
| `src/app/`      | Roteamento: `(frontend)` para telas, `(backend)` para HTTP | Conter regra de negócio                           |
| `src/frontend/` | Componentes, hooks, formatação de exibição, estilos        | Acessar dados, fazer conta, tocar em segredo      |
| `src/backend/`  | Supabase, auth, IA, cálculo financeiro, validação          | Renderizar interface; importar de `src/frontend/` |
| `src/shared/`   | Tipos, constantes, configuração                            | Ter lógica; depender de frontend ou backend       |
| `src/proxy.ts`  | Renovação de sessão e CSP na borda                         | Ser tratado como fronteira de autorização         |

Dentro de cada camada:

| Diretório                                                        | Papel                                           | Não pode                                                  |
| ---------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| `frontend/components/ui/`                                        | Primitivas do Design System                     | Saber de domínio                                          |
| `frontend/components/finance/`, `goals/`, `tasks/`, `assistant/` | Componentes de domínio                          | Fazer I/O ou cálculo                                      |
| `frontend/lib/format/`                                           | Moeda e data em texto                           | Fazer conta                                               |
| `backend/domain/`                                                | Dinheiro, datas e cálculo financeiro            | Importar React ou Supabase                                |
| `backend/validation/`                                            | Schemas compartilhados cliente/servidor         | Divergir entre as duas pontas                             |
| `backend/supabase/`                                              | Clients (browser, servidor, admin)              | Ser importado por componente de cliente, no caso do admin |
| `backend/auth/`                                                  | Sessão e guards de rota                         | Ser tratado como fronteira de segurança                   |
| `backend/ai/`                                                    | Abstração do provedor e catálogo de ferramentas | Executar SQL                                              |

Regra prática: se faz conta com dinheiro, vai para `backend/domain/` e tem teste.
Se desenha, vai para `frontend/components/`.

## Decisões registradas

### `src/` dividido em `frontend`, `backend` e `shared`

A separação é por responsabilidade, e o ESLint a aplica — não fica só combinada:

```
frontend  ─────►  backend/domain      (regra pura, a mesma nos dois lados)
frontend  ─────►  shared
backend   ─────►  shared
shared    ─────►  (ninguém)
backend   ──✗──►  frontend
```

O frontend importar `backend/domain` é proposital: a regra financeira precisa ser
idêntica no formulário e no servidor. São funções puras, sem I/O e sem segredo. O
que carrega risco está bloqueado por regra de lint — `supabase/admin`,
`ai/registry` e `serverEnv()` — e por `import "server-only"`, que quebra o build
se um Client Component alcançá-los.

A seta proibida (`backend → frontend`) já pegou um erro real na primeira
execução: `calculations/goals.ts` importava aritmética de datas de dentro de
`src/frontend/lib/format/`. A conta foi para `backend/domain/dates.ts`; `frontend/lib/format/`
ficou só com `Intl`.

### `app/` separado em `(frontend)` e `(backend)`

No App Router, toda pasta dentro de `app/` vira segmento de URL — pastas
literais `frontend/` e `backend/` transformariam `/metas` em
`/frontend/metas`. Os parênteses marcam um _route group_: o Next usa a pasta
para organizar o diretório e a ignora ao montar a rota.

```
src/app/(frontend)/(app)/metas/page.tsx   →  /metas
src/app/(backend)/api/health/route.ts     →  /api/health
```

Uma ressalva que vale registrar: o backend deste sistema **não cabe** dentro de
`app/(backend)/`. Ali fica só a porta de entrada HTTP. A lógica de servidor vive
em `src/backend/`, em `src/proxy.ts` e nas migrations — e a autorização de
verdade é do Postgres. A pasta é fina de propósito: o que está em `src/backend/`
pode ser testado sem subir servidor.

### Dinheiro em centavos inteiros

Todo valor monetário é `number` inteiro de centavos, no código e no banco
(`bigint`). Ponto flutuante erra em somatório (`0.1 + 0.2 !== 0.3`) e o erro
aparece exatamente onde ninguém aceita erro. A conversão para texto acontece só
na borda de UI, em `src/frontend/lib/format/currency.ts`.

### Cálculo no sistema, narrativa na IA

Somas, percentuais e projeções são feitos por funções TypeScript testadas. O
modelo recebe o resultado pronto e escreve a explicação. Ver
[`docs/ai/agent-architecture.md`](../ai/agent-architecture.md).

### Service worker escrito à mão

Sem `next-pwa` ou `serwist`. Em um app financeiro a política de cache precisa ser
lida linha a linha e auditada; uma biblioteca genérica de cache favorece o
oposto. Ver [`docs/pwa/offline-strategy.md`](../pwa/offline-strategy.md).

### `src/proxy.ts` em vez de `middleware.ts`

O Next 16 renomeou a convenção. O arquivo faz duas coisas: renova a sessão do
Supabase e emite a CSP com nonce por requisição.

## Etapas

1. **Fundação** — concluída. Projeto, qualidade, Design System, PWA, arquitetura
   de auth/RLS/IA, documentação.
2. **Banco e autenticação** — revisar a modelagem, aplicar as migrations com RLS,
   telas de cadastro/login/recuperação, testes de RLS.
3. **Núcleo financeiro** — contas, lançamentos, categorias, dashboard com dados
   reais, recorrências.
4. **Metas, orçamentos e planejamento**.
5. **Tarefas e listas**, incluindo impacto financeiro.
6. **Assistente de IA** somente leitura, sobre as ferramentas já declaradas.
7. **Alertas e notificações**.

Nada além da etapa corrente é implementado por antecipação.
