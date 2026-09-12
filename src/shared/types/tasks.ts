import type { Cents } from "@/shared/types/money";

export type TaskStatus = "pending" | "done" | "cancelled";

export interface TaskList {
  readonly id: string;
  readonly name: string;
  readonly kind: "todo" | "shopping";
}

export interface Task {
  readonly id: string;
  readonly listId: string | null;
  readonly title: string;
  readonly description: string | null;
  /** `YYYY-MM-DD` ou `null`. */
  readonly dueOn: string | null;
  readonly status: TaskStatus;
  /** Impacto financeiro previsto. `null` quando a tarefa não envolve dinheiro. */
  readonly estimatedAmount: Cents | null;
}
