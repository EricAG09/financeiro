import { Target } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoon } from "@/frontend/components/layout/coming-soon";

export const metadata: Metadata = { title: "Metas" };

export default function GoalsPage() {
  return (
    <ComingSoon
      title="Metas"
      description="Reserva de emergência, viagens e objetivos de médio prazo."
      icon={Target}
      stage="Os cálculos de progresso já existem em lib/calculations/goals.ts; falta a camada de dados."
    />
  );
}
