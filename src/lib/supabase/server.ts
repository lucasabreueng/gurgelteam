import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/lib/supabase/database.types";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

export type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;

/**
 * Client Supabase para Server Components, Route Handlers e Server Actions.
 * Gerencia cookies de sessão Supabase Auth quando utilizado no futuro.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll em Server Component read-only — ignorado com segurança
          }
        },
      },
    },
  );
}
