/** Dados mockados — recuperação de senha (sem API real) */

import {
  AUTH_ACCOUNTS,
  findAccountByIdentifier,
  isRegisteredIdentifier,
  maskRecoveryTarget,
  parseLoginIdentifier,
  type AuthAccount,
} from "@/lib/auth-accounts-mocks";

export const RESEND_COOLDOWN_SECONDS = 60;

/** Código válido para demonstração */
export const MOCK_RECOVERY_CODE = "123456";

export const RECOVERY_RESET_PATH = "/recuperar-senha/redefinir";

export const RECOVERY_SESSION_KEY = "gurgel-recovery-verified";

export function setRecoveryVerified(email: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RECOVERY_SESSION_KEY, email.trim().toLowerCase());
}

export function getRecoveryVerified(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(RECOVERY_SESSION_KEY);
}

export function clearRecoveryVerified(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RECOVERY_SESSION_KEY);
}

export function isValidRecoveryIdentifier(value: string): boolean {
  return parseLoginIdentifier(value) !== "invalid";
}

export function resolveRecoveryAccount(
  value: string
): AuthAccount | null {
  return findAccountByIdentifier(value);
}

export function isRegisteredRecoveryIdentifier(value: string): boolean {
  return isRegisteredIdentifier(value);
}

export function getRecoveryIdentifierError(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "Informe o e-mail ou usuário.";
  if (!isValidRecoveryIdentifier(trimmed)) {
    return "Informe um e-mail válido ou usuário no formato nome.sobrenome.";
  }
  if (!isRegisteredRecoveryIdentifier(trimmed)) {
    return "E-mail ou usuário não encontrado em nossa base.";
  }
  return undefined;
}

export { maskRecoveryTarget };

export function isValidRecoveryCode(code: string): boolean {
  return /^\d{6}$/.test(code) && code === MOCK_RECOVERY_CODE;
}

export function formatCooldown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** @deprecated use AUTH_ACCOUNTS */
export const RECOVERY_ACCOUNTS = AUTH_ACCOUNTS.map((a) => ({
  email: a.email,
}));
