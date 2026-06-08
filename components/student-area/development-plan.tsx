"use client";

import type { DevTabKey } from "@/lib/contracts/student-area";
import { usePilotHome } from "@/lib/query/hooks/use-pilot-home";

import { useMemo, useState } from "react";
import { HiCheck } from "react-icons/hi2";


type Props = { className?: string };

export function DevelopmentPlan({ className = "" }: Props) {
  const [tab, setTab] = useState<DevTabKey>("foco");
  const { data: home, isLoading } = usePilotHome();
  const developmentByTab = home?.developmentByTab;
  const tabs = home?.developmentTabs ?? [];
  const data = useMemo(
    () => developmentByTab?.[tab],
    [developmentByTab, tab],
  );

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-5 ${className}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        Plano de desenvolvimento
      </p>
      <h3 className="mt-0.5 text-[17px] font-bold leading-tight text-[#0d1f3c] md:text-lg">
        Sua jornada
      </h3>

      <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition md:px-3 md:text-[11px] ${
              tab === t.key
                ? "bg-accent text-white shadow-sm"
                : "border border-[rgba(17,17,17,0.1)] bg-neutral-50 text-neutral-700 hover:border-accent/25 hover:text-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex-shrink-0">
        {isLoading || !data ? (
          <p className="text-sm text-neutral-500">Carregando plano…</p>
        ) : (
          <>
        <p className="text-[15px] font-semibold leading-snug text-[#111]">
          {data.title}
        </p>
        <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-neutral-600">
          {data.description}
        </p>
          </>
        )}
      </div>

      {data ? (
      <>
      <ul className="mt-3 min-h-0 flex-1 space-y-0 overflow-y-auto overflow-x-visible pr-1">
        {data.checklist.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-2.5 border-b border-dashed border-[rgba(17,17,17,0.06)] py-2.5 last:border-0 last:pb-0"
          >
            <span
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white ${
                item.done
                  ? "border-emerald-500/80 bg-emerald-50 text-emerald-600 shadow-sm"
                  : "border-neutral-300 border-dashed text-transparent"
              }`}
              style={{ minWidth: "2rem", minHeight: "2rem" }}
              aria-hidden
            >
              {item.done ? (
                <HiCheck className="h-4 w-4" aria-hidden />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" />
              )}
            </span>
            <span
              className={`min-w-0 pt-1 text-[13px] leading-snug font-medium ${
                item.done
                  ? "text-neutral-500 line-through decoration-neutral-300"
                  : "text-neutral-800"
              }`}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 shrink-0 pt-2">
        <div className="flex items-center justify-between text-[11px]">
          <p className="font-bold uppercase tracking-wider text-[#111]">
            {data.progressLabel}
          </p>
          <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-bold tabular-nums text-white shadow-sm shadow-accent/35">
            {data.progressPercent}%
          </span>
        </div>
        <div className="mt-2 h-[7px] w-full overflow-hidden rounded-full bg-[rgba(13,31,60,0.08)] shadow-inner shadow-black/[0.04]">
          <div
            className="relative h-full rounded-full bg-[#c41e3a]"
            style={{ width: `${data.progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#ffd5d9]/50 to-transparent" />
          </div>
        </div>
      </div>
      </>
      ) : null}
    </div>
  );
}
