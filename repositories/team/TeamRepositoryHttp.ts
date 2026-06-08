import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type {
  CreateTeamMemberRequest,
  TeamMemberApiDTO,
  UpdateTeamMemberRequest,
} from "@/lib/contracts/api/v1/team.api.schemas";
import type { TeamKpi, TeamMemberListItem } from "@/lib/contracts/team";

function mapDto(row: TeamMemberApiDTO): TeamMemberListItem {
  return { ...row };
}

export const TeamRepositoryHttp = {
  async list(): Promise<TeamMemberListItem[]> {
    const res = await apiFetch<TeamMemberApiDTO[]>(
      `${v1ApiPaths.team.list}?page=1`,
    );
    return unwrapApiResponse(res).map(mapDto);
  },

  async getKpis(): Promise<TeamKpi[]> {
    const res = await apiFetch<TeamKpi[]>(v1ApiPaths.team.kpis);
    return unwrapApiResponse(res);
  },

  async create(data: CreateTeamMemberRequest): Promise<TeamMemberListItem> {
    const res = await apiFetch<TeamMemberApiDTO>(v1ApiPaths.team.list, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return mapDto(unwrapApiResponse(res));
  },

  async update(
    userId: string,
    data: UpdateTeamMemberRequest,
  ): Promise<TeamMemberListItem> {
    const res = await apiFetch<TeamMemberApiDTO>(v1ApiPaths.team.byId(userId), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return mapDto(unwrapApiResponse(res));
  },

  async remove(userId: string): Promise<void> {
    const res = await apiFetch<{ removed: boolean }>(
      v1ApiPaths.team.byId(userId),
      { method: "DELETE" },
    );
    unwrapApiResponse(res);
  },
};
