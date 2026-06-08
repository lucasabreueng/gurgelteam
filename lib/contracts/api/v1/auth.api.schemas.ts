import { z } from "zod";

import { ROLE_KEYS } from "../../enums";
import { zIsoDate, zUuid } from "../common.schemas";

export const zRoleKey = z.enum(ROLE_KEYS);

export const loginRequestSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1),
  remember: z.boolean().default(false),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const authUserSchema = z.object({
  id: zUuid,
  email: z.string().email(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  roleKey: zRoleKey,
  clientId: zUuid.nullable().optional(),
  active: z.boolean(),
});

export type AuthUserDTO = z.infer<typeof authUserSchema>;

export const loginResponseSchema = z.object({
  user: authUserSchema,
  accessToken: z.string(),
  expiresIn: z.number().int().positive(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const registerRequestSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthDate: zIsoDate,
    cpf: z.string().min(11).max(14),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .refine((v) => !v.includes(" "), "Senha não pode conter espaços."),
    acceptedPrivacy: z.boolean(),
    acceptedTerms: z.boolean(),
    acceptedImageUsage: z.boolean().optional(),
    categoryIds: z.array(zUuid).min(1).optional(),
    levelId: zUuid.optional(),
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

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const registerResponseSchema = z.object({
  email: z.string().email(),
  verificationSent: z.literal(true),
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;

export const registerVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/, "Código deve ter 6 dígitos."),
});

export type RegisterVerifyRequest = z.infer<typeof registerVerifySchema>;

export const suggestUsernameQuerySchema = z.object({
  firstName: z.string().max(80).default(""),
  lastName: z.string().max(80).default(""),
});

export type SuggestUsernameQuery = z.infer<typeof suggestUsernameQuerySchema>;

export const suggestUsernameResponseSchema = z.object({
  username: z.string(),
});

export type SuggestUsernameResponse = z.infer<typeof suggestUsernameResponseSchema>;

export const passwordRecoveryRequestSchema = z.object({
  identifier: z.string().min(3),
});

export const passwordRecoveryVerifySchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Código deve ter 6 dígitos."),
});

export const resetPasswordRequestSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const changePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual."),
    newPassword: z
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres.")
      .refine((v) => !v.includes(" "), "Senha não pode conter espaços."),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;

export const sessionResponseSchema = z.object({
  user: authUserSchema,
  modulePermissions: z
    .array(
      z.object({
        moduleKey: z.string(),
        canView: z.boolean(),
        canEdit: z.boolean(),
        canDelete: z.boolean(),
      }),
    )
    .default([]),
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;

export const legalComplianceAcceptSchema = z
  .object({
    acceptedPrivacy: z.boolean(),
    acceptedTerms: z.boolean(),
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

export type LegalComplianceAcceptRequest = z.infer<
  typeof legalComplianceAcceptSchema
>;
