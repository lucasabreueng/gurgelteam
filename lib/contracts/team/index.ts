import type { RoleKey } from "@/lib/contracts/enums";

export type TeamMemberListItem = {
  id: string;
  name: string;
  email: string;
  username: string;
  roleKey: RoleKey;
  permissionProfileId?: string | null;
  roleLabel: string;
  active: boolean;
  createdAtLabel: string;
  avatar: string | null;
};

export type TeamKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
};
