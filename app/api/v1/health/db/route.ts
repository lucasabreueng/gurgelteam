import { NextResponse } from "next/server";

import { checkDatabaseHealth } from "@/lib/server/health/database-health";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/health/db
 * Diagnóstico de conexão Prisma (Vercel / Supabase). Não expõe credenciais.
 */
export async function GET() {
  const database = await checkDatabaseHealth();

  return NextResponse.json(
    { ok: database.ok, database },
    { status: database.ok ? 200 : 503 },
  );
}
