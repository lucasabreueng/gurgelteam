"use client";

import type { LapSummary } from "@/lib/lesson-registration-laps";

type Props = {
  summary: LapSummary;
};

const CARDS: { key: keyof LapSummary; label: string }[] = [
  { key: "bestLap", label: "Melhor volta" },
  { key: "bestS1", label: "Melhor S1" },
  { key: "bestS2", label: "Melhor S2" },
  { key: "bestS3", label: "Melhor S3" },
  { key: "consistency", label: "Consistência" },
  { key: "idealLap", label: "Volta ideal" },
];

export function RegistrationSummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {CARDS.map(({ key, label }) => (
        <div
          key={key}
          className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-gradient-to-br from-white to-[#fafbfc] p-4 shadow-sm"
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            {label}
          </p>
          <p className="mt-1 font-mono text-lg font-bold tabular-nums text-accent">
            {key === "consistency" ? `${summary.consistency}%` : summary[key]}
          </p>
        </div>
      ))}
    </div>
  );
}
