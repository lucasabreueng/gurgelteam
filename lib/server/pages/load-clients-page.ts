import { mapClientListItemDtoToUi } from "@/lib/api/mappers/v1-mappers";
import type { ClientKpi } from "@/lib/admin-clients-mocks";
import { buildClientsKpisFromList } from "@/lib/clients/build-clients-kpis";
import type { ClientListItem } from "@/lib/contracts/clients";
import { clientsRepository } from "@/lib/server/clients/clients-repository";

export type ClientsPageData = {
  list: ClientListItem[];
  kpis: ClientKpi[];
};

export async function loadClientsPageData(): Promise<ClientsPageData> {
  const { items } = await clientsRepository.list({
    query: "",
    status: "",
    page: 1,
    pageSize: 100,
  });

  const list = items.map((item) => mapClientListItemDtoToUi(item));
  return {
    list,
    kpis: buildClientsKpisFromList(list),
  };
}
