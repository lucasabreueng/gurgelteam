import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";



import {

  mapKartDtoToFleetItem,

  mapKartDtoToFleetSeed,

} from "@/lib/api/mappers/v1-mappers";



import { v1ApiPaths } from "@/lib/api/v1-api-paths";



import { buildKartsKpisFromFleet } from "@/lib/karts/build-karts-kpis";

import { mergeMaintenanceFleetKart } from "@/lib/karts/enrich-fleet-kart";



import type {

  CreateKartRequest,

  KartApiDTO,

  KartsPaddockApiDTO,

  UpdateKartRequest,

} from "@/lib/contracts/api/v1/karts.api.schemas";



import type { MaintenanceFleetKart } from "@/lib/contracts/maintenance/simple";



import type {

  FleetKartListItem,

  KartAlert,

  KartDetail,

  PaddockBox,

} from "@/lib/admin-karts-mocks";



async function fetchMaintenanceFleetMap(): Promise<Map<string, MaintenanceFleetKart>> {

  try {

    const res = await apiFetch<MaintenanceFleetKart[]>(v1ApiPaths.maintenance.fleet);

    if (!res.success || !res.data) return new Map();

    return new Map(res.data.map((kart) => [kart.id, kart]));

  } catch {

    return new Map();

  }

}



export const KartsRepositoryHttp = {

  async getFleet(): Promise<FleetKartListItem[]> {

    const [kartsRes, maintenanceMap] = await Promise.all([

      apiFetch<KartApiDTO[]>(v1ApiPaths.karts.list),

      fetchMaintenanceFleetMap(),

    ]);

    const data = unwrapApiResponse(kartsRes);

    return data.map((dto) => {

      const seed = mapKartDtoToFleetSeed(dto);

      const maintenance = maintenanceMap.get(dto.id);

      return maintenance

        ? mergeMaintenanceFleetKart(seed, maintenance)

        : mapKartDtoToFleetItem(dto);

    });

  },



  async getKpis() {

    const fleet = await KartsRepositoryHttp.getFleet();

    return buildKartsKpisFromFleet(fleet);

  },



  async getDetail(kartId: string): Promise<KartDetail | null> {

    const res = await apiFetch<KartDetail>(v1ApiPaths.karts.detail(kartId));

    if (!res.success) return null;

    return res.data ?? null;

  },



  async getPaddock(): Promise<{ alerts: KartAlert[]; boxes: PaddockBox[] }> {

    const res = await apiFetch<KartsPaddockApiDTO>(v1ApiPaths.karts.paddock);

    return unwrapApiResponse(res);

  },



  async createKart(payload: CreateKartRequest): Promise<KartApiDTO> {

    const res = await apiFetch<KartApiDTO>(v1ApiPaths.karts.list, {

      method: "POST",

      body: JSON.stringify(payload),

    });

    return unwrapApiResponse(res);

  },



  async updateKart(

    kartId: string,

    payload: UpdateKartRequest,

  ): Promise<KartApiDTO> {

    const res = await apiFetch<KartApiDTO>(v1ApiPaths.karts.byId(kartId), {

      method: "PUT",

      body: JSON.stringify(payload),

    });

    return unwrapApiResponse(res);

  },



  async removeKart(kartId: string): Promise<void> {

    const res = await apiFetch<{ ok: boolean }>(v1ApiPaths.karts.byId(kartId), {

      method: "DELETE",

    });

    unwrapApiResponse(res);

  },

};

