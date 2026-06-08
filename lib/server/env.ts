function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${name}`);
  }
  return value;
}

export function getDatabaseUrl(): string {
  return requireEnv("DATABASE_URL");
}

export function getSessionSecret(): string {
  return requireEnv("SESSION_SECRET");
}

export function isRouteGuardEnabled(): boolean {
  const flag = process.env.ENABLE_ROUTE_GUARD?.trim().toLowerCase();
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV === "production";
}

export function getDefaultSeedPassword(): string {
  return process.env.SEED_DEFAULT_PASSWORD?.trim() || "Gurgel@123";
}

/** URL pública do app (links em e-mails). */
export function getAppBaseUrl(): string {
  const url =
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (url) {
    const normalized = url.replace(/\/$/, "");
    return normalized.startsWith("http")
      ? normalized
      : `https://${normalized}`;
  }
  return "http://localhost:3000";
}
