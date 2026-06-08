import type { AuthUserDTO } from "@/lib/contracts/api/v1/auth.api.schemas";

export function resolveUserAreaPath(
  user: Pick<AuthUserDTO, "clientId">,
): string {
  return user.clientId ? "/piloto" : "/admin";
}
