# `app/(frontend)` — camada de apresentação

Tudo que o usuário vê. Route group: os parênteses organizam o diretório **sem
entrar na URL**, então `(frontend)/(app)/metas/page.tsx` continua respondendo em
`/metas`.

```
(frontend)/
├── (app)/      área autenticada — envolvida pelo AppShell (navegação inferior)
│   ├── layout.tsx
│   ├── page.tsx           →  /
│   ├── transacoes/        →  /transacoes
│   ├── metas/             →  /metas
│   ├── tarefas/           →  /tarefas
│   └── assistente/        →  /assistente
└── offline/    →  /offline — fora do shell, servida pelo service worker
```

`(app)` existe para aplicar o `AppShell` só onde ele faz sentido. `/offline`
fica de fora justamente por não ter navegação nem dado de usuário.

Quando as telas de autenticação chegarem (Etapa 2), elas entram aqui como
`(auth)/`: mesmo nível de `(app)`, sem shell, com layout próprio.

## Regras

- Aqui só entra UI. Regra financeira mora em `src/backend/domain/calculations/`, acesso a dados
  em `src/backend/supabase/`.
- Server Component é o padrão; `"use client"` só quando houver estado,
  efeito ou evento de interação.
- Toda tela tem estado vazio, de carregamento e de erro.
- Mobile-first: projete para 360px e deixe o desktop acrescentar.
