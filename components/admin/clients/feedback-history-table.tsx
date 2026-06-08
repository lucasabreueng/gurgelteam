"use client";

import { useMemo, useState } from "react";
import type { ClientFeedback } from "@/lib/contracts/clients";
import { ProfileSectionHeader } from "./profile-section-header";
import {
  clientsTableBodyRowClass,
  clientsTableHeadRowClass,
  clientsTableScrollClass,
  clientsTableWrapClass,
} from "./clients-table-shared";

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
        description="Feedbacks enviados pela equipe técnica."
        showViewMore={canExpand && !expanded}
        onViewMore={() => setExpanded(true)}
      />

      <div className={clientsTableWrapClass}>
        <div className={clientsTableScrollClass}>
          <table className="w-full min-w-0 text-left text-sm">
            <thead>
              <tr className={clientsTableHeadRowClass}>
                <th className="rounded-tl-2xl px-4 py-3">Data</th>
                <th className="px-4 py-3">Hora</th>
                <th className="rounded-tr-2xl px-4 py-3">Feedback</th>
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
                  <tr key={fb.id} className={clientsTableBodyRowClass}>
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
      </div>
    </section>
  );
}
