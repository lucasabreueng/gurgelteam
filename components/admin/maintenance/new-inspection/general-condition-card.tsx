"use client";

import type { GeneralCondition } from "@/lib/contracts/maintenance";
import { useInspectionTemplate } from "@/lib/query/hooks/use-inspection-template";

const OPTIONS: GeneralCondition[] = [
  "excelente",
  "boa",
  "atencao",
  "critica",
];

type Props = {
  value: GeneralCondition;
  score: number;
  onChange: (v: GeneralCondition) => void;
};

export function GeneralConditionCard({ value, score, onChange }: Props) {
  const { data: template, isLoading } = useInspectionTemplate();
  const metaMap = (template?.generalConditionMeta ?? {}) as Record<
    GeneralCondition,
    { label: string; color: string; bar: string; summary: string }
  >;
  const meta = metaMap[value];

  if (isLoading || !meta) {
    return (
      <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm md:p-6">
        <div className="h-28 animate-pulse rounded-xl bg-[#fafbfc]" />
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0d1f3c]">Condição geral</h2>
          <p className="mt-1 text-xs text-neutral-500">{meta.summary}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase text-neutral-500">
            Score técnico
          </p>
          <p className={`text-3xl font-black tabular-nums ${meta.color}`}>
            {score}
          </p>
        </div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${meta.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {OPTIONS.map((opt) => {
          const m = metaMap[opt];
          if (!m) return null;
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`rounded-xl border-2 px-3 py-3 text-center transition ${
                active
                  ? "border-accent bg-[#0d1f3c] text-white shadow-md"
                  : "border-transparent bg-[#fafbfc] text-[#0d1f3c] hover:border-accent/20"
              }`}
            >
              <span className="block text-xs font-bold uppercase tracking-wide">
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
