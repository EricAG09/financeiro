import { CheckSquare } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoon } from "@/frontend/components/layout/coming-soon";

export const metadata: Metadata = { title: "Tarefas" };

export default function TasksPage() {
  return (
    <ComingSoon
      title="Tarefas e listas"
      description="To-do, listas de compras e tarefas com impacto financeiro."
      icon={CheckSquare}
      stage="Entra depois do núcleo financeiro estar funcionando."
    />
  );
}
