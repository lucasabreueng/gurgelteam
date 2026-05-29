import type { KartOperationalStatus } from "@/lib/contracts/maintenance/simple";
import { KART_STATUS_LABELS } from "@/lib/contracts/maintenance/simple";

const STYLES: Record<KartOperationalStatus, string> = {
  operacional: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  atencao: "bg-amber-50 text-amber-950 ring-amber-200/60",
  em_manutencao: "bg-sky-50 text-sky-900 ring-sky-200/60",
  indisponivel: "bg-red-50 text-red-800 ring-red-200/60",
};

export function MaintenanceKartStatusBadge({
  status,
}: {
  status: KartOperationalStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${STYLES[status]}`}
    >
      {KART_STATUS_LABELS[status]}
    </span>
  );
}
