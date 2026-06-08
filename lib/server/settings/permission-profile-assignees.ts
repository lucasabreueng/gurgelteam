import type { RoleKey } from "@/lib/contracts/enums";
import { prisma } from "@/lib/server/prisma";
import { userMatchesPermissionProfile } from "@/lib/server/settings/permission-profiles";

export type PermissionProfileAssignee = {
  id: string;
  name: string;
  email: string;
};

type UserRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleKey: string;
  clientId: string | null;
  permissionProfileId: string | null;
  modulePermissions: {
    moduleKey: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }[];
};

export function userIsAssignedToPermissionProfile(
  profileId: string,
  user: UserRow,
): boolean {
  if (user.permissionProfileId === profileId) return true;
  if (user.permissionProfileId) return false;
  return userMatchesPermissionProfile(profileId, {
    id: user.id,
    roleKey: user.roleKey as RoleKey,
    clientId: user.clientId,
    modulePermissions: user.modulePermissions,
  });
}

export async function listPermissionProfileAssignees(
  profileId: string,
): Promise<PermissionProfileAssignee[]> {
  const rows = await prisma.user.findMany({
    where: { active: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      roleKey: true,
      clientId: true,
      permissionProfileId: true,
      modulePermissions: true,
    },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });

  return rows
    .filter((user) => userIsAssignedToPermissionProfile(profileId, user))
    .map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
    }));
}
