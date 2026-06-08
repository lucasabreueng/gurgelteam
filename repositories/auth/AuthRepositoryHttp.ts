import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { SessionResponse } from "@/lib/contracts/api/v1/auth.api.schemas";

export const AuthRepositoryHttp = {
  async getSession(): Promise<SessionResponse> {
    const res = await apiFetch<SessionResponse>(v1ApiPaths.auth.session);
    return unwrapApiResponse(res);
  },
};
