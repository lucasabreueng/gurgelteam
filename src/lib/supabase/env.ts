const PUBLIC_SUPABASE_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

type PublicSupabaseEnvKey = (typeof PUBLIC_SUPABASE_ENV_KEYS)[number];

function readPublicEnv(name: PublicSupabaseEnvKey): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Variável de ambiente obrigatória ausente: ${name}. ` +
        "Configure no .env a URL e a chave publishable (anon) do Supabase.",
    );
  }
  return value;
}

/** URL pública do projeto Supabase — seguro expor no browser. */
export function getSupabaseUrl(): string {
  const url = readPublicEnv("NEXT_PUBLIC_SUPABASE_URL");
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("protocolo inválido");
    }
    return url.replace(/\/$/, "");
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL inválida. Use o formato https://[project-ref].supabase.co",
    );
  }
}

/**
 * Chave publishable (anon) do Supabase — segura para o frontend com RLS ativo.
 * Nunca use SUPABASE_SERVICE_ROLE_KEY ou secret keys em variáveis NEXT_PUBLIC_*.
 */
export function getSupabasePublishableKey(): string {
  return readPublicEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

/** Valida presença das variáveis públicas do Supabase (útil em health checks). */
export function assertSupabasePublicEnv(): {
  url: string;
  publishableKey: string;
} {
  return {
    url: getSupabaseUrl(),
    publishableKey: getSupabasePublishableKey(),
  };
}

export function isSupabaseConfigured(): boolean {
  return PUBLIC_SUPABASE_ENV_KEYS.every((key) => Boolean(process.env[key]?.trim()));
}
