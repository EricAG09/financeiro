import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

interface ComingSoonProps {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly stage: string;
}

/**
 * Placeholder de rota planejada.
 *
 * Existe para que a navegação inferior não tenha link quebrado durante a
 * fundação. Cada tela substitui este componente na sua etapa.
 */
export function ComingSoon({ title, description, icon, stage }: ComingSoonProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <EmptyState icon={icon} title="Em construção" description={stage} />
    </>
  );
}
