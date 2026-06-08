import type { TeamMemberApiDTO } from "@/lib/contracts/api/v1/team.api.schemas";
import type { RoleKey } from "@/lib/contracts/enums";
import { ROLE_TO_PERMISSION_PROFILE } from "@/lib/settings/permission-profile-ids";
import { resolveRoleLabel } from "@/lib/team/role-labels";

function formatCreatedAt(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export { resolveRoleLabel } from "@/lib/team/role-labels";

export function mapStaffUserToTeamMember(
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    roleKey: RoleKey;
    permissionProfileId?: string | null;
    active: boolean;
    createdAt: Date;
  },
  profileNames?: Record<string, string>,
): TeamMemberApiDTO {
  const roleKey = user.roleKey;
  const permissionProfileId =
    user.permissionProfileId ?? ROLE_TO_PERMISSION_PROFILE[roleKey] ?? null;
  const roleLabel =
    (permissionProfileId && profileNames?.[permissionProfileId]) ||
    resolveRoleLabel(roleKey);

  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    username: user.username,
    roleKey,
    permissionProfileId,
    roleLabel,
    active: user.active,
    createdAtLabel: formatCreatedAt(user.createdAt),
    avatar: null,
  };
}
