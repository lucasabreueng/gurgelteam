import type { MaintenanceFleetStatus } from "@/lib/contracts/maintenance/simple";
import { MAINTENANCE_FLEET_STATUS_LABELS } from "@/lib/contracts/maintenance/simple";

const STYLES: Record<MaintenanceFleetStatus, string> = {
  disponivel: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  em_manutencao: "bg-sky-50 text-sky-900 ring-sky-200/60",
  indisponivel: "bg-red-50 text-red-800 ring-red-200/60",
};

export function KartFleetStatusBadge({
  status,
}: {
  status: MaintenanceFleetStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${STYLES[status]}`}
    >
      {MAINTENANCE_FLEET_STATUS_LABELS[status]}
    </span>
  );
}
