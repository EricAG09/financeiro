import { z } from "zod";
import {
  isoDate,
  positiveCents,
  nonNegativeCents,
  shortText,
} from "@/backend/validation/primitives";

export const goalStatusSchema = z.enum(["active", "achieved", "paused", "cancelled"]);

export const createGoalSchema = z
  .object({
    name: shortText(80),
    targetAmount: positiveCents,
    currentAmount: nonNegativeCents.default(0),
    targetDate: isoDate.nullable(),
    status: goalStatusSchema.default("active"),
  })
  .refine((data) => data.currentAmount <= data.targetAmount, {
    message: "O valor atual não pode exceder o valor alvo",
    path: ["currentAmount"],
  });

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
