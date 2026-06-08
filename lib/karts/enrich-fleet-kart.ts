import type { FleetKartListItem } from "@/lib/admin-karts-mocks";
import type { KartStatus } from "@/lib/contracts/enums";
import type { MaintenanceFleetKart } from "@/lib/contracts/maintenance/simple";
import {
  buildCorrectiveMaintenanceSummary,
  buildMaintenanceFleetKart,
} from "@/lib/maintenance/build-maintenance-fleet-kart";
import type { PreventiveMaintenanceHoursState } from "@/lib/maintenance/preventive-maintenance";

const MOCK_PREVENTIVE_HOURS: Record<string, PreventiveMaintenanceHoursState> = {
  k05: { oleo: 410, corrente: 400, coroa_pinhao: 390, revisao_motor: 400, rolamentos: 380, cabo_acelerador: 400 },
  k07: { oleo: 525, corrente: 520, coroa_pinhao: 510, revisao_motor: 500, rolamentos: 490, cabo_acelerador: 510 },
  k12: { oleo: 688, corrente: 680, coroa_pinhao: 660, revisao_motor: 650, rolamentos: 640, cabo_acelerador: 670 },
  k17: { oleo: 598, corrente: 580, coroa_pinhao: 570, revisao_motor: 550, rolamentos: 560, cabo_acelerador: 580 },
  k03: { oleo: 150, corrente: 140, coroa_pinhao: 130, revisao_motor: 120, rolamentos: 110, cabo_acelerador: 136 },
};

const MOCK_CORRECTIVE: Record<
  string,
  Parameters<typeof buildCorrectiveMaintenanceSummary>[0]
> = {
  k03: { openChecklistLabel: "Checklist — Revisão periódica" },
  k12: { openOrderLabel: "Corretiva — Troca de corrente" },
};

export type FleetKartSeed = Omit<
  FleetKartListItem,
  "fleetStatus" | "preventiveMaintenance" | "correctiveMaintenance"
> & {
  preventiveMaintenanceHours?: PreventiveMaintenanceHoursState | null;
};

export function enrichFleetKartListItem(kart: FleetKartSeed): FleetKartListItem {
  const maintenance = buildMaintenanceFleetKart({
    id: kart.id,
    number: kart.number,
    photo: kart.photo,
    status: kart.status,
    engineHours: kart.usageHours,
    preventiveMaintenanceHours:
      kart.preventiveMaintenanceHours ??
      MOCK_PREVENTIVE_HOURS[kart.id] ??
      null,
    correctiveMaintenance: buildCorrectiveMaintenanceSummary(
      MOCK_CORRECTIVE[kart.id] ?? {},
    ),
  });

  const { mostUrgent } = maintenance.preventiveMaintenance;

  return {
    ...kart,
    fleetStatus: maintenance.status,
    preventiveMaintenance: maintenance.preventiveMaintenance,
    correctiveMaintenance: maintenance.correctiveMaintenance,
    nextMaintenance: mostUrgent.displayLabel,
    nextMaintenanceDays: Math.round(mostUrgent.hoursRemaining / 24),
  };
}

export function mergeMaintenanceFleetKart(
  kart: FleetKartSeed,
  maintenance: MaintenanceFleetKart | undefined,
): FleetKartListItem {
  if (!maintenance) {
    return enrichFleetKartListItem(kart);
  }

  const { mostUrgent } = maintenance.preventiveMaintenance;

  return {
    ...kart,
    usageHours: maintenance.engineHours,
    fleetStatus: maintenance.status,
    preventiveMaintenance: maintenance.preventiveMaintenance,
    correctiveMaintenance: maintenance.correctiveMaintenance,
    nextMaintenance: mostUrgent.displayLabel,
    nextMaintenanceDays: Math.round(mostUrgent.hoursRemaining / 24),
  };
}

export function isKartBlockedStatus(status: KartStatus): boolean {
  return status === "manutencao" || status === "aguardando_peca" || status === "indisponivel";
}
