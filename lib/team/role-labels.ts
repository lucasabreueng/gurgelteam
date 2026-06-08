import { ROLES } from "@/lib/admin-settings-mocks";
import type { RoleKey } from "@/lib/contracts/enums";

const ROLE_LABEL_BY_KEY = Object.fromEntries(
  ROLES.map((role) => [role.key, role.title]),
) as Record<RoleKey, string>;

export function resolveRoleLabel(roleKey: RoleKey): string {
  return ROLE_LABEL_BY_KEY[roleKey] ?? roleKey;
}

export const TEAM_AVATAR_BY_ROLE: Record<RoleKey, string> = {
  admin: "/images/team-1.png",
  recepcao: "/images/team-2.png",
  financeiro: "/images/team-3.png",
  mecanico: "/images/team-4.png",
};
