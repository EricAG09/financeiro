# `src/` — código da aplicação

Três camadas, uma regra cada. Se um arquivo não se encaixa claramente em uma
delas, ele está no lugar errado.

```
src/
├── app/        roteamento (exigência do Next.js)
├── frontend/   o que desenha
├── backend/    o que roda no servidor e o que decide regra de negócio
├── shared/     o vocabulário comum aos dois
└── proxy.ts    borda: renova a sessão e emite a CSP
```

## A regra de cada camada

| Camada      | Contém                                                   | Nunca contém                                |
| ----------- | -------------------------------------------------------- | ------------------------------------------- |
| `frontend/` | Componentes, hooks, formatação de exibição, estilos      | Acesso a dados, regra de negócio, segredo   |
| `backend/`  | Supabase, auth, IA, cálculo financeiro, validação        | JSX, componente, hook                       |
| `shared/`   | Tipos, constantes, configuração — declarações sem lógica | Dependência de `frontend/` ou de `backend/` |

## Quem pode importar quem

```
frontend  ─────►  backend/domain      (regra de negócio pura, mesma nos dois lados)
frontend  ─────►  shared
backend   ─────►  shared
shared    ─────►  (ninguém)
backend   ──✗──►  frontend
```

Sim, o frontend importa de `backend/domain`. É proposital: a regra financeira
precisa ser **a mesma** no formulário e no servidor. Esses módulos são funções
puras, sem I/O e sem segredo.

O que o frontend **não** alcança está bloqueado no ESLint, não só combinado:

- `@/backend/supabase/admin` — ignora RLS;
- `@/backend/ai/registry` — lê a chave do provedor;
- `serverEnv()` de `@/shared/config/env` — expõe segredos.

Esses três, mais `@/backend/auth/*` e `@/backend/supabase/server`, importam
`server-only`: o build quebra se um Client Component chegar até eles.

## Onde colocar um arquivo novo

1. Desenha alguma coisa? → `frontend/`
2. Faz conta com dinheiro, valida entrada ou fala com o banco? → `backend/`
3. É só um tipo, uma constante ou configuração? → `shared/`
4. É uma rota? → `app/(frontend)/` se é tela, `app/(backend)/` se é HTTP

Fora de `src/`: `public/` (estáticos), `supabase/` (migrations e RLS), `tests/`,
`docs/`, `scripts/`.
