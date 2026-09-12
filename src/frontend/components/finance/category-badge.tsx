import { Badge } from "@/frontend/components/ui/badge";
import { cn } from "@/frontend/lib/utils";
import type { TransactionKind } from "@/shared/types/finance";

interface CategoryBadgeProps {
  readonly label: string;
  readonly kind: TransactionKind;
  readonly className?: string;
}

export function CategoryBadge({ label, kind, className }: CategoryBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-normal",
        kind === "income"
          ? "bg-success-subtle text-success"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {label}
    </Badge>
  );
}
