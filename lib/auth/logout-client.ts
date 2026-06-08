import { apiFetch } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";

/** Revoga a sessão no servidor e remove o cookie `gurgel_session`. */
export async function logoutClient(): Promise<void> {
  await apiFetch<{ ok: boolean }>(v1ApiPaths.auth.logout, {
    method: "POST",
    credentials: "include",
  });
}
