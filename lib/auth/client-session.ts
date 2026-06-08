import { apiFetch } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type {
  AuthUserDTO,
  SessionResponse,
} from "@/lib/contracts/api/v1/auth.api.schemas";

export async function fetchAuthenticatedUser(): Promise<AuthUserDTO | null> {
  const result = await apiFetch<SessionResponse>(v1ApiPaths.auth.session, {
    credentials: "include",
  });

  const user = result.data?.user;
  if (!result.success || !user?.id || user.active === false) {
    return null;
  }

  return user;
}
