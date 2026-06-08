import type { RoleKey } from "@/lib/contracts/enums";
import type { TeamMemberListItem } from "@/lib/contracts/team";
import { ROLE_TO_PERMISSION_PROFILE } from "@/lib/settings/permission-profile-ids";
import { resolveMemberPermissionProfileId } from "@/lib/team/staff-roles";

const ADMIN_PROFILE_ID = ROLE_TO_PERMISSION_PROFILE.admin;

export function isProtectedAdminMember(
  member: Pick<TeamMemberListItem, "roleKey" | "permissionProfileId">,
): boolean {
  const profileId = resolveMemberPermissionProfileId(member);
  if (profileId === ADMIN_PROFILE_ID) return true;
  return member.roleKey === "admin";
}

export function canRemoveTeamMember(
  member: Pick<TeamMemberListItem, "roleKey" | "permissionProfileId">,
): boolean {
  return !isProtectedAdminMember(member);
}

export function isProtectedAdminRole(roleKey: RoleKey): boolean {
  return roleKey === "admin";
}
