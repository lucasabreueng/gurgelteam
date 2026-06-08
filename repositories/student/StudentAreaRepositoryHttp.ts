import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type {
  PilotAchievementsApiDTO,
  PilotEvolutionApiDTO,
} from "@/lib/contracts/api/v1/pilot.api.schemas";
import type { PilotHomeApiDTO } from "@/lib/server/pilot/build-pilot-home";
import type { Achievement, EvolutionLapPoint } from "@/lib/student-area-mocks";

export const StudentAreaRepositoryHttp = {
  async getHome(): Promise<PilotHomeApiDTO> {
    const res = await apiFetch<PilotHomeApiDTO>(v1ApiPaths.pilot.home);
    return unwrapApiResponse(res);
  },
  async getEvolutionLapSeries(): Promise<readonly EvolutionLapPoint[]> {
    const res = await apiFetch<PilotEvolutionApiDTO>(v1ApiPaths.pilot.evolution);
    const data = unwrapApiResponse(res);
    return data.lapSeries;
  },

  async getEvolutionGoal() {
    const res = await apiFetch<PilotEvolutionApiDTO>(v1ApiPaths.pilot.evolution);
    const data = unwrapApiResponse(res);
    return data.goal;
  },

  async getAchievements(): Promise<Achievement[]> {
    const res = await apiFetch<PilotAchievementsApiDTO>(
      v1ApiPaths.pilot.achievements,
    );
    return unwrapApiResponse(res).achievements;
  },
};
