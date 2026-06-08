import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { NavItemKey } from "@/lib/contracts/student-area";
import type { ModuleKey, RoleKey } from "@/lib/contracts/enums";
import { ADMIN_MODULE_KEYS } from "@/lib/contracts/enums";
import { ADMIN_NAV_TO_MODULE } from "@/lib/admin/admin-nav-modules";
import {
  PILOT_MODULE_KEYS,
  PILOT_NAV_TO_MODULE,
} from "@/lib/admin/pilot-nav-modules";

export type ModulePermissionSnapshot = {
  moduleKey: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

export function isStaffAdminFallback(
  roleKey: RoleKey,
  clientId: string | null | undefined,
): boolean {
  return roleKey === "admin" && clientId == null;
}

export function buildPermissionIndex(
  permissions: ModulePermissionSnapshot[],
): Map<string, ModulePermissionSnapshot> {
  return new Map(permissions.map((p) => [p.moduleKey, p]));
}

export function canViewModule(
  moduleKey: ModuleKey,
  permissions: Map<string, ModulePermissionSnapshot>,
  options?: { roleKey?: RoleKey; clientId?: string | null },
): boolean {
  if (
    options?.roleKey &&
    isStaffAdminFallback(options.roleKey, options.clientId)
  ) {
    return (ADMIN_MODULE_KEYS as readonly string[]).includes(moduleKey);
  }
  return permissions.get(moduleKey)?.canView === true;
}

export function canViewAdminNav(
  navKey: AdminNavKey,
  permissions: Map<string, ModulePermissionSnapshot>,
  options?: { roleKey?: RoleKey; clientId?: string | null },
): boolean {
  return canViewModule(ADMIN_NAV_TO_MODULE[navKey], permissions, options);
}

export function canEditModule(
  moduleKey: ModuleKey,
  permissions: Map<string, ModulePermissionSnapshot>,
  options?: { roleKey?: RoleKey; clientId?: string | null },
): boolean {
  if (
    options?.roleKey &&
    isStaffAdminFallback(options.roleKey, options.clientId)
  ) {
    return (ADMIN_MODULE_KEYS as readonly string[]).includes(moduleKey);
  }
  return permissions.get(moduleKey)?.canEdit === true;
}

export function canDeleteModule(
  moduleKey: ModuleKey,
  permissions: Map<string, ModulePermissionSnapshot>,
  options?: { roleKey?: RoleKey; clientId?: string | null },
): boolean {
  if (
    options?.roleKey &&
    isStaffAdminFallback(options.roleKey, options.clientId)
  ) {
    return (ADMIN_MODULE_KEYS as readonly string[]).includes(moduleKey);
  }
  return permissions.get(moduleKey)?.canDelete === true;
}

export function canViewPilotNav(
  navKey: NavItemKey,
  permissions: Map<string, ModulePermissionSnapshot>,
  options?: { clientId?: string | null },
): boolean {
  if (options?.clientId) return true;
  return permissions.get(PILOT_NAV_TO_MODULE[navKey])?.canView === true;
}

export function canAccessPilotArea(
  permissions: Map<string, ModulePermissionSnapshot>,
  options?: { clientId?: string | null },
): boolean {
  if (options?.clientId) return true;
  return PILOT_MODULE_KEYS.some(
    (moduleKey) => permissions.get(moduleKey)?.canView === true,
  );
}

export function canAccessAdminArea(
  permissions: Map<string, ModulePermissionSnapshot>,
  options?: { roleKey?: RoleKey; clientId?: string | null },
): boolean {
  if (
    options?.roleKey &&
    isStaffAdminFallback(options.roleKey, options.clientId)
  ) {
    return true;
  }
  return ADMIN_MODULE_KEYS.some((moduleKey) =>
    canViewModule(moduleKey, permissions, options),
  );
}
