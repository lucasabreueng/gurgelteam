import { HiExclamationTriangle } from "react-icons/hi2";
import type { OperationalSidebarAlert } from "@/lib/contracts/schedule";

const TONE: Record<
  OperationalSidebarAlert["tone"],
  string
> = {
  urgent: "border-red-200/60 bg-red-50 text-red-900",
  warn: "border-amber-200/60 bg-amber-50 text-amber-900",
  info: "border-sky-200/60 bg-sky-50 text-sky-900",
};

export function OperationalAlertsSidebar({
  alerts,
}: {
  alerts: OperationalSidebarAlert[];
}) {
  return (
    <section className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <HiExclamationTriangle className="h-4 w-4 text-amber-600" aria-hidden />
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          Alertas
        </h3>
      </div>
      <ul className="mt-3 space-y-2">
        {alerts.map((a) => (
          <li
            key={a.id}
            className={`rounded-lg border px-3 py-2.5 text-xs font-medium leading-relaxed ${TONE[a.tone]}`}
          >
            {a.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
