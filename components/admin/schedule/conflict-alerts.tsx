import { HiExclamationTriangle } from "react-icons/hi2";
import type { ScheduleConflict } from "@/lib/contracts/schedule";

export function ConflictAlerts({ conflicts }: { conflicts: ScheduleConflict[] }) {
  return (
    <section className="rounded-2xl border-2 border-red-200/50 bg-gradient-to-br from-red-50/80 to-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <HiExclamationTriangle className="h-5 w-5 text-red-600" aria-hidden />
        <h3 className="text-sm font-bold text-red-900">Conflitos operacionais</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {conflicts.map((c) => (
          <li
            key={c.id}
            className={`rounded-xl px-3 py-2.5 text-xs font-medium leading-relaxed ${
              c.severity === "urgent"
                ? "bg-red-100/80 text-red-900"
                : "bg-amber-50 text-amber-900"
            }`}
          >
            {c.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
