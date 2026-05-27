import { HiExclamationTriangle, HiInformationCircle } from "react-icons/hi2";
import type { InventoryAlert } from "@/lib/contracts/inventory";

export function SmartInventoryAlerts({ alerts }: { alerts: InventoryAlert[] }) {
  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6">
      <h3 className="text-sm font-bold text-[#0d1f3c]">Alertas inteligentes</h3>
      <ul className="mt-4 space-y-2">
        {alerts.map((a) => (
          <li
            key={a.id}
            className={`flex gap-3 rounded-xl border px-4 py-3 text-sm ${
              a.severity === "urgent"
                ? "border-red-200/60 bg-red-50/80 text-red-950"
                : a.severity === "warn"
                  ? "border-amber-200/60 bg-amber-50/80 text-amber-950"
                  : "border-sky-200/60 bg-sky-50/80 text-sky-950"
            }`}
          >
            {a.severity === "info" ? (
              <HiInformationCircle className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <HiExclamationTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            {a.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
