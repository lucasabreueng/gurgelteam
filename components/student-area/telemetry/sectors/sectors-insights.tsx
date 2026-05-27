"use client";

import type { SectorsInsight } from "@/lib/contracts/telemetry/sectors";
import { SECTION_LABEL, SECTOR_SECTION } from "./sectors-styles";

type Props = {
  insights: SectorsInsight[];
};

const TONE = {
  gain: "border-emerald-200 bg-emerald-50 text-emerald-800",
  loss: "border-red-200 bg-red-50 text-red-800",
  neutral: "border-[rgba(17,17,17,0.08)] bg-neutral-50 text-neutral-700",
  highlight: "border-violet-200 bg-violet-50 text-violet-800",
} as const;

export function SectorsInsights({ insights }: Props) {
  return (
    <section>
      <p className={SECTION_LABEL}>Insights da sessão</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {insights.map((item) => (
          <article
            key={item.id}
            className={`rounded-xl border px-4 py-3.5 text-[12px] leading-snug transition hover:shadow-sm ${TONE[item.tone]}`}
          >
            <span className="mb-1.5 inline-block text-[9px] font-bold uppercase tracking-wider opacity-60">
              Coaching
            </span>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SectorsInsightsPanel({ insights }: Props) {
  return (
    <article className={SECTOR_SECTION}>
      <SectorsInsights insights={insights} />
    </article>
  );
}
