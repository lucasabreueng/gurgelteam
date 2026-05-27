import type { MaintenancePriority } from "@/lib/contracts/maintenance";
import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";


const styles: Record<MaintenancePriority, string> = {
  baixa: "bg-slate-50 text-slate-700 ring-slate-200/60",
  media: "bg-sky-50 text-sky-800 ring-sky-200/60",
  alta: "bg-amber-50 text-amber-900 ring-amber-200/60",
  critica: "bg-red-50 text-red-800 ring-red-200/60",
};

export function MaintenancePriorityBadge({
  priority,
}: {
  priority: MaintenancePriority;
}) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${styles[priority]}`}
    >
      {MaintenanceServiceMock.getPriorityLabels()[priority]}
    </span>
  );
}
