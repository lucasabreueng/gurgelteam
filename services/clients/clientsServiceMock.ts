import { ClientsRepositoryMock } from "@/repositories/clients/ClientsRepositoryMock";

export const ClientsServiceMock = {
  getFilterStatuses: () => ClientsRepositoryMock.getFilterStatuses(),
  getKartCategories: () => ClientsRepositoryMock.getKartCategories(),
  getSkillLevels: () => ClientsRepositoryMock.getSkillLevels(),
  getKpis: () => ClientsRepositoryMock.getKpis(),
  getList: () => ClientsRepositoryMock.getList(),
  getTablePageSizes: () => ClientsRepositoryMock.getTablePageSizes(),
  getEvolutionRankings: () => ClientsRepositoryMock.getEvolutionRankings(),
  getProfile: ClientsRepositoryMock.getProfile,
  getListItem: ClientsRepositoryMock.getListItem,
  resolveCategoryNames: ClientsRepositoryMock.resolveCategoryNames,
  resolveLevelName: ClientsRepositoryMock.resolveLevelName,
};
