import { z } from "zod";

/** Blocos reutilizáveis de validação. Usados por `schemas/*`. */

/** Data no formato `YYYY-MM-DD`. */
export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD")
  .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), "Data inválida");

/** Mês de referência no formato `YYYY-MM-01`. */
export const referenceMonth = z
  .string()
  .regex(/^\d{4}-\d{2}-01$/, "Use o formato AAAA-MM-01");

export const uuid = z.uuid("Identificador inválido");

/**
 * Valor monetário em centavos: inteiro, positivo e limitado.
 * O teto evita overflow de `Number` em somatórios (~90 trilhões de reais).
 */
export const positiveCents = z
  .int("Use um valor inteiro em centavos")
  .positive("O valor deve ser maior que zero")
  .max(Number.MAX_SAFE_INTEGER, "Valor acima do limite suportado");

export const nonNegativeCents = z
  .int("Use um valor inteiro em centavos")
  .min(0, "O valor não pode ser negativo")
  .max(Number.MAX_SAFE_INTEGER, "Valor acima do limite suportado");

/** Texto curto e obrigatório, já sem espaços nas bordas. */
export const shortText = (max = 120) =>
  z.string().trim().min(1, "Campo obrigatório").max(max, `Máximo de ${max} caracteres`);

/** Texto longo e opcional; string vazia vira `null`. */
export const optionalLongText = (max = 2000) =>
  z
    .string()
    .trim()
    .max(max, `Máximo de ${max} caracteres`)
    .transform((value) => (value.length === 0 ? null : value))
    .nullable();
