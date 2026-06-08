import {

  getTablePageSizes,

  getTeamKpis,

  getTeamMembers,

  getTeamRoleOptions,

  getTeamStatusOptions,

  registerTeamMember,

  removeTeamMember,

  updateTeamMember,

} from "@/lib/admin-team-mocks";

import type { CreateTeamMemberRequest } from "@/lib/contracts/api/v1/team.api.schemas";

import { isProtectedAdminMember } from "@/lib/team/team-rules";



export const TeamRepositoryMock = {

  getList: () => Promise.resolve(getTeamMembers()),

  getKpis: () => Promise.resolve(getTeamKpis()),

  getRoleOptions: () => getTeamRoleOptions(),

  getStatusOptions: () => getTeamStatusOptions(),

  getTablePageSizes: () => getTablePageSizes(),

  create: (input: CreateTeamMemberRequest) =>

    Promise.resolve(

      registerTeamMember({

        firstName: input.firstName,

        lastName: input.lastName,

        email: input.email,

        username: input.username,

        permissionProfileId: input.permissionProfileId,

        active: input.active,

      }),

    ),

  update: (id: string, patch: { permissionProfileId: string }) => {

    const current = getTeamMembers().find((m) => m.id === id);

    if (!current) return Promise.resolve(null);

    if (isProtectedAdminMember(current)) {

      return Promise.reject(

        new Error("O usuário administrador não pode ser editado."),

      );

    }



    return Promise.resolve(

      updateTeamMember(id, {

        permissionProfileId: patch.permissionProfileId,

      }),

    );

  },



  remove: (id: string) => {

    if (!removeTeamMember(id)) {

      return Promise.reject(

        new Error("O usuário administrador não pode ser removido."),

      );

    }

    return Promise.resolve();

  },

};

