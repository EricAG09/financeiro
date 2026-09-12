import { WalletCards } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoon } from "@/frontend/components/layout/coming-soon";

export const metadata: Metadata = { title: "Lançamentos" };

export default function TransactionsPage() {
  return (
    <ComingSoon
      title="Lançamentos"
      description="Receitas, despesas, contas e recorrências."
      icon={WalletCards}
      stage="Disponível após a modelagem do banco e as migrations com RLS."
    />
  );
}
