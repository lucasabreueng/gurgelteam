"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { SETTINGS_USERS } from "@/lib/admin-settings-mocks";
import {
  buildPermissionIndex,
  canAccessAdminArea,
  canAccessPilotArea,
  canDeleteModule as checkDeleteModule,
  canEditModule as checkEditModule,
  canViewAdminNav,
  canViewModule,
  canViewPilotNav,
  isStaffAdminFallback,
  type ModulePermissionSnapshot,
} from "@/lib/admin/admin-permissions";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { NavItemKey } from "@/lib/contracts/student-area";
import type { ModuleKey } from "@/lib/contracts/enums";
import { MODULE_KEYS } from "@/lib/contracts/enums";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { queryKeys } from "@/lib/query/keys";
import { AuthRepositoryHttp } from "@/repositories/auth/AuthRepositoryHttp";

function buildMockPermissions(templateId: string): ModulePermissionSnapshot[] {
  const template =
    SETTINGS_USERS.find((u) => u.id === templateId) ??
    SETTINGS_USERS.find((u) => u.id === "user-administrador")!;
  return MODULE_KEYS.map((moduleKey) => ({
    moduleKey,
    canView: template.modules[moduleKey].visualizar,
    canEdit: template.modules[moduleKey].editar,
    canDelete: template.modules[moduleKey].excluir,
  }));
}

function useSessionPermissionState(mockTemplateId: string) {
  const isHttpMode = getDataSourceMode() === "http";

  const { data, isPending, isFetching, isError } = useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: () => AuthRepositoryHttp.getSession(),
    enabled: isHttpMode,
    staleTime: 60_000,
    retry: 1,
  });

  const permissionIndex = useMemo(() => {
    if (!isHttpMode) {
      return buildPermissionIndex(buildMockPermissions(mockTemplateId));
    }
    return buildPermissionIndex(data?.modulePermissions ?? []);
  }, [isHttpMode, data?.modulePermissions, mockTemplateId]);

  const roleKey = data?.user?.roleKey;
  const clientId = data?.user?.clientId ?? null;
  const accessOptions = { roleKey, clientId };

  const sessionLoading =
    isHttpMode && (isPending || isFetching || (!data && !isError));

  return {
    isHttpMode,
    isPending: sessionLoading,
    isSessionError: isHttpMode && isError && !data,
    permissionIndex,
    accessOptions,
    isAdminFallback: Boolean(
      roleKey && isStaffAdminFallback(roleKey, clientId),
    ),
  };
}

export function useAdminPermissions() {
  const state = useSessionPermissionState("user-administrador");

  return {
    isPending: state.isPending,
    isSessionError: state.isSessionError,
    permissionIndex: state.permissionIndex,
    canAccessArea: () =>
      canAccessAdminArea(state.permissionIndex, state.accessOptions),
    canViewNav: (navKey: AdminNavKey) =>
      canViewAdminNav(navKey, state.permissionIndex, state.accessOptions),
    canViewModule: (moduleKey: ModuleKey) =>
      canViewModule(moduleKey, state.permissionIndex, state.accessOptions),
    canEditModule: (moduleKey: ModuleKey) =>
      checkEditModule(moduleKey, state.permissionIndex, state.accessOptions),
    canDeleteModule: (moduleKey: ModuleKey) =>
      checkDeleteModule(moduleKey, state.permissionIndex, state.accessOptions),
  };
}

export function usePilotPermissions() {
  const state = useSessionPermissionState("user-piloto");

  return {
    isPending: state.isPending,
    isSessionError: state.isSessionError,
    canAccessArea: () =>
      canAccessPilotArea(state.permissionIndex, {
        clientId: state.accessOptions.clientId,
      }),
    canViewNav: (navKey: NavItemKey) =>
      canViewPilotNav(navKey, state.permissionIndex, {
        clientId: state.accessOptions.clientId,
      }),
    canViewModule: (moduleKey: ModuleKey) =>
      canViewModule(moduleKey, state.permissionIndex, state.accessOptions),
    canEditModule: (moduleKey: ModuleKey) =>
      checkEditModule(moduleKey, state.permissionIndex, state.accessOptions),
    canDeleteModule: (moduleKey: ModuleKey) =>
      checkDeleteModule(moduleKey, state.permissionIndex, state.accessOptions),
  };
}

export function useModuleAccess(moduleKey: ModuleKey) {
  const { canViewModule, canEditModule, canDeleteModule, isPending } =
    useAdminPermissions();

  return {
    isPending,
    canView: canViewModule(moduleKey),
    canEdit: canEditModule(moduleKey),
    canDelete: canDeleteModule(moduleKey),
  };
}
