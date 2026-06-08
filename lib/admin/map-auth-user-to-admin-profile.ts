import { ROLES } from "@/lib/admin-settings-mocks";
import { ADMIN_PROFILE } from "@/lib/admin-dashboard-mocks";
import type { AuthUserDTO } from "@/lib/contracts/api/v1/auth.api.schemas";
import type { RoleKey } from "@/lib/contracts/enums";

export type AdminHeaderProfile = {
  name: string;
  role: string;
  avatar: string;
};

export function mapAuthUserToAdminProfile(user: AuthUserDTO): AdminHeaderProfile {
  const name = `${user.firstName} ${user.lastName}`.trim() || user.username;
  const role =
    ROLES.find((r) => r.key === (user.roleKey as RoleKey))?.title ?? user.roleKey;
  return {
    name,
    role,
    avatar: ADMIN_PROFILE.avatar,
  };
}
