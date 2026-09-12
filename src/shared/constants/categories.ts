import type { TransactionKind } from "@/shared/types/finance";

/**
 * Catálogo padrão de categorias.
 *
 * No banco as categorias vivem em `transaction_categories` e podem ser
 * personalizadas por usuário. Esta lista é apenas o seed padrão e o vocabulário
 * usado pela UI enquanto o backend não está configurado.
 */

export type CategoryTone =
  | "income"
  | "food"
  | "housing"
  | "transport"
  | "leisure"
  | "health"
  | "education"
  | "shopping"
  | "subscriptions"
  | "other";

export interface CategoryDefinition {
  readonly slug: string;
  readonly label: string;
  readonly kind: TransactionKind;
  readonly tone: CategoryTone;
  /** Nome do ícone em `lucide-react`. */
  readonly icon: string;
}

export const defaultIncomeCategories: readonly CategoryDefinition[] = [
  { slug: "salario", label: "Salário", kind: "income", tone: "income", icon: "Wallet" },
  {
    slug: "freelance",
    label: "Freelance",
    kind: "income",
    tone: "income",
    icon: "Laptop",
  },
  {
    slug: "outros-recebimentos",
    label: "Outros recebimentos",
    kind: "income",
    tone: "income",
    icon: "PiggyBank",
  },
];

export const defaultExpenseCategories: readonly CategoryDefinition[] = [
  {
    slug: "alimentacao",
    label: "Alimentação",
    kind: "expense",
    tone: "food",
    icon: "UtensilsCrossed",
  },
  { slug: "moradia", label: "Moradia", kind: "expense", tone: "housing", icon: "House" },
  {
    slug: "transporte",
    label: "Transporte",
    kind: "expense",
    tone: "transport",
    icon: "Car",
  },
  { slug: "lazer", label: "Lazer", kind: "expense", tone: "leisure", icon: "Popcorn" },
  { slug: "saude", label: "Saúde", kind: "expense", tone: "health", icon: "HeartPulse" },
  {
    slug: "educacao",
    label: "Educação",
    kind: "expense",
    tone: "education",
    icon: "GraduationCap",
  },
  {
    slug: "compras",
    label: "Compras",
    kind: "expense",
    tone: "shopping",
    icon: "ShoppingBag",
  },
  {
    slug: "assinaturas",
    label: "Assinaturas",
    kind: "expense",
    tone: "subscriptions",
    icon: "Repeat",
  },
  { slug: "outros", label: "Outros", kind: "expense", tone: "other", icon: "Ellipsis" },
];

export const defaultCategories: readonly CategoryDefinition[] = [
  ...defaultIncomeCategories,
  ...defaultExpenseCategories,
];
