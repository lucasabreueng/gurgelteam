import {
  mapKartDtoToFleetItem,
  mapKartDtoToFleetSeed,
} from "@/lib/api/mappers/v1-mappers";
import type { FleetKartListItem, KartKpi } from "@/lib/admin-karts-mocks";
import { mergeMaintenanceFleetKart } from "@/lib/karts/enrich-fleet-kart";
import { buildKartsKpisFromFleet } from "@/lib/karts/build-karts-kpis";
import { kartsRepository } from "@/lib/server/karts/karts-repository";
import { buildMaintenanceFleetFromDb } from "@/lib/server/maintenance/build-maintenance-fleet";

export type KartsPageData = {
  fleet: FleetKartListItem[];
  kpis: KartKpi[];
};

export async function loadKartsPageData(): Promise<KartsPageData> {
  const [dtos, maintenanceFleet] = await Promise.all([
    kartsRepository.list({ status: "" }),
    buildMaintenanceFleetFromDb(),
  ]);

  const maintenanceById = new Map(
    maintenanceFleet.map((kart) => [kart.id, kart]),
  );

  const fleet = dtos.map((dto) => {
    const maintenance = maintenanceById.get(dto.id);
    if (maintenance) {
      return mergeMaintenanceFleetKart(mapKartDtoToFleetSeed(dto), maintenance);
    }
    return mapKartDtoToFleetItem(dto);
  });

  return {
    fleet,
    kpis: buildKartsKpisFromFleet(fleet),
  };
}
