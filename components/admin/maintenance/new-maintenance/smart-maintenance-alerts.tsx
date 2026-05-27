import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";
import { HiLightBulb } from "react-icons/hi2";


const TONE: Record<string, string> = {
  info: "border-sky-200/60 bg-sky-50 text-sky-900",
  warn: "border-amber-200/60 bg-amber-50 text-amber-900",
  urgent: "border-red-200/60 bg-red-50 text-red-900",
};

export function SmartMaintenanceAlerts() {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <HiLightBulb className="h-5 w-5 text-accent" aria-hidden />
        <h2 className="text-sm font-bold text-[#0d1f3c]">Alertas inteligentes</h2>
      </div>
      <ul className="mt-3 space-y-2">
        {NewMaintenanceServiceMock.getSmartAlerts().map((a) => (
          <li
            key={a.id}
            className={`rounded-xl border px-3 py-2.5 text-xs font-medium leading-relaxed ${TONE[a.tone]}`}
          >
            {a.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
