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
Server Component
      ↓  createServerSupabaseClient()  (chave anônima + cookie de sessão)
Postgres com RLS ativo
      ↓  linhas do usuário, e apenas dele
lib/calculations/*                     (funções puras, sem I/O)
      ↓  resultado estruturado
components/finance/*                   (apresentação)
```

Nenhum passo intermediário decide quem pode ver o quê. Isso é responsabilidade
exclusiva do Postgres.

## Camadas e o que cabe em cada uma

| Diretório                                               | Papel                                                  | Não pode                                                  |
| ------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| `app/`                                                  | Rotas, layouts, estados de carregamento e erro         | Conter regra financeira                                   |
| `components/ui/`                                        | Primitivas do Design System                            | Saber de domínio                                          |
| `components/finance/`, `goals/`, `tasks/`, `assistant/` | Componentes de domínio                                 | Fazer I/O ou cálculo                                      |
| `lib/calculations/`                                     | Regra financeira pura e testável                       | Importar React ou Supabase                                |
| `lib/finance/`, `lib/format/`                           | Aritmética em centavos e formatação                    | Importar React                                            |
| `lib/supabase/`                                         | Clients (browser, servidor, admin)                     | Ser importado por componente de cliente, no caso do admin |
| `lib/auth/`                                             | Sessão e guards de rota                                | Ser tratado como fronteira de segurança                   |
| `lib/ai/`                                               | Abstração do provedor e catálogo de ferramentas        | Executar SQL                                              |
| `schemas/`                                              | Contratos de validação compartilhados cliente/servidor | Divergir entre as duas pontas                             |
| `types/`                                                | Tipos de domínio                                       | Conter lógica                                             |

Regra prática: se uma função faz conta com dinheiro, ela mora em
`lib/calculations/` ou `lib/finance/` e tem teste. Se ela desenha algo, mora em
`components/`.

## Decisões registradas

### Dinheiro em centavos inteiros

Todo valor monetário é `number` inteiro de centavos, no código e no banco
(`bigint`). Ponto flutuante erra em somatório (`0.1 + 0.2 !== 0.3`) e o erro
aparece exatamente onde ninguém aceita erro. A conversão para texto acontece só
na borda de UI, em `lib/format/currency.ts`.

### Cálculo no sistema, narrativa na IA

Somas, percentuais e projeções são feitos por funções TypeScript testadas. O
modelo recebe o resultado pronto e escreve a explicação. Ver
[`docs/ai/agent-architecture.md`](../ai/agent-architecture.md).

### Service worker escrito à mão

Sem `next-pwa` ou `serwist`. Em um app financeiro a política de cache precisa ser
lida linha a linha e auditada; uma biblioteca genérica de cache favorece o
oposto. Ver [`docs/pwa/offline-strategy.md`](../pwa/offline-strategy.md).

### `proxy.ts` em vez de `middleware.ts`

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
