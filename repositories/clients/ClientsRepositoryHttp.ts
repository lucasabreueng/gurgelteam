import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { mapClientListItemDtoToUi } from "@/lib/api/mappers/v1-mappers";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import { buildClientsKpisFromList } from "@/lib/clients/build-clients-kpis";
import type {
  ClientDetailDTO,
  ClientListItemDTO,
  ClientRankingsApiDTO,
} from "@/lib/contracts/api/v1/clients.api.schemas";
import type { EvolutionRankingEntry } from "@/lib/admin-clients-mocks";
import type { ClientListItem } from "@/lib/contracts/clients";
import type { NewClientFormData } from "@/components/admin/clients/new-client-drawer";
import { buildClientProfile } from "@/lib/admin-clients-mocks";
import type { ClientProfileDetail } from "@/lib/contracts/clients";
import {
  resolveCategoryIds,
  resolveSkillLevelId,
} from "@/lib/reference-data/resolve-reference-ids";

type PaginatedClients = {
  items: ClientListItemDTO[];
  meta: { page: number; pageSize: number; total: number; totalPages: number };
};

export const ClientsRepositoryHttp = {
  async getList(): Promise<ClientListItem[]> {
    const res = await apiFetch<PaginatedClients>(
      `${v1ApiPaths.clients.list}?page=1&pageSize=100`,
    );
    const data = unwrapApiResponse(res);
    return data.items.map((item) => mapClientListItemDtoToUi(item));
  },

  async getListItem(clientId: string): Promise<ClientListItem | null> {
    const res = await apiFetch<ClientDetailDTO>(
      v1ApiPaths.clients.byId(clientId),
    );
    if (!res.success) return null;
    const detail = res.data;
    if (!detail) return null;
    return mapClientListItemDtoToUi(detail, detail);
  },

  async getProfile(clientId: string): Promise<ClientProfileDetail | null> {
    const item = await ClientsRepositoryHttp.getListItem(clientId);
    if (!item) return null;
    return buildClientProfile(item);
  },

  async registerClient(data: NewClientFormData): Promise<ClientListItem> {
    const res = await apiFetch<ClientListItemDTO>(v1ApiPaths.clients.list, {
      method: "POST",
      body: JSON.stringify({
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email || undefined,
        phone: data.phone || undefined,
        skillLevelId: resolveSkillLevelId(data.levelId),
        categoryIds: resolveCategoryIds(data.categoryIds),
        isMinor: data.categoryIds.includes("mirim-cadete"),
        sendInvite: Boolean(data.email),
      }),
    });
    const created = unwrapApiResponse(res);
    return mapClientListItemDtoToUi(created);
  },

  async getKpis() {
    const list = await ClientsRepositoryHttp.getList();
    return buildClientsKpisFromList(list);
  },

  async getTimeline(clientId: string) {
    const res = await apiFetch<
      Array<{ id: string; type: string; label: string; at: string; status: string }>
    >(v1ApiPaths.clients.timeline(clientId));
    return unwrapApiResponse(res);
  },

  async getStats(clientId: string) {
    const res = await apiFetch<{
      clientId: string;
      bestLapMs: number | null;
      consistencyPct: number | null;
      totalSessions: number;
      validLapsCount: number;
    }>(v1ApiPaths.clients.stats(clientId));
    return unwrapApiResponse(res);
  },

  async getEvolutionRankings(): Promise<{
    evolution: EvolutionRankingEntry[];
    training: EvolutionRankingEntry[];
    laps: EvolutionRankingEntry[];
    consistency: EvolutionRankingEntry[];
  }> {
    const res = await apiFetch<ClientRankingsApiDTO>(v1ApiPaths.clients.rankings);
    return unwrapApiResponse(res);
  },

  async remove(clientId: string): Promise<void> {
    const res = await apiFetch<{ removed: boolean }>(
      v1ApiPaths.clients.byId(clientId),
      { method: "DELETE" },
    );
    unwrapApiResponse(res);
  },
};
