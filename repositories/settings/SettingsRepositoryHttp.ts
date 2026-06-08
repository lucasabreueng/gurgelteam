import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type {
  AppearanceSettingsApiDTO,
  IntegrationItemApiDTO,
  OrganizationSettingsApiDTO,
  PermissionProfileAssigneeDTO,
  PermissionProfileAssigneesResponseDTO,
  SettingsCatalogApiDTO,
  SettingsUserApiDTO,
  TermsRegistryApiDTO,
  UpdateUserPermissionsRequest,
} from "@/lib/contracts/api/v1/settings.api.schemas";
import type {
  DocumentTemplate,
  NotificationEvent,
} from "@/lib/contracts/settings";
import type { SettingsUserAccount } from "@/lib/contracts/settings";
import type { ModuleKey } from "@/lib/contracts/enums";
import { MODULE_KEYS } from "@/lib/contracts/enums";

function mapApiUserToSettingsAccount(
  dto: SettingsUserApiDTO,
): SettingsUserAccount {
  const modules = Object.fromEntries(
    MODULE_KEYS.map((key) => [
      key,
      { visualizar: false, editar: false, excluir: false },
    ]),
  ) as SettingsUserAccount["modules"];

  for (const mod of dto.modules) {
    const key = mod.moduleKey as ModuleKey;
    if (!(key in modules)) continue;
    modules[key] = {
      visualizar: mod.canView,
      editar: mod.canEdit,
      excluir: mod.canDelete,
    };
  }

  return { id: dto.id, name: dto.name, modules };
}

function mapSettingsAccountToApi(
  user: SettingsUserAccount,
): UpdateUserPermissionsRequest {
  return {
    name: user.name,
    modules: MODULE_KEYS.map((moduleKey) => ({
      moduleKey,
      canView: user.modules[moduleKey].visualizar,
      canEdit: user.modules[moduleKey].editar,
      canDelete: user.modules[moduleKey].excluir,
    })),
  };
}

export const SettingsRepositoryHttp = {
  async getOrganization(): Promise<OrganizationSettingsApiDTO> {
    const res = await apiFetch<OrganizationSettingsApiDTO>(
      v1ApiPaths.settings.organization,
    );
    return unwrapApiResponse(res);
  },

  async updateOrganization(
    data: Partial<OrganizationSettingsApiDTO>,
  ): Promise<OrganizationSettingsApiDTO> {
    const res = await apiFetch<OrganizationSettingsApiDTO>(
      v1ApiPaths.settings.organization,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
    return unwrapApiResponse(res);
  },

  async listUsers(): Promise<SettingsUserAccount[]> {
    const res = await apiFetch<SettingsUserApiDTO[]>(v1ApiPaths.settings.users);
    return unwrapApiResponse(res).map(mapApiUserToSettingsAccount);
  },

  async listProfileAssignees(
    profileId: string,
  ): Promise<PermissionProfileAssigneeDTO[]> {
    const res = await apiFetch<PermissionProfileAssigneesResponseDTO>(
      v1ApiPaths.settings.profileAssignees(profileId),
    );
    return unwrapApiResponse(res).assignees;
  },

  async updateUserPermissions(
    user: SettingsUserAccount,
  ): Promise<SettingsUserAccount> {
    const res = await apiFetch<SettingsUserApiDTO>(
      v1ApiPaths.settings.userPermissions(user.id),
      {
        method: "PUT",
        body: JSON.stringify(mapSettingsAccountToApi(user)),
      },
    );
    return mapApiUserToSettingsAccount(unwrapApiResponse(res));
  },

  async saveAllPermissionProfiles(
    users: SettingsUserAccount[],
  ): Promise<SettingsUserAccount[]> {
    const res = await apiFetch<SettingsUserApiDTO[]>(v1ApiPaths.settings.users, {
      method: "PUT",
      body: JSON.stringify({
        users: users.map((user) => ({
          id: user.id,
          name: user.name,
          modules: mapSettingsAccountToApi(user).modules,
        })),
      }),
    });
    return unwrapApiResponse(res).map(mapApiUserToSettingsAccount);
  },

  async getCatalog(): Promise<SettingsCatalogApiDTO> {
    const res = await apiFetch<SettingsCatalogApiDTO>(
      v1ApiPaths.settings.catalog,
    );
    return unwrapApiResponse(res);
  },

  async replaceCatalog(
    payload: SettingsCatalogApiDTO,
  ): Promise<SettingsCatalogApiDTO> {
    const res = await apiFetch<SettingsCatalogApiDTO>(
      v1ApiPaths.settings.catalog,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );
    return unwrapApiResponse(res);
  },

  async getNotificationEvents(): Promise<NotificationEvent[]> {
    const res = await apiFetch<NotificationEvent[]>(
      v1ApiPaths.settings.notifications,
    );
    return unwrapApiResponse(res);
  },

  async replaceNotificationEvents(
    events: NotificationEvent[],
  ): Promise<NotificationEvent[]> {
    const res = await apiFetch<NotificationEvent[]>(
      v1ApiPaths.settings.notifications,
      {
        method: "PUT",
        body: JSON.stringify({ events }),
      },
    );
    return unwrapApiResponse(res);
  },

  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    const res = await apiFetch<DocumentTemplate[]>(
      v1ApiPaths.settings.documents,
    );
    return unwrapApiResponse(res);
  },

  async replaceDocumentTemplates(
    documents: DocumentTemplate[],
  ): Promise<DocumentTemplate[]> {
    const res = await apiFetch<DocumentTemplate[]>(
      v1ApiPaths.settings.documents,
      {
        method: "PUT",
        body: JSON.stringify({ documents }),
      },
    );
    return unwrapApiResponse(res);
  },

  async getTermsRegistry(): Promise<TermsRegistryApiDTO> {
    const res = await apiFetch<TermsRegistryApiDTO>(
      v1ApiPaths.settings.termsRegistry,
    );
    return unwrapApiResponse(res);
  },

  async replaceTermsRegistry(
    registry: TermsRegistryApiDTO,
  ): Promise<TermsRegistryApiDTO> {
    const res = await apiFetch<TermsRegistryApiDTO>(
      v1ApiPaths.settings.termsRegistry,
      {
        method: "PUT",
        body: JSON.stringify(registry),
      },
    );
    return unwrapApiResponse(res);
  },

  async getIntegrations(): Promise<IntegrationItemApiDTO[]> {
    const res = await apiFetch<IntegrationItemApiDTO[]>(
      v1ApiPaths.settings.integrations,
    );
    return unwrapApiResponse(res);
  },

  async replaceIntegrations(
    integrations: IntegrationItemApiDTO[],
  ): Promise<IntegrationItemApiDTO[]> {
    const res = await apiFetch<IntegrationItemApiDTO[]>(
      v1ApiPaths.settings.integrations,
      {
        method: "PUT",
        body: JSON.stringify({ integrations }),
      },
    );
    return unwrapApiResponse(res);
  },

  async getAppearance(): Promise<AppearanceSettingsApiDTO> {
    const res = await apiFetch<AppearanceSettingsApiDTO>(
      v1ApiPaths.settings.appearance,
    );
    return unwrapApiResponse(res);
  },

  async replaceAppearance(
    appearance: AppearanceSettingsApiDTO,
  ): Promise<AppearanceSettingsApiDTO> {
    const res = await apiFetch<AppearanceSettingsApiDTO>(
      v1ApiPaths.settings.appearance,
      {
        method: "PUT",
        body: JSON.stringify(appearance),
      },
    );
    return unwrapApiResponse(res);
  },

  async getSecurityCards(): Promise<
    { id: string; title: string; description: string }[]
  > {
    const res = await apiFetch<{
      cards: { id: string; title: string; description: string }[];
    }>(v1ApiPaths.settings.security);
    return unwrapApiResponse(res).cards;
  },
};
