"use client";

import { HiSparkles } from "react-icons/hi2";
import type { ClientFeedback } from "@/lib/contracts/clients";

type Props = {
  feedbacks: ClientFeedback[];
};

const SCORE_LABELS: { key: keyof ClientFeedback["scores"]; label: string }[] = [
  { key: "braking", label: "Frenagem" },
  { key: "apex", label: "Tangência" },
  { key: "posture", label: "Postura" },
  { key: "control", label: "Controle" },
  { key: "strategy", label: "Estratégia" },
];

export function FeedbackCards({ feedbacks }: Props) {
  return (
    <section>
      <h3 className="text-lg font-bold text-[#0d1f3c]">Feedbacks</h3>
      <p className="mt-1 text-sm text-neutral-600">
        Avaliações técnicas dos instrutores.
      </p>

      <ul className="mt-5 space-y-4">
        {feedbacks.map((fb) => (
          <li
            key={fb.id}
            className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  {fb.date}
                </p>
                <p className="mt-1 font-semibold text-[#0d1f3c]">
                  {fb.instructor}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              {fb.note}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SCORE_LABELS.map(({ key, label }) => (
                <li
                  key={key}
                  className="rounded-lg bg-[#fafbfc] px-3 py-2 text-center ring-1 ring-[rgba(17,17,17,0.06)]"
                >
                  <p className="text-[9px] font-bold uppercase text-neutral-500">
                    {label}
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-accent">
                    {fb.scores[key]}
                  </p>
                </li>
              ))}
            </ul>
            {fb.aiInsight ? (
              <div className="mt-4 flex gap-3 rounded-xl border border-accent/15 bg-[#0d1f3c]/[0.03] px-4 py-3">
                <HiSparkles
                  className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                  aria-hidden
                />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    Insight IA
                  </p>
                  <p className="mt-1 text-sm italic text-neutral-700">
                    &ldquo;{fb.aiInsight}&rdquo;
                  </p>
                </div>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
