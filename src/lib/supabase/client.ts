"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/supabase/database.types";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/env";

export type SupabaseBrowserClient = ReturnType<typeof createSupabaseBrowserClient>;

/**
 * Client Supabase para Client Components (browser).
 * Usa apenas a chave publishable — nunca secrets no frontend.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
  );
}

let browserClient: SupabaseBrowserClient | undefined;

/** Singleton no browser para evitar múltiplas instâncias em hot reload. */
export function getSupabaseBrowserClient(): SupabaseBrowserClient {
  if (typeof window === "undefined") {
    throw new Error(
      "getSupabaseBrowserClient() só pode ser usado em Client Components.",
    );
  }

  browserClient ??= createSupabaseBrowserClient();
  return browserClient;
}
