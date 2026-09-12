import { z } from "zod";
import {
  isoDate,
  optionalLongText,
  positiveCents,
  shortText,
  uuid,
} from "@/lib/validation/primitives";

export const transactionKindSchema = z.enum(["income", "expense"]);

/**
 * Entrada de criação de lançamento.
 *
 * Este schema é a fronteira de confiança: o mesmo objeto valida o formulário no
 * cliente E o payload no servidor. O cliente nunca é a autoridade.
 */
export const createTransactionSchema = z.object({
  accountId: uuid,
  categoryId: uuid.nullable(),
  kind: transactionKindSchema,
  amount: positiveCents,
  description: shortText(120),
  occurredOn: isoDate,
  notes: optionalLongText(1000),
});

export const updateTransactionSchema = createTransactionSchema
  .partial()
  .extend({ id: uuid });

export const recurringTransactionSchema = z.object({
  accountId: uuid,
  categoryId: uuid.nullable(),
  kind: transactionKindSchema,
  amount: positiveCents,
  description: shortText(120),
  frequency: z.enum(["monthly", "weekly", "yearly"]),
  dayOfMonth: z.int().min(1).max(31).nullable(),
  active: z.boolean(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type RecurringTransactionInput = z.infer<typeof recurringTransactionSchema>;
