import type { SettingsUserAccount } from "@/lib/contracts/settings";

import type { ModuleKey } from "@/lib/contracts/enums";

import { MODULE_KEYS } from "@/lib/contracts/enums";

import type { SettingsUserApiDTO } from "@/lib/contracts/api/v1/settings.api.schemas";



function emptyPermissions(): SettingsUserAccount["modules"] {

  return Object.fromEntries(

    MODULE_KEYS.map((key) => [

      key,

      { visualizar: false, editar: false, excluir: false },

    ]),

  ) as SettingsUserAccount["modules"];

}



export function mapUserToSettingsAccount(

  user: {

    id: string;

    firstName: string;

    lastName: string;

    email: string;

    roleKey: string;

    modulePermissions: {

      moduleKey: string;

      canView: boolean;

      canEdit: boolean;

      canDelete: boolean;

    }[];

  },

): SettingsUserAccount {

  const modules = emptyPermissions();

  for (const perm of user.modulePermissions) {

    const key = perm.moduleKey as ModuleKey;

    if (!(key in modules)) continue;

    modules[key] = {

      visualizar: perm.canView,

      editar: perm.canEdit,

      excluir: perm.canDelete,

    };

  }



  return {

    id: user.id,

    name: `${user.firstName} ${user.lastName}`.trim(),

    modules,

  };

}



export function mapUserToApi(

  user: {

    id: string;

    firstName: string;

    lastName: string;

    email: string;

    roleKey: string;

    modulePermissions: {

      moduleKey: string;

      canView: boolean;

      canEdit: boolean;

      canDelete: boolean;

    }[];

  },

): SettingsUserApiDTO {

  return {

    id: user.id,

    name: `${user.firstName} ${user.lastName}`.trim(),

    email: user.email,

    roleKey: user.roleKey as SettingsUserApiDTO["roleKey"],

    modules: user.modulePermissions.map((p) => ({

      moduleKey: p.moduleKey as SettingsUserApiDTO["modules"][number]["moduleKey"],

      canView: p.canView,

      canEdit: p.canEdit,

      canDelete: p.canDelete,

    })),

  };

}

