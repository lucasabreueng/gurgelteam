import type { ChecklistKartContext } from "@/lib/contracts/maintenance";
import type { MaintenanceFleetKart } from "@/lib/contracts/maintenance/simple";
import { getAppServices } from "@/lib/data-source/app-services";

/** Metadados de UI da inspeção técnica (módulos, diagramas — ainda mock). */
export function inspectionUi() {
  return getAppServices().inspection;
}

export function fleetKartToInspectionContext(
  kart: MaintenanceFleetKart,
): ChecklistKartContext & { ownerName?: string; lastMaintenance?: string } {
  return {
    orderId: kart.id,
    kartNumber: kart.number,
    photo: kart.photo || "/images/kart-01.jpg",
    categoryName: "Frota",
    kartStatus: kart.status,
    engineHours: 0,
    lastChecklist: kart.lastInspection,
    responsible: "Equipe técnica",
    reliabilityScore: 80,
    daysSinceRevision: 0,
    quickNote: "",
    ownerName: "Frota Gurgel",
    lastMaintenance: kart.lastMaintenance,
  };
}

export function mapInspectionFinalToOverall(
  final: string,
): string {
  if (final === "bloqueado") return "bloqueado";
  if (final === "restrito") return "atencao";
  return "liberado";
}
