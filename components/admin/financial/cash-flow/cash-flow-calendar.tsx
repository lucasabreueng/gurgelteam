"use client";

import type { CashFlowCalendarDay } from "@/lib/contracts/cashflow";

import { FinancialChartCard } from "../financial-chart-card";

type Props = {
  days: CashFlowCalendarDay[];
  monthLabel: string;
};

export function CashFlowCalendar({ days, monthLabel }: Props) {
  const maxMovement = Math.max(...days.map((d) => d.entriesRaw + d.exitsRaw), 1);

  return (
    <FinancialChartCard
      title="Calendário financeiro"
      subtitle={`${monthLabel} — entradas, saídas e saldo por dia`}
    >
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: new Date(2026, 4, 1).getDay() }, (_, i) => (
          <div key={`empty-${i}`} className="min-h-[72px]" />
        ))}
        {days.map((day) => {
          const intensity = (day.entriesRaw + day.exitsRaw) / maxMovement;
          return (
            <div
              key={day.dateIso}
              className={`min-h-[72px] rounded-lg border p-1.5 text-left transition ${
                day.isToday
                  ? "border-accent/40 bg-accent/[0.06] ring-1 ring-accent/20"
                  : day.isWeekend
                    ? "border-[rgba(17,17,17,0.04)] bg-[#fafbfc]"
                    : "border-[rgba(17,17,17,0.08)] bg-white"
              }`}
              style={{
                backgroundImage: day.isToday
                  ? undefined
                  : `linear-gradient(to top, rgba(13,31,60,${intensity * 0.08}) 0%, transparent 100%)`,
              }}
            >
              <p
                className={`text-[11px] font-bold ${
                  day.isToday ? "text-accent" : "text-[#0d1f3c]"
                }`}
              >
                {day.day}
              </p>
              <p className="mt-0.5 truncate text-[9px] font-semibold text-emerald-700">
                +{day.entries.replace("R$ ", "")}
              </p>
              <p className="truncate text-[9px] font-semibold text-red-700">
                -{day.exits.replace("R$ ", "")}
              </p>
              <p className="mt-0.5 truncate text-[9px] font-bold tabular-nums text-[#0d1f3c]">
                {day.balance.replace("R$ ", "")}
              </p>
            </div>
          );
        })}
      </div>
    </FinancialChartCard>
  );
}
