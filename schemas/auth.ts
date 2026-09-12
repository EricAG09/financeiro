import { z } from "zod";

const password = z
  .string()
  .min(12, "Use ao menos 12 caracteres")
  .max(128, "Máximo de 128 caracteres");

export const signInSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export const signUpSchema = z
  .object({
    email: z.email("E-mail inválido"),
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.email("E-mail inválido"),
});

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
