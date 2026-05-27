import type { MaintenanceStatus } from "@/lib/contracts/maintenance";
import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";


export function statusStyle(status: MaintenanceStatus): string {
  const map: Record<MaintenanceStatus, string> = {
    detectado: "bg-neutral-100 text-neutral-700 ring-neutral-200/60",
    aguardando_analise: "bg-violet-50 text-violet-800 ring-violet-200/60",
    aguardando_peca: "bg-amber-50 text-amber-900 ring-amber-200/60",
    em_manutencao: "bg-sky-50 text-sky-900 ring-sky-200/60",
    em_testes: "bg-indigo-50 text-indigo-900 ring-indigo-200/60",
    finalizado: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
    liberado: "bg-[#0d1f3c] text-white ring-[#0d1f3c]/20",
  };
  return map[status];
}

export function MaintenanceStatusBadge({
  status,
}: {
  status: MaintenanceStatus;
}) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${statusStyle(status)}`}
    >
      {MaintenanceServiceMock.getStatusLabels()[status]}
    </span>
  );
}
