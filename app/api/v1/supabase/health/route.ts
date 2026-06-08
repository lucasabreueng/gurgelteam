import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { testSupabaseKartCategories } from "@/lib/supabase/test-connection";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/supabase/health
 * Testa conexão PostgREST consultando `kart_categories` via chave publishable.
 */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY no .env.",
      },
      { status: 503 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const result = await testSupabaseKartCategories(supabase);

    if (!result.ok) {
      return NextResponse.json(
        {
          ok: false,
          table: result.table,
          error: result.error,
          hint:
            "Verifique RLS em kart_categories, migrations (`npm run db:migrate`) e seed (`npm run db:seed`).",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      table: result.table,
      count: result.count,
      sample: result.sample,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido ao conectar ao Supabase.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
