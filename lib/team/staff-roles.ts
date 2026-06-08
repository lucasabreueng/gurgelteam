import { ROLES } from "@/lib/admin-settings-mocks";
import type { RoleKey } from "@/lib/contracts/enums";
import type { SettingsUserAccount } from "@/lib/contracts/settings";
import {
  PERMISSION_PROFILE_TO_ROLE,
  PILOT_PERMISSION_PROFILE_IDS,
  ROLE_TO_PERMISSION_PROFILE,
  resolveRoleKeyForPermissionProfile,
} from "@/lib/settings/permission-profile-ids";

export {
  PERMISSION_PROFILE_TO_ROLE,
  ROLE_TO_PERMISSION_PROFILE,
  resolveRoleKeyForPermissionProfile,
};

export type TeamPermissionProfileOption = {
  value: string;
  label: string;
};

/** Perfis que podem ser atribuídos a membros da equipe (staff + customizados). */
export function teamAssignableProfileOptions(
  profiles: SettingsUserAccount[],
): TeamPermissionProfileOption[] {
  return profiles
    .filter((profile) => !PILOT_PERMISSION_PROFILE_IDS.has(profile.id))
    .map((profile) => ({ value: profile.id, label: profile.name }));
}

export function fallbackTeamProfileOptions(): TeamPermissionProfileOption[] {
  return ROLES.filter((role) => role.key in ROLE_TO_PERMISSION_PROFILE).map(
    (role) => ({
      value: ROLE_TO_PERMISSION_PROFILE[role.key],
      label: role.title,
    }),
  );
}

export function resolveMemberPermissionProfileId(member: {
  roleKey: RoleKey;
  permissionProfileId?: string | null;
}): string {
  if (member.permissionProfileId) return member.permissionProfileId;
  return ROLE_TO_PERMISSION_PROFILE[member.roleKey] ?? "";
}

export function resolveMemberRoleLabel(
  member: {
    roleKey: RoleKey;
    permissionProfileId?: string | null;
    roleLabel?: string;
  },
  profileNames: Record<string, string>,
): string {
  const profileId = resolveMemberPermissionProfileId(member);
  if (profileId && profileNames[profileId]) return profileNames[profileId];
  if (member.roleLabel) return member.roleLabel;
  const fallback = ROLES.find((r) => r.key === member.roleKey);
  return fallback?.title ?? member.roleKey;
}
