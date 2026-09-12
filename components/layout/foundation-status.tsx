import { CircleAlert, CircleCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/config/env";

/**
 * Cartão de diagnóstico da Etapa 1.
 *
 * Existe para tornar visível o que já está de pé e o que ainda depende de
 * credenciais. Deve ser REMOVIDO quando o dashboard real entrar (Etapa 3).
 */
export function FoundationStatus() {
  const items = [
    { label: "Design System e tema claro/escuro", ready: true },
    { label: "PWA instalável com cache restrito", ready: true },
    { label: "Camada de cálculos financeiros", ready: true },
    { label: "Arquitetura de Auth, RLS e agente de IA", ready: true },
    {
      label: isSupabaseConfigured
        ? "Supabase conectado"
        : "Supabase aguardando credenciais em .env.local",
      ready: isSupabaseConfigured,
    },
  ];

  return (
    <Card className="shadow-none">
      <CardContent className="px-4 py-4">
        <p className="text-sm font-medium">Fundação</p>
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.label} className="flex items-start gap-2 text-sm">
              {item.ready ? (
                <CircleCheck
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-hidden
                />
              ) : (
                <CircleAlert
                  className="mt-0.5 size-4 shrink-0 text-warning"
                  aria-hidden
                />
              )}
              <span className={item.ready ? "text-muted-foreground" : "text-foreground"}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
