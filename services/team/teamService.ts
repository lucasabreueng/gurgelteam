import { getDataSourceMode } from "@/lib/data-source/mode";
import { TeamRepositoryHttp } from "@/repositories/team/TeamRepositoryHttp";
import { TeamRepositoryMock } from "@/repositories/team/TeamRepositoryMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

export function createTeamService() {
  return {
    getList: () =>
      isHttpMode()
        ? TeamRepositoryHttp.list()
        : TeamRepositoryMock.getList(),
    getKpis: () =>
      isHttpMode()
        ? TeamRepositoryHttp.getKpis()
        : TeamRepositoryMock.getKpis(),
    getRoleOptions: () => TeamRepositoryMock.getRoleOptions(),
    getStatusOptions: () => TeamRepositoryMock.getStatusOptions(),
    getTablePageSizes: () => TeamRepositoryMock.getTablePageSizes(),
    createMember: (input: {
      firstName: string;
      lastName: string;
      email: string;
      username: string;
      permissionProfileId: string;
      active: boolean;
    }) =>
      isHttpMode()
        ? TeamRepositoryHttp.create(input)
        : TeamRepositoryMock.create(input),
    updateMember: (
      id: string,
      patch: {
        permissionProfileId: string;
      },
    ) =>
      isHttpMode()
        ? TeamRepositoryHttp.update(id, patch)
        : TeamRepositoryMock.update(id, patch),
    removeMember: (id: string) =>
      isHttpMode()
        ? TeamRepositoryHttp.remove(id)
        : TeamRepositoryMock.remove(id),
  };
}

export type TeamService = ReturnType<typeof createTeamService>;
export const TeamServiceMock = createTeamService();
