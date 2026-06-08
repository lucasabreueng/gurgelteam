import type { RoleKey, User } from "@prisma/client";

import {
  applyPermissionProfileById,
  applyRolePermissionProfile,
} from "@/lib/server/settings/permission-profiles";

/** Staff interno (sem vínculo de cliente piloto). */
export function isStaffUser(user: Pick<User, "clientId">): boolean {
  return user.clientId === null;
}

/**
 * Alinha permissões da equipe ao perfil salvo ou ao roleKey no login.
 * Evita contas admin com módulos apenas de piloto no banco.
 */
export async function syncStaffUserPermissions(
  user: Pick<User, "id" | "roleKey" | "clientId" | "permissionProfileId">,
): Promise<void> {
  if (user.clientId === null) {
    if (user.permissionProfileId) {
      await applyPermissionProfileById(user.id, user.permissionProfileId);
      return;
    }

    await applyRolePermissionProfile(user.id, user.roleKey as RoleKey);
    return;
  }

  // Membro da equipe com vínculo piloto (ex.: perfil customizado + clientId legado).
  if (user.permissionProfileId) {
    await applyPermissionProfileById(user.id, user.permissionProfileId);
  }
}
