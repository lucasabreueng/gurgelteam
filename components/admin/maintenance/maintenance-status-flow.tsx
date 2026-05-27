"use client";

import type { MaintenanceStatus } from "@/lib/contracts/maintenance";

import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";

type Props = {
  currentStatus?: MaintenanceStatus;
  /** @deprecated compact horizontal removido da página principal */
  compact?: boolean;
  orientation?: "horizontal" | "vertical";
};

export function MaintenanceStatusFlow({
  currentStatus,
  compact,
  orientation = compact ? "horizontal" : "vertical",
}: Props) {
  const activeIndex = currentStatus
    ? MaintenanceServiceMock.getFlowStatuses().indexOf(currentStatus)
    : -1;

  if (orientation === "horizontal") {
    return (
      <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-4">
        <HorizontalFlow activeIndex={activeIndex} />
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
        Etapas da manutenção
      </h3>
      <ol className="mt-4 flex flex-col">
        {MaintenanceServiceMock.getFlowStatuses().map((step, i) => {
          const done = activeIndex >= 0 && i < activeIndex;
          const active = i === activeIndex;
          const isLast = i === MaintenanceServiceMock.getFlowStatuses().length - 1;

          return (
            <li key={step} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
                    active
                      ? "bg-[#0d1f3c] text-white shadow-[0_4px_12px_rgba(13,31,60,0.25)]"
                      : done
                        ? "bg-emerald-500 text-white"
                        : "bg-[#fafbfc] text-neutral-400 ring-2 ring-[rgba(17,17,17,0.1)]"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                {!isLast ? (
                  <span
                    className={`w-0.5 flex-1 min-h-[28px] ${
                      done ? "bg-emerald-400" : "bg-[rgba(17,17,17,0.12)]"
                    }`}
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-5"}`}>
                <p
                  className={`text-sm font-bold leading-tight ${
                    active ? "text-[#0d1f3c]" : "text-neutral-600"
                  }`}
                >
                  {MaintenanceServiceMock.getStatusLabels()[step]}
                </p>
                {active ? (
                  <p className="mt-1 text-xs font-semibold text-accent">
                    Etapa atual
                  </p>
                ) : done ? (
                  <p className="mt-1 text-xs text-emerald-700">Concluída</p>
                ) : (
                  <p className="mt-1 text-xs text-neutral-400">Pendente</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function HorizontalFlow({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="overflow-x-auto pb-1">
      <ol className="flex min-w-[720px] items-center gap-0">
        {MaintenanceServiceMock.getFlowStatuses().map((step, i) => {
          const done = activeIndex >= 0 && i < activeIndex;
          const active = i === activeIndex;
          const upcoming = activeIndex >= 0 && i > activeIndex;

          return (
            <li key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center px-1">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${
                    active
                      ? "bg-[#0d1f3c] text-white"
                      : done
                        ? "bg-emerald-500 text-white"
                        : upcoming
                          ? "bg-white text-neutral-400 ring-2 ring-[rgba(17,17,17,0.08)]"
                          : "bg-white text-neutral-500 ring-2 ring-[rgba(17,17,17,0.12)]"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={`mt-2 max-w-[88px] text-center text-[9px] font-bold uppercase ${
                    active ? "text-[#0d1f3c]" : "text-neutral-500"
                  }`}
                >
                  {MaintenanceServiceMock.getStatusLabels()[step].replace(" para pista", "")}
                </span>
              </div>
              {i < MaintenanceServiceMock.getFlowStatuses().length - 1 ? (
                <div
                  className={`mx-0.5 h-0.5 flex-1 rounded-full ${
                    done ? "bg-emerald-400" : "bg-[rgba(17,17,17,0.1)]"
                  }`}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
