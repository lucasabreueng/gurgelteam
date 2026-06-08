import * as clientsMocks from "@/lib/admin-clients-mocks";
import {
  getMergedClientsList,
  getRuntimeClientById,
  isClientRemoved,
  markClientRemoved,
} from "@/lib/clients-runtime-store";

export const ClientsRepositoryMock = {
  getFilterStatuses: () => clientsMocks.CLIENT_FILTER_STATUSES,
  getKartCategories: () => clientsMocks.CLIENT_KART_CATEGORIES,
  getSkillLevels: () => clientsMocks.CLIENT_SKILL_LEVELS,
  getKpis: () => clientsMocks.CLIENTS_KPIS,
  getList: () =>
    getMergedClientsList().filter((client) => !isClientRemoved(client.id)),
  getTablePageSizes: () => clientsMocks.CLIENT_TABLE_PAGE_SIZES,
  getEvolutionRankings: () => clientsMocks.EVOLUTION_RANKINGS,
  getProfile: clientsMocks.getClientProfile,
  getListItem: (clientId: string) => {
    if (isClientRemoved(clientId)) return null;
    return (
      getRuntimeClientById(clientId) ?? clientsMocks.getClientListItem(clientId)
    );
  },
  resolveCategoryNames: clientsMocks.resolveCategoryNames,
  resolveLevelName: clientsMocks.resolveLevelName,
  remove: (clientId: string) => {
    markClientRemoved(clientId);
    return Promise.resolve();
  },
};