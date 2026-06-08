import type { KartStatus } from "@/lib/contracts/enums";
import type { MaintenanceFleetStatus } from "@/lib/contracts/maintenance/simple";

/** Status exibidos na tabela de manutenção (3 valores). */
export function mapKartStatusToMaintenanceFleet(
  status: KartStatus | string,
): MaintenanceFleetStatus {
  if (status === "manutencao" || status === "aguardando_peca") {
    return "em_manutencao";
  }
  if (status === "indisponivel") return "indisponivel";
  return "disponivel";
}

/** Compatível com status operacional legado nos mocks. */
export function mapLegacyOperationalToFleetStatus(
  status: string,
): MaintenanceFleetStatus {
  if (status === "em_manutencao") return "em_manutencao";
  if (status === "indisponivel") return "indisponivel";
  return "disponivel";
}
