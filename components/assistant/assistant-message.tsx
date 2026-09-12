import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIMessageRole } from "@/types/ai";

interface AssistantMessageProps {
  readonly role: AIMessageRole;
  /**
   * Texto puro. NUNCA renderize HTML vindo do modelo (`react/no-danger` está
   * como erro no ESLint) — ver docs/security/security-model.md.
   */
  readonly content: string;
  readonly className?: string;
}

export function AssistantMessage({ role, content, className }: AssistantMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-2.5",
        isAssistant ? "justify-start" : "justify-end",
        className,
      )}
    >
      {isAssistant ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Bot className="size-4" aria-hidden />
        </span>
      ) : null}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap",
          isAssistant
            ? "rounded-tl-sm bg-muted text-foreground"
            : "rounded-tr-sm bg-primary text-primary-foreground",
        )}
      >
        {content}
      </div>
    </div>
  );
}
