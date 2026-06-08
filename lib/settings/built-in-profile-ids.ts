import { SETTINGS_USERS } from "@/lib/admin-settings-mocks";

const BUILT_IN_IDS = new Set(SETTINGS_USERS.map((u) => u.id));

export function isBuiltInPermissionProfileId(id: string): boolean {
  return BUILT_IN_IDS.has(id);
}
