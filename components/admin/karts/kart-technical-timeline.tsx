"use client";

import type { KartTechnicalTimelineEntry } from "@/lib/contracts/maintenance/complete-checklist";

const KIND_STYLE: Record<
  KartTechnicalTimelineEntry["kind"],
  { dot: string; label: string }
> = {
  inspecao: { dot: "bg-sky-500", label: "Inspeção" },
  manutencao: { dot: "bg-amber-500", label: "Manutenção" },
  checklist: { dot: "bg-violet-500", label: "Checklist" },
};

type Props = { entries: KartTechnicalTimelineEntry[] };

export function KartTechnicalTimeline({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-200 bg-white px-4 py-8 text-center text-sm text-neutral-500">
        Nenhum registro técnico para este kart.
      </p>
    );
  }

  return (
    <ol className="space-y-4 border-l-2 border-[rgba(13,31,60,0.12)] pl-5">
      {entries.map((entry) => {
        const style = KIND_STYLE[entry.kind];
        return (
          <li key={entry.id} className="relative">
            <span
              className={`absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${style.dot}`}
              aria-hidden
            />
            <p className="text-[11px] font-bold uppercase text-neutral-500">
              {entry.dateLabel} — {style.label}
            </p>
            <p className="mt-0.5 font-semibold text-[#0d1f3c]">{entry.title}</p>
            <p className="text-sm text-neutral-600">{entry.detail}</p>
          </li>
        );
      })}
    </ol>
  );
}
