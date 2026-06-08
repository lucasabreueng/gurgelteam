import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, KartCategoryRow } from "@/lib/supabase/database.types";

export type SupabaseConnectionTestResult = {
  ok: boolean;
  table: "kart_categories";
  count: number;
  sample: Pick<KartCategoryRow, "id" | "slug" | "name">[];
  error?: string;
};

const KART_CATEGORIES_TABLE = "kart_categories" as const;

/**
 * Consulta simples à tabela `kart_categories` para validar conexão PostgREST.
 * Funciona com RLS permissivo ou políticas que permitam SELECT anon/authenticated.
 */
export async function testSupabaseKartCategories(
  supabase: SupabaseClient<Database>,
  limit = 5,
): Promise<SupabaseConnectionTestResult> {
  const { data, error } = await supabase
    .from(KART_CATEGORIES_TABLE)
    .select("id, slug, name")
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error) {
    return {
      ok: false,
      table: KART_CATEGORIES_TABLE,
      count: 0,
      sample: [],
      error: error.message,
    };
  }

  const rows = data ?? [];

  return {
    ok: true,
    table: KART_CATEGORIES_TABLE,
    count: rows.length,
    sample: rows,
  };
}
