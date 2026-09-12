# `src/frontend` — camada de apresentação

```
frontend/
├── components/
│   ├── ui/          primitivas do Design System (shadcn/ui sobre Radix)
│   ├── layout/      AppShell, navegação inferior e superior, cabeçalho
│   ├── finance/     saldo, resumo, lançamento, orçamento, ações rápidas
│   ├── goals/       metas e progresso
│   ├── tasks/       tarefas e listas (Etapa 5)
│   ├── assistant/   balões de conversa do agente
│   ├── charts/      paleta e wrappers de gráfico
│   ├── theme/       provider e alternador claro/escuro
│   ├── providers/   React Query, tema, tooltip
│   └── pwa/         registro do service worker, aviso de offline
├── hooks/           conectividade, media query, instalação do PWA, hidratação
├── lib/
│   ├── utils.ts     `cn` (exigido pelo shadcn)
│   └── format/      moeda e data em pt-BR — só texto, sem conta
└── styles/
    └── globals.css  tokens do Design System, claro e escuro
```

## Regras

- **Não faz conta.** Todo cálculo financeiro vem pronto de
  `@/backend/domain/calculations`. Componente que soma dinheiro está errado.
- **Não acessa o banco.** Os dados chegam por props ou por Server Component.
- **Server Component é o padrão.** `"use client"` só com estado, efeito ou
  evento de interação.
- **Nenhum hexadecimal.** Cor, espaço e raio saem dos tokens de `globals.css`.
- **Dinheiro só por `MoneyDisplay`.** É o único componente autorizado a
  renderizar valor monetário.
- **Toda lista tem três estados**: vazio, carregando e erro.
- **Mobile-first.** Projete para 360px; o desktop acrescenta.

`src/frontend/lib/format/` é a fronteira de apresentação: converte centavos e datas em texto.
Aritmética de data mora em `@/backend/domain/dates`.
