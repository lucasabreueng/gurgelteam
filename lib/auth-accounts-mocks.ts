/** Contas mockadas — login, recuperação e geração de usuário */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-z0-9][a-z0-9.]{2,28}[a-z0-9]$/;

export type AuthAccount = {
  email: string;
  username: string;
};

/** Contas já cadastradas (login e recuperação) */
export const AUTH_ACCOUNTS: AuthAccount[] = [
  { email: "piloto@gurgelteam.com.br", username: "lucas.mendes" },
  { email: "ana.silva@gurgelteam.com.br", username: "ana.silva" },
];

/** Usernames já em uso (para sugestão no cadastro) */
export const TAKEN_USERNAMES: string[] = [
  ...AUTH_ACCOUNTS.map((a) => a.username),
  "theo.mendes",
  "lara.mendes",
  "mariana.mendes",
];

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidUsername(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return USERNAME_PATTERN.test(normalized);
}

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function parseLoginIdentifier(
  value: string
): "email" | "username" | "invalid" {
  const trimmed = value.trim();
  if (!trimmed) return "invalid";
  if (trimmed.includes("@")) {
    return isValidEmail(trimmed) ? "email" : "invalid";
  }
  const user = normalizeUsername(trimmed);
  return isValidUsername(user) ? "username" : "invalid";
}

export function findAccountByIdentifier(
  value: string
): AuthAccount | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const kind = parseLoginIdentifier(trimmed);
  if (kind === "invalid") return null;

  if (kind === "email") {
    const email = trimmed.toLowerCase();
    return (
      AUTH_ACCOUNTS.find((a) => a.email.toLowerCase() === email) ?? null
    );
  }

  const username = normalizeUsername(trimmed);
  return (
    AUTH_ACCOUNTS.find((a) => a.username === username) ?? null
  );
}

export function isRegisteredIdentifier(value: string): boolean {
  return findAccountByIdentifier(value) !== null;
}

export function maskEmailForDisplay(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) {
    return `${local[0] ?? ""}***@${domain}`;
  }
  const maskedMiddle =
    local.length <= 3 ? "*" : "*".repeat(Math.min(local.length - 2, 6));
  return `${local[0]}${maskedMiddle}${local[local.length - 1]}@${domain}`;
}

export function maskRecoveryTarget(account: AuthAccount): string {
  return maskEmailForDisplay(account.email);
}

function slugifyNamePart(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 24);
}

/** Base do usuário: nome.sobrenome */
export function buildUsernameBase(
  firstName: string,
  lastName: string
): string {
  const first = slugifyNamePart(firstName);
  const last = slugifyNamePart(lastName);
  if (!first && !last) return "";
  if (!first) return last;
  if (!last) return first;
  return `${first}.${last}`;
}

/**
 * Gera usuário disponível: nome.sobrenome, ou nome.sobrenome1, nome.sobrenome2…
 */
export function generateAvailableUsername(
  firstName: string,
  lastName: string,
  taken: readonly string[] = TAKEN_USERNAMES
): string {
  const base = buildUsernameBase(firstName, lastName);
  if (!base) return "";

  const takenSet = new Set(taken.map((u) => u.toLowerCase()));
  if (!takenSet.has(base)) return base;

  let suffix = 1;
  while (takenSet.has(`${base}${suffix}`)) {
    suffix += 1;
  }
  return `${base}${suffix}`;
}

export function getAgeFromBirthDate(isoDate: string): number | null {
  if (!isoDate) return null;
  const birth = new Date(isoDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function isUnder14(isoDate: string): boolean {
  const age = getAgeFromBirthDate(isoDate);
  return age !== null && age < 14;
}
