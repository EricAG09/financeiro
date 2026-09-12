# Design System — princípios

## Intenção

O app precisa parecer um produto financeiro em que se confia e que dá vontade de
abrir todo dia. Não um painel administrativo.

Isso se traduz em cinco decisões concretas:

1. O número mais importante da tela é o maior elemento dela.
2. Cartões simples, borda discreta, sombra quase inexistente.
3. Cor com significado — nunca decorativa.
4. Movimento contido: microinterações, jamais animação que atrase uma leitura.
5. Tudo alcançável com o polegar.

## Tokens

Definidos em [`src/frontend/styles/globals.css`](../../src/frontend/styles/globals.css). **Nenhum componente
escreve hexadecimal.** Se um valor não existe como token, o token é que está
faltando.

### Cor

| Token                                       | Uso                                                       |
| ------------------------------------------- | --------------------------------------------------------- |
| `background` / `foreground`                 | Fundo e texto da página                                   |
| `card` / `card-foreground`                  | Superfície elevada                                        |
| `primary`                                   | Ação principal e o cartão de saldo (azul escuro da marca) |
| `accent`                                    | Destaque e ênfase (laranja da marca)                      |
| `secondary` / `muted`                       | Superfícies e textos de apoio                             |
| `success` / `warning` / `critical` / `info` | Estados, cada um com par `-foreground` e `-subtle`        |
| `income` / `expense`                        | Semântica financeira: entra x sai                         |
| `border` / `input` / `ring`                 | Traço e foco                                              |
| `chart-1..5`                                | Séries de gráfico                                         |

`income` é azul e `expense` é vermelho. Vermelho é reservado a saída de dinheiro
e a erro — não é cor de ênfase. A ênfase visual é o laranja (`accent`).

Claro e escuro redefinem apenas os valores; nenhum componente tem condicional de
tema.

### Forma, espaço e elevação

- `--radius: 0.875rem`, com a escala `radius-sm` … `radius-4xl` derivada dele.
- `--spacing-touch: 2.75rem` (44px) é o alvo mínimo de toque.
- `--spacing-nav: 4rem` é a altura da barra inferior.
- `shadow-card`, `shadow-raised` e `shadow-nav`. Nada além disso.

### Tipografia

Geist (`--font-sans`) e Geist Mono. Escala de tamanho do Tailwind, sem
customização. Valores monetários usam a classe `.tabular`, que ativa dígitos de
largura fixa — sem isso, colunas de números dançam.

## Componentes

### Primitivas — `src/frontend/components/ui/`

Vindas do shadcn/ui (base Radix), copiadas para o repositório e mantidas por nós:

```
button · input · textarea · select · checkbox · switch · dialog · drawer
sheet · card · badge · avatar · tabs · dropdown-menu · sonner (toast)
tooltip · skeleton · label · field · separator · progress
```

Mais três estados obrigatórios, escritos para este projeto:

```
empty-state · loading-state · error-state
```

Toda lista da aplicação usa esses três. Estado vazio e estado de erro não são
opcionais nem improvisados na tela.

### Domínio

| Componente         | Responsabilidade                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `MoneyDisplay`     | Único autorizado a renderizar dinheiro. Formato, sinal, tom, dígitos tabulares e modo privacidade |
| `BalanceCard`      | Saldo disponível — maior hierarquia do dashboard                                                  |
| `FinancialSummary` | Receitas x despesas do mês, lado a lado                                                           |
| `TransactionItem`  | Linha de lançamento, valor sempre à direita                                                       |
| `CategoryBadge`    | Etiqueta de categoria                                                                             |
| `BudgetCard`       | Situação de um orçamento, com cor por saúde                                                       |
| `ProgressCard`     | Base genérica de progresso                                                                        |
| `GoalCard`         | Meta, sobre `ProgressCard`                                                                        |
| `QuickAction`      | Atalho do dashboard                                                                               |
| `AssistantMessage` | Balão de conversa, texto puro                                                                     |

Antes de criar um componente, procure o equivalente. `GoalCard` não reimplementa
barra de progresso: usa `ProgressCard`. `BudgetCard` não formata moeda: usa
`MoneyDisplay`.

## Mobile-first, de verdade

O ponto de partida é a tela de celular. Telas maiores **acrescentam**; nunca o
contrário.

- Navegação principal é a barra inferior (`BottomNav`). `TopNav` aparece a partir
  de `md` com os mesmos destinos, na mesma ordem, com os mesmos rótulos. Nunca
  adicione ao desktop um destino que não exista no mobile.
- Conteúdo em coluna única até `md`.
- Alvos de toque com no mínimo 44px.
- `safe-bottom` e `safe-top` respeitam o recorte do iPhone.
- O corpo nunca rola na horizontal; conteúdo largo rola dentro do próprio bloco.

## Acessibilidade

- Zoom **não** é bloqueado (`maximumScale: 5`).
- Ícone decorativo leva `aria-hidden`; botão só de ícone leva `aria-label`.
- Item de navegação ativo leva `aria-current="page"`.
- Foco visível com `ring` em todo elemento interativo.
- `prefers-reduced-motion` desliga animação e transição.
- No modo privacidade, o valor some da tela mas continua disponível para leitor
  de tela.

## Ao adicionar algo

1. Existe primitiva para isso? Use.
2. Existe token para essa cor, espaço ou raio? Use. Se não existe, crie o token —
   não escreva o valor no componente.
3. Funciona com uma mão, em tela de 360px?
4. Tem estado vazio, de carregamento e de erro?
5. Funciona nos dois temas sem condicional?
