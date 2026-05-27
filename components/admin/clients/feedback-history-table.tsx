"use client";

import { useMemo, useState } from "react";
import type { ClientFeedback } from "@/lib/contracts/clients";
import { ProfileSectionHeader } from "./profile-section-header";

const PREVIEW_ROWS = 4;

type Props = {
  feedbacks: ClientFeedback[];
};

export function FeedbackHistoryTable({ feedbacks }: Props) {
  const [expanded, setExpanded] = useState(false);

  const visibleRows = useMemo(
    () => (expanded ? feedbacks : feedbacks.slice(0, PREVIEW_ROWS)),
    [expanded, feedbacks],
  );

  const canExpand = feedbacks.length > PREVIEW_ROWS;

  return (
    <section>
      <ProfileSectionHeader
        title="Histórico de feedbacks"
        description="Feedbacks enviados pelos instrutores."
        showViewMore={canExpand && !expanded}
        onViewMore={() => setExpanded(true)}
      />

      <div className="mt-4 overflow-x-auto rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-sm">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Hora</th>
              <th className="px-4 py-3">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-sm text-neutral-500"
                >
                  Nenhum feedback registrado.
                </td>
              </tr>
            ) : (
              visibleRows.map((fb) => (
                <tr
                  key={fb.id}
                  className="border-b border-[rgba(17,17,17,0.05)] last:border-0"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                    {fb.date}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono tabular-nums text-[#0d1f3c]">
                    {fb.time}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{fb.note}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
