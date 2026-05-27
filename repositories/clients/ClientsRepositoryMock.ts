import * as clientsMocks from "@/lib/admin-clients-mocks";

export const ClientsRepositoryMock = {
  getFilterStatuses: () => clientsMocks.CLIENT_FILTER_STATUSES,
  getKartCategories: () => clientsMocks.CLIENT_KART_CATEGORIES,
  getSkillLevels: () => clientsMocks.CLIENT_SKILL_LEVELS,
  getKpis: () => clientsMocks.CLIENTS_KPIS,
  getList: () => clientsMocks.CLIENTS_LIST,
  getTablePageSizes: () => clientsMocks.CLIENT_TABLE_PAGE_SIZES,
  getEvolutionRankings: () => clientsMocks.EVOLUTION_RANKINGS,
  getProfile: clientsMocks.getClientProfile,
  getListItem: clientsMocks.getClientListItem,
  resolveCategoryNames: clientsMocks.resolveCategoryNames,
  resolveLevelName: clientsMocks.resolveLevelName,
};
