import type { MaintenanceFleetKart } from "@/lib/contracts/maintenance/simple";
import {
  buildMaintenanceFleetKart,
  type BuildMaintenanceFleetKartInput,
} from "@/lib/maintenance/build-maintenance-fleet-kart";
import { mapLegacyOperationalToFleetStatus } from "@/lib/maintenance/map-fleet-status";

/** Garante formato atual mesmo com cache legado do React Query. */
export function normalizeMaintenanceFleetKart(
  kart: Partial<MaintenanceFleetKart> & Pick<MaintenanceFleetKart, "id" | "number" | "photo">,
): MaintenanceFleetKart {
  if (kart.preventiveMaintenance?.mostUrgent) {
    return kart as MaintenanceFleetKart;
  }

  const legacy = kart as Partial<MaintenanceFleetKart> & {
    nextRevision?: string;
    status?: string;
  };

  const legacyStatus = String(legacy.status ?? "");

  const input: BuildMaintenanceFleetKartInput = {
    id: kart.id,
    number: kart.number,
    photo: kart.photo,
    status:
      legacyStatus === "operacional" ||
      legacyStatus === "atencao" ||
      legacyStatus === "em_manutencao" ||
      legacyStatus === "indisponivel"
        ? mapLegacyOperationalToFleetStatus(legacyStatus)
        : (legacy.status ?? "disponivel"),
    engineHours: kart.engineHours ?? 0,
    preventiveMaintenanceHours: null,
    lastInspection: kart.lastInspection ?? "—",
    lastMaintenance: kart.lastMaintenance ?? "—",
    monthlyCostCents: kart.monthlyCostCents ?? 0,
    correctiveMaintenance: kart.correctiveMaintenance,
  };

  const built = buildMaintenanceFleetKart(input);
  if (legacy.nextRevision && legacy.nextRevision !== "—") {
    return {
      ...built,
      preventiveMaintenance: {
        ...built.preventiveMaintenance,
        mostUrgent: {
          ...built.preventiveMaintenance.mostUrgent,
          displayLabel: legacy.nextRevision,
        },
      },
    };
  }
  return built;
}

export function normalizeMaintenanceFleet(
  fleet: MaintenanceFleetKart[] | undefined,
): MaintenanceFleetKart[] {
  if (!fleet?.length) return [];
  return fleet.map((kart) => normalizeMaintenanceFleetKart(kart));
}
