import type { SettingsUserApiDTO, UpdateUserPermissionsRequest } from "@/lib/contracts/api/v1/settings.api.schemas";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";

import type { ApiError } from "@/lib/contracts/api/api-error";

import type { SettingsUserAccount } from "@/lib/contracts/settings";
import { MODULE_KEYS } from "@/lib/contracts/enums";
import type { ModuleKey } from "@/lib/contracts/enums";

import {
  isPermissionProfileId,
  listPermissionProfiles,
  updatePermissionProfile,
} from "@/lib/server/settings/permission-profiles";
import { syncPermissionProfilesState } from "@/lib/server/settings/permission-profile-store";

import { prisma } from "@/lib/server/prisma";

import { mapUserToApi } from "@/lib/server/settings/map-settings-user";



function notFoundUser(): ApiError {

  return {

    code: API_ERROR_CODES.NOT_FOUND,

    message: "Usuário não encontrado.",

    httpStatus: 404,

  };

}



export { mapUserToSettingsAccount, mapUserToApi } from "@/lib/server/settings/map-settings-user";



export const settingsUsersRepository = {

  async listUsers(): Promise<SettingsUserApiDTO[]> {

    return listPermissionProfiles();

  },



  async saveAllPermissionProfiles(
    users: SettingsUserAccount[],
  ): Promise<SettingsUserApiDTO[]> {
    await syncPermissionProfilesState(users);

    for (const user of users) {
      const payload: UpdateUserPermissionsRequest = {
        modules: MODULE_KEYS.map((moduleKey) => ({
          moduleKey,
          canView: user.modules[moduleKey as ModuleKey].visualizar,
          canEdit: user.modules[moduleKey as ModuleKey].editar,
          canDelete: user.modules[moduleKey as ModuleKey].excluir,
        })),
        name: user.name,
      };

      if (isPermissionProfileId(user.id)) {
        await updatePermissionProfile(user.id, payload);
        continue;
      }

      await this.updateUserPermissions(user.id, payload);
    }

    return listPermissionProfiles();
  },

  async updateUserPermissions(
    userId: string,
    data: UpdateUserPermissionsRequest,
  ): Promise<SettingsUserApiDTO> {
    if (isPermissionProfileId(userId)) {
      return updatePermissionProfile(userId, data, data.name?.trim());
    }



    const user = await prisma.user.findUnique({

      where: { id: userId },

      include: { modulePermissions: true },

    });

    if (!user) throw notFoundUser();



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



    const updated = await prisma.user.findUniqueOrThrow({

      where: { id: userId },

      include: { modulePermissions: true },

    });

    return mapUserToApi(updated);

  },

};

