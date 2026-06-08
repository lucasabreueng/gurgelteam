import { SETTINGS_USERS } from "@/lib/admin-settings-mocks";
import type { SettingsUserAccount } from "@/lib/contracts/settings";
import type { ModuleKey, RoleKey } from "@/lib/contracts/enums";
import { MODULE_KEYS } from "@/lib/contracts/enums";
import { ROLE_TO_PERMISSION_PROFILE } from "@/lib/settings/permission-profile-ids";
import type {
  SettingsUserApiDTO,
  UpdateUserPermissionsRequest,
} from "@/lib/contracts/api/v1/settings.api.schemas";
import { prisma } from "@/lib/server/prisma";
import {
  isBuiltInPermissionProfileId,
  isCustomPermissionProfileId,
  listCustomProfilesFromStore,
  readPermissionProfilesStore,
  resolveProfileDisplayName,
  writePermissionProfilesStore,
} from "@/lib/server/settings/permission-profile-store";
import { PERMISSION_PROFILE_TO_ROLE } from "@/lib/settings/permission-profile-ids";

export { ROLE_TO_PERMISSION_PROFILE } from "@/lib/settings/permission-profile-ids";

type UserWithPermissions = {
  id: string;
  roleKey: RoleKey;
  clientId: string | null;
  modulePermissions: {
    moduleKey: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }[];
};

const TEMPLATE_BY_ID = Object.fromEntries(
  SETTINGS_USERS.map((template) => [template.id, template]),
);

function emptyModules(): SettingsUserAccount["modules"] {
  return Object.fromEntries(
    MODULE_KEYS.map((key) => [
      key,
      { visualizar: false, editar: false, excluir: false },
    ]),
  ) as SettingsUserAccount["modules"];
}

function modulesFromTemplate(template: SettingsUserAccount): SettingsUserAccount["modules"] {
  return Object.fromEntries(
    MODULE_KEYS.map((key) => [key, { ...template.modules[key] }]),
  ) as SettingsUserAccount["modules"];
}

function hasPilotAreaAccess(user: UserWithPermissions): boolean {
  return user.modulePermissions.some(
    (p) => p.moduleKey.startsWith("piloto") && p.canView,
  );
}

function modulesToUpdateRequest(
  modules: SettingsUserAccount["modules"],
): UpdateUserPermissionsRequest["modules"] {
  return MODULE_KEYS.map((moduleKey) => ({
    moduleKey,
    canView: modules[moduleKey].visualizar,
    canEdit: modules[moduleKey].editar,
    canDelete: modules[moduleKey].excluir,
  }));
}

/** Associa cada perfil de permissões a usuários reais do banco (seed / contas ativas). */
export function userMatchesPermissionProfile(
  profileId: string,
  user: UserWithPermissions,
): boolean {
  switch (profileId) {
    case "user-administrador":
      return user.roleKey === "admin" && user.clientId === null;
    case "user-recepcao":
      return user.roleKey === "recepcao" && user.clientId === null;
    case "user-financeiro":
      return user.roleKey === "financeiro" && user.clientId === null;
    case "user-mecanico":
      return user.roleKey === "mecanico" && user.clientId === null;
    case "user-piloto":
      return user.clientId !== null && hasPilotAreaAccess(user);
    case "user-responsavel":
      return (
        user.clientId === null &&
        user.modulePermissions.some((p) => p.moduleKey === "alunos" && p.canView) &&
        hasPilotAreaAccess(user)
      );
    case "user-piloto-menor":
      return (
        user.clientId !== null &&
        hasPilotAreaAccess(user) &&
        !user.modulePermissions.some(
          (p) => p.moduleKey === "pilotoRanking" && p.canView,
        )
      );
    default:
      return false;
  }
}

function toApiDto(profileId: string, name: string, modules: SettingsUserAccount["modules"]): SettingsUserApiDTO {
  return {
    id: profileId,
    name,
    modules: MODULE_KEYS.map((moduleKey) => ({
      moduleKey,
      canView: modules[moduleKey].visualizar,
      canEdit: modules[moduleKey].editar,
      canDelete: modules[moduleKey].excluir,
    })),
  };
}

export async function getStaffRoleLabelsByKey(): Promise<Partial<Record<RoleKey, string>>> {
  const profiles = await listPermissionProfiles();
  const labels: Partial<Record<RoleKey, string>> = {};
  for (const profile of profiles) {
    const roleKey = PERMISSION_PROFILE_TO_ROLE[profile.id];
    if (roleKey) labels[roleKey] = profile.name;
  }
  return labels;
}

export async function listPermissionProfiles(): Promise<SettingsUserApiDTO[]> {
  const store = await readPermissionProfilesStore();

  const builtIn = SETTINGS_USERS.map((template) => {
    const modules = resolveBuiltInProfileModules(template.id, template, store);
    const name = resolveProfileDisplayName(template.id, template.name, store);
    return toApiDto(template.id, name, modules);
  });

  const custom = listCustomProfilesFromStore(store).map((account) =>
    toApiDto(account.id, account.name, account.modules),
  );

  return [...builtIn, ...custom];
}

async function applyPermissionsToUser(
  userId: string,
  data: UpdateUserPermissionsRequest,
): Promise<void> {
  await prisma.$transaction(
    data.modules.map((mod) =>
      prisma.modulePermission.upsert({
        where: {
          userId_moduleKey: { userId, moduleKey: mod.moduleKey },
        },
        update: {
          canView: mod.canView,
          canEdit: mod.canEdit,
          canDelete: mod.canDelete,
        },
        create: {
          userId,
          moduleKey: mod.moduleKey,
          canView: mod.canView,
          canEdit: mod.canEdit,
          canDelete: mod.canDelete,
        },
      }),
    ),
  );
}

function modulesFromUpdateRequest(
  data: UpdateUserPermissionsRequest,
): SettingsUserAccount["modules"] {
  const modules = emptyModules();
  for (const mod of data.modules) {
    const key = mod.moduleKey as ModuleKey;
    if (!(key in modules)) continue;
    modules[key] = {
      visualizar: mod.canView,
      editar: mod.canEdit,
      excluir: mod.canDelete,
    };
  }
  return modules;
}

function resolveBuiltInProfileModules(
  profileId: string,
  template: SettingsUserAccount,
  store: Awaited<ReturnType<typeof readPermissionProfilesStore>>,
): SettingsUserAccount["modules"] {
  const stored = store.modulesByProfileId?.[profileId];
  if (stored?.length) {
    return modulesFromUpdateRequest({ modules: stored });
  }
  return modulesFromTemplate(template);
}

async function persistProfileName(profileId: string, name?: string): Promise<void> {
  if (!name?.trim()) return;
  const store = await readPermissionProfilesStore();
  if (isBuiltInPermissionProfileId(profileId)) {
    const template = TEMPLATE_BY_ID[profileId];
    if (template && name.trim() === template.name) {
      delete store.nameByProfileId[profileId];
    } else {
      store.nameByProfileId[profileId] = name.trim();
    }
    await writePermissionProfilesStore(store);
    return;
  }

  if (isCustomPermissionProfileId(profileId)) {
    const custom = store.customProfiles.find((p) => p.id === profileId);
    if (custom) custom.name = name.trim();
    await writePermissionProfilesStore(store);
  }
}

export async function updatePermissionProfile(
  profileId: string,
  data: UpdateUserPermissionsRequest,
  displayName?: string,
): Promise<SettingsUserApiDTO> {
  const store = await readPermissionProfilesStore();

  if (isCustomPermissionProfileId(profileId)) {
    const modules = modulesFromUpdateRequest(data);
    const existing = store.customProfiles.find((p) => p.id === profileId);
    const name =
      displayName?.trim() ||
      data.name?.trim() ||
      existing?.name ||
      "Novo usuário";
    const nextModules = data.modules;
    if (existing) {
      existing.name = name;
      existing.modules = nextModules;
    } else {
      store.customProfiles.push({ id: profileId, name, modules: nextModules });
    }
    await writePermissionProfilesStore(store);
    return toApiDto(profileId, name, modules);
  }

  const template = TEMPLATE_BY_ID[profileId];
  if (!template) {
    throw new Error(`Perfil de permissões desconhecido: ${profileId}`);
  }

  const dbUsers = await prisma.user.findMany({
    where: { active: true },
    include: { modulePermissions: true },
  });

  const targets = dbUsers.filter((user) =>
    userMatchesPermissionProfile(profileId, user as UserWithPermissions),
  );

  for (const user of targets) {
    await applyPermissionsToUser(user.id, data);
  }

  const resolvedName = displayName?.trim() || data.name?.trim();
  await persistProfileName(profileId, resolvedName);

  store.modulesByProfileId = store.modulesByProfileId ?? {};
  store.modulesByProfileId[profileId] = data.modules;
  await writePermissionProfilesStore(store);

  const modules = modulesFromUpdateRequest(data);
  const name = resolvedName
    ? resolvedName
    : resolveProfileDisplayName(
        profileId,
        template.name,
        await readPermissionProfilesStore(),
      );

  return toApiDto(profileId, name, modules);
}

export function isPermissionProfileId(id: string): boolean {
  return id in TEMPLATE_BY_ID || isCustomPermissionProfileId(id);
}

export async function getPermissionProfileNameById(): Promise<
  Record<string, string>
> {
  const profiles = await listPermissionProfiles();
  return Object.fromEntries(profiles.map((p) => [p.id, p.name]));
}

export async function applyPermissionProfileById(
  userId: string,
  profileId: string,
): Promise<void> {
  if (!isPermissionProfileId(profileId)) {
    throw new Error(`Perfil de permissões desconhecido: ${profileId}`);
  }

  const store = await readPermissionProfilesStore();

  if (isCustomPermissionProfileId(profileId)) {
    const custom = store.customProfiles.find((p) => p.id === profileId);
    if (!custom) {
      throw new Error(`Perfil de permissões não encontrado: ${profileId}`);
    }
    await applyPermissionsToUser(userId, { modules: custom.modules });
    return;
  }

  const template = TEMPLATE_BY_ID[profileId];
  if (!template) {
    throw new Error(`Perfil de permissões não encontrado: ${profileId}`);
  }

  const stored = store.modulesByProfileId?.[profileId];
  if (stored?.length) {
    await applyPermissionsToUser(userId, { modules: stored });
    return;
  }

  await applyPermissionsToUser(userId, {
    modules: modulesToUpdateRequest(template.modules),
  });
}

export async function applyRolePermissionProfile(
  userId: string,
  roleKey: RoleKey,
): Promise<void> {
  const profileId = ROLE_TO_PERMISSION_PROFILE[roleKey];
  if (!profileId) return;
  await applyPermissionProfileById(userId, profileId);
}
