"use client";

import { HiSparkles } from "react-icons/hi2";
import type { ClientFeedback } from "@/lib/contracts/clients";
import {
  adminCardInnerClass,
  adminInsightPanelClass,
  adminScoreChipClass,
  adminSubsectionTitleClass,
  adminTextAccentClass,
} from "@/lib/design";

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
      <h3 className={adminSubsectionTitleClass}>Feedbacks</h3>
      <p className="mt-1 text-sm text-neutral-600">
        Avaliações técnicas da equipe Gurgel Team.
      </p>

      <ul className="mt-5 space-y-4">
        {feedbacks.map((fb) => (
          <li
            key={fb.id}
            className={adminCardInnerClass}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  {fb.date}
                </p>
                <p className={`mt-1 ${adminTextAccentClass}`}>
                  {fb.authorName}
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
                  className={adminScoreChipClass}
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
              <div className={adminInsightPanelClass}>
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
