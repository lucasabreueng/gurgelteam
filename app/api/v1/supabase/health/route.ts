import { NextResponse } from "next/server";

import { checkDatabaseHealth } from "@/lib/server/health/database-health";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { testSupabaseKartCategories } from "@/lib/supabase/test-connection";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/supabase/health
 * Diagnóstico: Prisma (DATABASE_URL) + PostgREST (Supabase API).
 */
export async function GET() {
  const database = await checkDatabaseHealth();

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: database.ok,
        database,
        supabase: {
          ok: false,
          error:
            "Supabase API não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
        },
      },
      { status: database.ok ? 200 : 503 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const result = await testSupabaseKartCategories(supabase);
    const supabaseOk = result.ok;
    const ok = database.ok && supabaseOk;

    if (!ok) {
      return NextResponse.json(
        {
          ok: false,
          database,
          supabase: supabaseOk
            ? { ok: true, table: result.table, count: result.count }
            : {
                ok: false,
                table: result.table,
                error: result.error,
                hint:
                  "Verifique RLS, migrations (`npm run db:migrate`) e seed (`npm run db:seed`).",
              },
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      database,
      supabase: {
        ok: true,
        table: result.table,
        count: result.count,
        sample: result.sample,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao conectar ao Supabase.";

    return NextResponse.json(
      {
        ok: false,
        database,
        supabase: { ok: false, error: message },
      },
      { status: 503 },
    );
  }
}
