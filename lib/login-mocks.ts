/** Dados mockados — login (sem autenticação real) */

import {
  findAccountByIdentifier,
  parseLoginIdentifier,
} from "@/lib/auth-accounts-mocks";

export const LOGIN_MOCK = {
  defaultIdentifier: "",
  signupPrompt: "Ainda não tem conta?",
  signupCta: "Criar cadastro",
  signupHref: "/cadastro",
  recoveryHref: "/recuperar-senha",
} as const;

export function getLoginIdentifierError(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Informe o e-mail ou usuário.";
  if (parseLoginIdentifier(trimmed) === "invalid") {
    return "Informe um e-mail válido ou usuário no formato nome.sobrenome.";
  }
  if (!findAccountByIdentifier(trimmed)) {
    return "E-mail ou usuário não encontrado.";
  }
  return undefined;
}
