import { z } from "zod";
import {
  isoDate,
  optionalLongText,
  positiveCents,
  shortText,
  uuid,
} from "@/backend/validation/primitives";

export const taskStatusSchema = z.enum(["pending", "done", "cancelled"]);

export const createTaskSchema = z.object({
  listId: uuid.nullable(),
  title: shortText(120),
  description: optionalLongText(1000),
  dueOn: isoDate.nullable(),
  status: taskStatusSchema.default("pending"),
  /** Impacto financeiro previsto da tarefa, em centavos. */
  estimatedAmount: positiveCents.nullable(),
});

export const createTaskListSchema = z.object({
  name: shortText(80),
  kind: z.enum(["todo", "shopping"]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type CreateTaskListInput = z.infer<typeof createTaskListSchema>;
