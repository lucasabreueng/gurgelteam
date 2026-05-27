import {
  cadastroSchema,
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
import { PasswordRecoveryRepositoryMock } from "@/repositories/auth/PasswordRecoveryRepositoryMock";
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
  }
  return next;
}

export function validateLoginForm(input: LoginDTO): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const identifierError = AuthRepositoryMock.getLoginIdentifierError(
    input.identifier,
  );
  if (identifierError) errors.identifier = identifierError;

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
  const parsed = cadastroSchema.safeParse(input);
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
  const mockError = PasswordRecoveryRepositoryMock.getRecoveryIdentifierError(
    input.identifier,
  );
  const parsed = passwordRecoveryIdentifierSchema.safeParse(input);
  if (mockError) return mockError;
  if (!parsed.success) {
    return parsed.error.flatten().fieldErrors.identifier?.[0];
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
  if (!PasswordRecoveryRepositoryMock.isValidRecoveryCode(input.code)) {
    return "Código inválido. Use 123456 no ambiente de demonstração.";
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
