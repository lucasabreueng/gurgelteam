import { getDataSourceMode } from "@/lib/data-source/mode";
import type { NewClientFormData } from "@/components/admin/clients/new-client-drawer";
import { ClientsRepositoryHttp } from "@/repositories/clients/ClientsRepositoryHttp";
import { ClientsRepositoryMock } from "@/repositories/clients/ClientsRepositoryMock";
import { ReferenceRepositoryHttp } from "@/repositories/reference/ReferenceRepositoryHttp";
import { OperationalServiceMock } from "@/services/operational/operationalServiceMock";

function isHttpMode(): boolean {
  return getDataSourceMode() === "http";
}

export function createClientsService() {
  return {
    getFilterStatuses: () => ClientsRepositoryMock.getFilterStatuses(),
    getKartCategories: () =>
      isHttpMode()
        ? ReferenceRepositoryHttp.getKartCategories()
        : Promise.resolve(ClientsRepositoryMock.getKartCategories()),
    getSkillLevels: () =>
      isHttpMode()
        ? ReferenceRepositoryHttp.getSkillLevels()
        : Promise.resolve(ClientsRepositoryMock.getSkillLevels()),
    getKpis: () =>
      isHttpMode()
        ? ClientsRepositoryHttp.getKpis()
        : Promise.resolve(ClientsRepositoryMock.getKpis()),
    getPageBundle: () =>
      isHttpMode()
        ? ClientsRepositoryHttp.getPageBundle()
        : Promise.resolve({
            list: ClientsRepositoryMock.getList(),
            kpis: ClientsRepositoryMock.getKpis(),
          }),
    getList: () =>
      isHttpMode()
        ? ClientsRepositoryHttp.getList()
        : Promise.resolve(ClientsRepositoryMock.getList()),
    getTablePageSizes: () => ClientsRepositoryMock.getTablePageSizes(),
    getEvolutionRankings: () =>
      isHttpMode()
        ? ClientsRepositoryHttp.getEvolutionRankings()
        : Promise.resolve(ClientsRepositoryMock.getEvolutionRankings()),
    getProfile: (clientId: string) =>
      isHttpMode()
        ? ClientsRepositoryHttp.getProfile(clientId)
        : Promise.resolve(ClientsRepositoryMock.getProfile(clientId)),
    getListItem: (clientId: string) =>
      isHttpMode()
        ? ClientsRepositoryHttp.getListItem(clientId)
        : Promise.resolve(ClientsRepositoryMock.getListItem(clientId)),
    resolveCategoryNames: ClientsRepositoryMock.resolveCategoryNames,
    resolveLevelName: ClientsRepositoryMock.resolveLevelName,
    registerClient: (data: NewClientFormData) =>
      isHttpMode()
        ? ClientsRepositoryHttp.registerClient(data)
        : Promise.resolve(OperationalServiceMock.registerClient(data)),
    getTimeline: (clientId: string) =>
      isHttpMode()
        ? ClientsRepositoryHttp.getTimeline(clientId)
        : Promise.resolve([]),
    getClientStats: (clientId: string) =>
      isHttpMode()
        ? ClientsRepositoryHttp.getStats(clientId)
        : Promise.resolve(null),
    removeClient: (clientId: string) =>
      isHttpMode()
        ? ClientsRepositoryHttp.remove(clientId)
        : ClientsRepositoryMock.remove(clientId),
  };
}

export type ClientsService = ReturnType<typeof createClientsService>;

export const ClientsServiceMock = createClientsService();
