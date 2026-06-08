import type { KartStatus } from "@/lib/contracts/enums";
import type {
  CorrectiveMaintenanceSummary,
  MaintenanceFleetKart,
} from "@/lib/contracts/maintenance/simple";
import {
  buildPreventiveMaintenanceSummary,
  type PreventiveMaintenanceHoursState,
} from "@/lib/maintenance/preventive-maintenance";
import { mapKartStatusToMaintenanceFleet } from "@/lib/maintenance/map-fleet-status";

export type BuildMaintenanceFleetKartInput = {
  id: string;
  number: number;
  photo: string;
  status: KartStatus | string;
  engineHours?: number | null;
  preventiveMaintenanceHours?: PreventiveMaintenanceHoursState | null;
  lastInspection?: string;
  lastMaintenance?: string;
  monthlyCostCents?: number;
  correctiveMaintenance?: CorrectiveMaintenanceSummary;
};

export function buildCorrectiveMaintenanceSummary(input: {
  openChecklistLabel?: string | null;
  openOrderLabel?: string | null;
}): CorrectiveMaintenanceSummary {
  if (input.openChecklistLabel) {
    return {
      status: "checklist_aberto",
      label: input.openChecklistLabel,
    };
  }
  if (input.openOrderLabel) {
    return {
      status: "em_andamento",
      label: input.openOrderLabel,
    };
  }
  return { status: "none", label: "—" };
}

export function buildMaintenanceFleetKart(
  input: BuildMaintenanceFleetKartInput,
): MaintenanceFleetKart {
  const engineHours = input.engineHours ?? 0;
  const preventive = buildPreventiveMaintenanceSummary(
    engineHours,
    input.preventiveMaintenanceHours,
  );

  return {
    id: input.id,
    number: input.number,
    photo: input.photo,
    status: mapKartStatusToMaintenanceFleet(input.status),
    engineHours,
    lastInspection: input.lastInspection ?? "—",
    lastMaintenance: input.lastMaintenance ?? "—",
    preventiveMaintenance: preventive,
    correctiveMaintenance:
      input.correctiveMaintenance ??
      buildCorrectiveMaintenanceSummary({}),
    monthlyCostCents: input.monthlyCostCents ?? 0,
  };
}
