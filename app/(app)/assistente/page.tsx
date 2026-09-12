import { Bot } from "lucide-react";
import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Assistente" };

export default function AssistantPage() {
  return (
    <ComingSoon
      title="Assistente financeiro"
      description="Consultas em linguagem natural sobre os seus números."
      icon={Bot}
      stage="Somente leitura, sobre as ferramentas declaradas em lib/ai/tools.ts. Requer provedor de IA configurado."
    />
  );
}
