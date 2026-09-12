import { Compass } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { routes } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 items-center px-4 py-10">
      <EmptyState
        className="w-full"
        icon={Compass}
        title="Página não encontrada"
        description="O endereço acessado não existe ou foi movido."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={routes.home}>Voltar ao início</Link>
          </Button>
        }
      />
    </div>
  );
}
