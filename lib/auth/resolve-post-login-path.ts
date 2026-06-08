import type { AuthUserDTO } from "@/lib/contracts/api/v1/auth.api.schemas";
import { ADMIN_MODULE_KEYS } from "@/lib/contracts/enums";

type PermissionSnapshot = {
  moduleKey: string;
  canView: boolean;
};

function hasAdminAreaAccess(
  user: AuthUserDTO,
  modulePermissions?: PermissionSnapshot[],
): boolean {
  if (user.clientId == null) return true;
  if (user.roleKey === "admin") return true;
  if (!modulePermissions?.length) return false;
  return modulePermissions.some(
    (permission) =>
      (ADMIN_MODULE_KEYS as readonly string[]).includes(permission.moduleKey) &&
      permission.canView,
  );
}

/** Destino padrão após login (respeita `?next=` quando informado). */
export function resolvePostLoginPath(
  user: AuthUserDTO,
  nextPath?: string | null,
  modulePermissions?: PermissionSnapshot[],
): string {
  if (nextPath?.startsWith("/") && !nextPath.startsWith("//")) {
    return nextPath;
  }
  if (hasAdminAreaAccess(user, modulePermissions)) return "/admin";
  if (user.clientId) return "/piloto";
  return "/admin";
}
