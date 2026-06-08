/**
 * Tipos mínimos para consultas PostgREST.
 * Gere tipos completos com `supabase gen types` quando necessário.
 */
export type KartCategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_per_lesson_cents: number;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      kart_categories: {
        Row: KartCategoryRow;
        Insert: Partial<KartCategoryRow>;
        Update: Partial<KartCategoryRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
