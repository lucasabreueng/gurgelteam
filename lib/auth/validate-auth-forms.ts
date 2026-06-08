import { z } from "zod";

import {
  loginSchema,
  passwordRecoveryIdentifierSchema,
  passwordRecoveryVerifyCodeSchema,
  resetPasswordSchema,
} from "@/lib/contracts/auth/auth.schemas";
import type {
  CadastroDTO,
  LoginDTO,
  PasswordRecoveryIdentifierDTO,
  PasswordRecoveryVerifyCodeDTO,
  ResetPasswordDTO,
} from "@/lib/contracts/auth/auth.types";
import { parseLoginIdentifier } from "@/lib/auth-accounts-mocks";
import type { CadastroFieldErrors } from "@/repositories/auth/AuthRepositoryMock";
import { AuthRepositoryMock } from "@/repositories/auth/AuthRepositoryMock";

export type LoginFormErrors = {
  identifier?: string;
  password?: string;
};

function zodFieldErrors(
  fieldErrors: Record<string, string[] | undefined>,
): CadastroFieldErrors {
  const next: CadastroFieldErrors = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    const msg = messages?.[0];
    if (!msg) continue;
    if (key === "firstName") next.firstName = msg;
    else if (key === "lastName") next.lastName = msg;
    else if (key === "birthDate") next.birthDate = msg;
    else if (key === "cpf") next.cpf = msg;
    else if (key === "email") next.email = msg;
    else if (key === "password") next.password = [msg];
    else if (key === "acceptedPrivacy") next.acceptedPrivacy = msg;
    else if (key === "acceptedTerms") next.acceptedTerms = msg;
  }
  return next;
}

export function validateLoginForm(input: LoginDTO): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const trimmed = input.identifier.trim();
  if (!trimmed) {
    errors.identifier = "Informe o e-mail ou usuário.";
  } else if (parseLoginIdentifier(trimmed) === "invalid") {
    errors.identifier =
      "Informe um e-mail válido ou usuário no formato nome.sobrenome.";
  }

  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    if (fieldErrors.password?.[0]) errors.password = fieldErrors.password[0];
    if (!errors.identifier && fieldErrors.identifier?.[0]) {
      errors.identifier = fieldErrors.identifier[0];
    }
  }

  return errors;
}

export function validateCadastroForm(input: CadastroDTO): CadastroFieldErrors {
  const parsed = z
    .object({
      firstName: z.string().min(1, "Informe o nome."),
      lastName: z.string().min(1, "Informe o sobrenome."),
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
    })
    .safeParse(input);
  const zodErrors = parsed.success
    ? {}
    : zodFieldErrors(parsed.error.flatten().fieldErrors);

  const mockErrors = AuthRepositoryMock.getCadastroFieldErrors(input);

  return {
    firstName: zodErrors.firstName ?? mockErrors.firstName,
    lastName: zodErrors.lastName ?? mockErrors.lastName,
    birthDate: zodErrors.birthDate ?? mockErrors.birthDate,
    cpf: zodErrors.cpf ?? mockErrors.cpf,
    email: zodErrors.email ?? mockErrors.email,
    password: zodErrors.password?.length
      ? zodErrors.password
      : mockErrors.password,
  };
}

export function validateRecoveryIdentifierForm(
  input: PasswordRecoveryIdentifierDTO,
): string | undefined {
  const parsed = passwordRecoveryIdentifierSchema.safeParse(input);
  if (!parsed.success) {
    return parsed.error.flatten().fieldErrors.identifier?.[0];
  }
  if (!input.identifier.trim()) {
    return "Informe o e-mail ou usuário.";
  }
  return undefined;
}

export function validateRecoveryCodeForm(
  input: PasswordRecoveryVerifyCodeDTO,
): string | undefined {
  const parsed = passwordRecoveryVerifyCodeSchema.safeParse(input);
  if (!parsed.success) {
    return parsed.error.flatten().fieldErrors.code?.[0];
  }
  return undefined;
}

export type ResetPasswordFormErrors = {
  password?: string[];
  confirmPassword?: string;
};

export function validateResetPasswordForm(
  input: ResetPasswordDTO,
): ResetPasswordFormErrors {
  const errors: ResetPasswordFormErrors = {};
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    if (fieldErrors.password) errors.password = fieldErrors.password;
    if (fieldErrors.confirmPassword?.[0]) {
      errors.confirmPassword = fieldErrors.confirmPassword[0];
    }
    return errors;
  }

  if (!AuthRepositoryMock.isPasswordValid(input.password)) {
    errors.password = AuthRepositoryMock.getFailedPasswordRuleLabels(
      input.password,
    );
  }

  return errors;
}

export function hasResetPasswordErrors(errors: ResetPasswordFormErrors): boolean {
  return Boolean(errors.password?.length || errors.confirmPassword);
}
