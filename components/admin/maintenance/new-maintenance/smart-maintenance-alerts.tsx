"use client";

import { useChecklistContext } from "@/lib/query/hooks/use-checklist-context";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { NewMaintenanceServiceMock } from "@/services/maintenance/newMaintenanceServiceMock";
import { HiLightBulb } from "react-icons/hi2";
import { useEffect, useState } from "react";

type AlertRow = { id: string; message: string; tone: string };

const TONE: Record<string, string> = {
  info: "border-sky-200/60 bg-sky-50 text-sky-900",
  warn: "border-amber-200/60 bg-amber-50 text-amber-900",
  urgent: "border-red-200/60 bg-red-50 text-red-900",
};

export function SmartMaintenanceAlerts() {
  const httpMode = getDataSourceMode() === "http";
  const { data: context } = useChecklistContext();
  const [mockAlerts, setMockAlerts] = useState<AlertRow[]>([]);

  useEffect(() => {
    if (httpMode) return;
    void NewMaintenanceServiceMock.getSmartAlerts().then(setMockAlerts);
  }, [httpMode]);

  const alerts: AlertRow[] = httpMode
    ? (context?.smartAlerts.map((a) => ({
        id: a.id,
        message: a.message,
        tone: a.severity,
      })) ?? [])
    : mockAlerts;

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <HiLightBulb className="h-5 w-5 text-accent" aria-hidden />
        <h2 className="text-sm font-bold text-[#0d1f3c]">Alertas inteligentes</h2>
      </div>
      {alerts.length === 0 ? (
        <p className="mt-3 text-xs text-neutral-500">Nenhum alerta no momento.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {alerts.map((a) => (
            <li
              key={a.id}
              className={`rounded-xl border px-3 py-2.5 text-xs font-medium leading-relaxed ${TONE[a.tone] ?? TONE.info}`}
            >
              {a.message}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
