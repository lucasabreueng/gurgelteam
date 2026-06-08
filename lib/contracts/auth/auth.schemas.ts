import { z } from "zod";

import type {
  CadastroDTO,
  LoginDTO,
  PasswordRecoveryIdentifierDTO,
  PasswordRecoveryVerifyCodeDTO,
  ResetPasswordDTO,
} from "./auth.types";

export const loginSchema: z.ZodSchema<LoginDTO> = z.object({
  identifier: z.string().min(3, "Informe o e-mail ou usuário."),
  password: z.string().min(1, "Informe a senha."),
  remember: z.boolean(),
});

export const cadastroSchema: z.ZodSchema<CadastroDTO> = z
  .object({
    firstName: z.string().min(1, "Informe o nome."),
    lastName: z.string().min(1, "Informe o sobrenome."),
    birthDate: z.string().min(1, "Informe a data de nascimento."),
    cpf: z.string().min(11, "Informe o CPF."),
    email: z.string().email("Informe um e-mail válido."),
    password: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres.")
      .refine((v) => !v.includes(" "), "Senha não pode conter espaços."),
    acceptedPrivacy: z.boolean(),
    acceptedTerms: z.boolean(),
    acceptedImageUsage: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.acceptedPrivacy) {
      ctx.addIssue({
        code: "custom",
        message: "Aceite a Política de privacidade para continuar.",
        path: ["acceptedPrivacy"],
      });
    }
    if (!data.acceptedTerms) {
      ctx.addIssue({
        code: "custom",
        message: "Aceite os Termos de uso para continuar.",
        path: ["acceptedTerms"],
      });
    }
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

