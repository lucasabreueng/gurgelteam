import { HiExclamationTriangle } from "react-icons/hi2";
import type { MaintenanceOrderDetail } from "@/lib/contracts/maintenance";

export function EngineHoursCard({
  hours,
}: {
  hours: MaintenanceOrderDetail["engineHours"];
}) {
  const alertTone: Record<string, string> = {
    ok: "border-emerald-200/60 bg-emerald-50/80 text-emerald-900",
    warn: "border-amber-200/60 bg-amber-50/80 text-amber-950",
    overdue: "border-red-200/60 bg-red-50/80 text-red-950",
  };

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Horas do motor", value: `${hours.motor}h` },
          { label: "Horas restantes", value: `${hours.remaining}h` },
          { label: "Revisão preventiva", value: hours.preventive },
          { label: "Óleo", value: hours.oil },
          { label: "Pneus", value: hours.tires },
          { label: "Relação", value: hours.ratio },
        ].map((item) => (
          <li
            key={item.label}
            className="rounded-xl bg-[#fafbfc] px-4 py-3 ring-1 ring-[rgba(17,17,17,0.06)]"
          >
            <p className="text-[10px] font-bold uppercase text-neutral-500">
              {item.label}
            </p>
            <p className="mt-1 text-lg font-bold text-[#0d1f3c]">{item.value}</p>
          </li>
        ))}
      </ul>
      <ul className="mt-4 space-y-2">
        {hours.alerts.map((a) => (
          <li
            key={a.label}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${alertTone[a.tone]}`}
          >
            <HiExclamationTriangle className="h-4 w-4 shrink-0" />
            {a.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
