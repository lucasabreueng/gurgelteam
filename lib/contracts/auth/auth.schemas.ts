import { z } from "zod";

import type {
  CadastroDTO,
  LoginDTO,
  PasswordRecoveryIdentifierDTO,
  PasswordRecoveryVerifyCodeDTO,
  ResetPasswordDTO,
} from "./auth.types";

export const loginSchema: z.ZodSchema<LoginDTO> = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1),
  remember: z.boolean(),
});

export const cadastroSchema: z.ZodSchema<CadastroDTO> = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.string().min(1),
  cpf: z.string().min(11),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .refine((v) => !v.includes(" "), "Senha não pode conter espaços."),
});

export const passwordRecoveryIdentifierSchema: z.ZodSchema<PasswordRecoveryIdentifierDTO> =
  z.object({
    identifier: z.string().min(3),
  });

export const passwordRecoveryVerifyCodeSchema: z.ZodSchema<PasswordRecoveryVerifyCodeDTO> =
  z.object({
    code: z.string().regex(/^\d{6}$/, "Código deve ter 6 dígitos."),
  });

export const resetPasswordSchema: z.ZodSchema<ResetPasswordDTO> = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

