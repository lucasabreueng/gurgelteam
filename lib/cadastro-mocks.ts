/** Dados mockados — cadastro (sem persistência real) */

import { isUnder14 } from "@/lib/auth-accounts-mocks";

export const CADASTRO_MOCK = {
  loginPrompt: "Já tem conta?",
  loginCta: "Entrar",
  loginHref: "/login",
  minorNotice:
    "Pilotos menores de 14 anos não podem se cadastrar sozinhos. Um responsável com 18 anos ou mais deve criar uma conta de responsável e vincular o piloto.",
} as const;

export { isUnder14 };

export const PASSWORD_RULES = [
  {
    key: "minLength",
    label: "Mínimo 8 caracteres",
    test: (password: string) => password.length >= 8,
  },
  {
    key: "uppercase",
    label: "Uma letra maiúscula",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    key: "number",
    label: "Um número",
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    key: "special",
    label: "Um caractere especial",
    test: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
  {
    key: "noSpace",
    label: "Sem espaços",
    test: (password: string) => !/\s/.test(password),
  },
] as const;

export function getPasswordRuleStatus(password: string) {
  return PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }));
}

export function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

export function getPasswordRuleLabels(): string[] {
  return PASSWORD_RULES.map((rule) => rule.label);
}

export function getFailedPasswordRuleLabels(password: string): string[] {
  return getPasswordRuleStatus(password)
    .filter((rule) => !rule.passed)
    .map((rule) => rule.label);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CadastroFormValues = {
  firstName: string;
  lastName: string;
  birthDate: string;
  cpf: string;
  email: string;
  password: string;
};

export type CadastroFieldErrors = {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  cpf?: string;
  email?: string;
  password?: string[];
};

export function getCadastroFieldErrors(
  values: CadastroFormValues
): CadastroFieldErrors {
  const errors: CadastroFieldErrors = {};
  const first = values.firstName.trim();
  const last = values.lastName.trim();

  if (!first) errors.firstName = "Informe o nome.";
  if (!last) errors.lastName = "Informe o sobrenome.";
  if (!values.birthDate) errors.birthDate = "Selecione a data de nascimento.";

  const cpfDigits = values.cpf.replace(/\D/g, "");
  if (!cpfDigits) errors.cpf = "Informe o CPF.";
  else if (cpfDigits.length !== 11) errors.cpf = "CPF deve ter 11 dígitos.";

  const email = values.email.trim();
  if (!email) errors.email = "Informe o e-mail.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Informe um e-mail válido.";

  if (!values.password) errors.password = ["Informe a senha."];
  else if (!isPasswordValid(values.password)) {
    errors.password = getFailedPasswordRuleLabels(values.password);
  }

  return errors;
}

export function hasCadastroFieldErrors(errors: CadastroFieldErrors): boolean {
  return Object.values(errors).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );
}

export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}
