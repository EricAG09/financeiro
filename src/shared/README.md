# `src/shared` — vocabulário comum

O que frontend e backend precisam para falar a mesma língua. **Declarações, não
lógica.**

```
shared/
├── types/       tipos de domínio (money, finance, goals, tasks, ai) e do banco
├── constants/   rotas da aplicação e catálogo padrão de categorias
└── config/
    ├── env.ts   validação de variáveis de ambiente (publicEnv / serverEnv)
    └── site.ts  nome, locale, moeda, fuso, cores de tema
```

## Regras

- **Não depende de ninguém.** Importar de `@/frontend` ou `@/backend` aqui é erro
  de lint — a seta aponta sempre para cá.
- **Sem regra de negócio.** Se tem `if` decidindo dinheiro, pertence a
  `@/backend/domain`.
- **Sem componente.** Se renderiza, pertence a `@/frontend`.

`src/shared/config/env.ts` é a exceção parcial: valida e expõe variáveis. `publicEnv` pode
ser lido em qualquer lugar; `serverEnv()` lança erro se for chamado no browser e
está bloqueado no ESLint dentro do frontend.

`src/shared/types/database.ts` é um placeholder até o Supabase existir — será substituído
por `npx supabase gen types typescript`.
