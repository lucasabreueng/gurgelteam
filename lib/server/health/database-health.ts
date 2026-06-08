import { prisma } from "@/lib/server/prisma";

export type DatabaseHealthResult = {
  ok: boolean;
  error?: string;
  hint?: string;
  env: {
    DATABASE_URL: boolean;
    DIRECT_URL: boolean;
  };
};

export async function checkDatabaseHealth(): Promise<DatabaseHealthResult> {
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());
  const hasDirectUrl = Boolean(process.env.DIRECT_URL?.trim());
  const env = { DATABASE_URL: hasDatabaseUrl, DIRECT_URL: hasDirectUrl };

  if (!hasDatabaseUrl) {
    return {
      ok: false,
      error:
        "DATABASE_URL ausente. Na Vercel use exatamente DATABASE_URL (maiúsculas), não database_url.",
      env,
    };
  }

  try {
    await prisma.$queryRaw`SELECT 1 as ok`;
    return { ok: true, env };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido ao conectar.";

    const hint = message.includes("Can't reach database")
      ? "Na Vercel use o pooler Supabase (porta 6543) em DATABASE_URL com ?pgbouncer=true&connection_limit=1."
      : message.includes("Authentication failed")
        ? "Senha incorreta ou caracteres especiais sem URL-encode na connection string."
        : "Verifique DATABASE_URL, DIRECT_URL e se o projeto Supabase não está pausado.";

    return { ok: false, error: message, hint, env };
  }
}
