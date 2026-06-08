import type { ModuleKey } from "@/lib/contracts/enums";
import { MODULE_KEYS } from "@/lib/contracts/enums";
import type { SettingsUserAccount } from "@/lib/contracts/settings";
import type { UpdateUserPermissionsRequest } from "@/lib/contracts/api/v1/settings.api.schemas";
import { Prisma } from "@prisma/client";
import { SETTINGS_USERS } from "@/lib/admin-settings-mocks";
import { prisma } from "@/lib/server/prisma";

function isPermissionProfilesSchemaMismatch(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientValidationError &&
    String(error.message).includes("permissionProfiles")
  );
}

export type StoredCustomProfile = {
  id: string;
  name: string;
  modules: UpdateUserPermissionsRequest["modules"];
};

export type PermissionProfilesStore = {
  nameByProfileId: Record<string, string>;
  /** Overrides de módulos para perfis built-in (persistidos ao salvar na aba Configurações). */
  modulesByProfileId?: Record<string, UpdateUserPermissionsRequest["modules"]>;
  customProfiles: StoredCustomProfile[];
};

const EMPTY_STORE: PermissionProfilesStore = {
  nameByProfileId: {},
  modulesByProfileId: {},
  customProfiles: [],
};

const BUILT_IN_IDS = new Set(SETTINGS_USERS.map((u) => u.id));

function parseStore(raw: unknown): PermissionProfilesStore {
  if (!raw || typeof raw !== "object") return { ...EMPTY_STORE };
  const obj = raw as Record<string, unknown>;
  const nameByProfileId =
    obj.nameByProfileId && typeof obj.nameByProfileId === "object"
      ? (obj.nameByProfileId as Record<string, string>)
      : {};
  const customProfiles = Array.isArray(obj.customProfiles)
    ? (obj.customProfiles as StoredCustomProfile[]).filter(
        (p) => typeof p.id === "string" && typeof p.name === "string" && Array.isArray(p.modules),
      )
    : [];
  const modulesByProfileId =
    obj.modulesByProfileId && typeof obj.modulesByProfileId === "object"
      ? (obj.modulesByProfileId as Record<
          string,
          UpdateUserPermissionsRequest["modules"]
        >)
      : {};
  return { nameByProfileId, modulesByProfileId, customProfiles };
}

export async function readPermissionProfilesStore(): Promise<PermissionProfilesStore> {
  try {
    const row = await prisma.organizationSettings.findUnique({
      where: { id: "default" },
      select: { permissionProfiles: true },
    });
    return parseStore(row?.permissionProfiles ?? EMPTY_STORE);
  } catch (error) {
    if (isPermissionProfilesSchemaMismatch(error)) {
      return { ...EMPTY_STORE };
    }
    throw error;
  }
}

export async function writePermissionProfilesStore(
  store: PermissionProfilesStore,
): Promise<void> {
  try {
    await prisma.organizationSettings.upsert({
      where: { id: "default" },
      update: { permissionProfiles: store as object },
      create: {
        id: "default",
        teamName: "Gurgel Team",
        permissionProfiles: store as object,
      },
    });
  } catch (error) {
    if (isPermissionProfilesSchemaMismatch(error)) {
      console.warn(
        "[permission-profiles] Campo permission_profiles indisponível. Rode: npx prisma db push && npx prisma generate",
      );
      return;
    }
    throw error;
  }
}

export function isBuiltInPermissionProfileId(id: string): boolean {
  return BUILT_IN_IDS.has(id);
}

export function isCustomPermissionProfileId(id: string): boolean {
  return id.startsWith("user-") && !BUILT_IN_IDS.has(id);
}

function modulesFromAccount(
  user: SettingsUserAccount,
): UpdateUserPermissionsRequest["modules"] {
  return MODULE_KEYS.map((moduleKey) => ({
    moduleKey,
    canView: user.modules[moduleKey].visualizar,
    canEdit: user.modules[moduleKey].editar,
    canDelete: user.modules[moduleKey].excluir,
  }));
}

/** Sincroniza nomes (perfis padrão) e perfis customizados com o estado da aba Configurações. */
export async function syncPermissionProfilesState(
  users: SettingsUserAccount[],
): Promise<void> {
  const nameByProfileId: Record<string, string> = {};

  for (const user of users) {
    if (!isBuiltInPermissionProfileId(user.id)) continue;
    const template = SETTINGS_USERS.find((t) => t.id === user.id);
    if (!template) continue;
    if (user.name.trim() && user.name.trim() !== template.name) {
      nameByProfileId[user.id] = user.name.trim();
    }
  }

  const customProfiles: StoredCustomProfile[] = users
    .filter((u) => !isBuiltInPermissionProfileId(u.id))
    .map((u) => ({
      id: u.id,
      name: u.name.trim() || "Novo usuário",
      modules: modulesFromAccount(u),
    }));

  await writePermissionProfilesStore({
    nameByProfileId,
    customProfiles,
  });
}

export function resolveProfileDisplayName(
  profileId: string,
  defaultName: string,
  store: PermissionProfilesStore,
): string {
  return store.nameByProfileId[profileId]?.trim() || defaultName;
}

export function listCustomProfilesFromStore(
  store: PermissionProfilesStore,
): SettingsUserAccount[] {
  return store.customProfiles.map((profile) => {
    const modules = Object.fromEntries(
      MODULE_KEYS.map((key) => [
        key,
        { visualizar: false, editar: false, excluir: false },
      ]),
    ) as SettingsUserAccount["modules"];

    for (const mod of profile.modules) {
      const key = mod.moduleKey as ModuleKey;
      if (!(key in modules)) continue;
      modules[key] = {
        visualizar: mod.canView,
        editar: mod.canEdit,
        excluir: mod.canDelete,
      };
    }

    return {
      id: profile.id,
      name: profile.name,
      modules,
    };
  });
}
