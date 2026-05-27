"use client";

import type { PilotRecentSessionDTO } from "@/lib/contracts/lessons/lesson-registration.types";

type Props = {
  sessions: PilotRecentSessionDTO[];
};

export function PilotHistorySidebar({ sessions }: Props) {
  return (
    <aside className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
        Histórico do piloto
      </h4>
      <ul className="mt-3 space-y-3">
        {sessions.map((s) => (
          <li
            key={s.id}
            className="rounded-xl border border-[rgba(17,17,17,0.06)] bg-[#fafbfc] px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-neutral-500">
                {s.date}
              </span>
              <span className="font-mono text-xs font-bold tabular-nums text-accent">
                {s.bestLap}
              </span>
            </div>
            <p className="mt-0.5 text-xs font-medium text-[#0d1f3c]">
              {s.label}
            </p>
            <p className="text-[10px] text-neutral-500">
              {s.consistency}% consistência
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
