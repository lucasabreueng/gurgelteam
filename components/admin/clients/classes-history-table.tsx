"use client";

import { useMemo, useState } from "react";
import type { ClientClassHistoryRow } from "@/lib/contracts/clients";
import { ProfileSectionHeader } from "./profile-section-header";
import {
  clientsTableBodyRowClass,
  clientsTableHeadRowClass,
  clientsTableScrollClass,
  clientsTableWrapClass,
} from "./clients-table-shared";

const PREVIEW_ROWS = 4;

type Props = {
  rows: ClientClassHistoryRow[];
};

export function ClassesHistoryTable({ rows }: Props) {
  const [expanded, setExpanded] = useState(false);

  const visibleRows = useMemo(
    () => (expanded ? rows : rows.slice(0, PREVIEW_ROWS)),
    [expanded, rows],
  );

  const canExpand = rows.length > PREVIEW_ROWS;

  return (
    <section>
      <ProfileSectionHeader
        title="Histórico de aulas"
        description="Aulas realizadas pelo piloto."
        showViewMore={canExpand && !expanded}
        onViewMore={() => setExpanded(true)}
      />

      <div className={clientsTableWrapClass}>
        <div className={clientsTableScrollClass}>
          <table className="w-full min-w-0 text-left text-sm">
            <thead>
              <tr className={clientsTableHeadRowClass}>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Hora</th>
                <th className="px-4 py-3">Tempo de treino</th>
                <th className="px-4 py-3">Melhor tempo</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-neutral-500"
                  >
                    Nenhuma aula registrada.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <tr key={row.id} className={clientsTableBodyRowClass}>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                      {row.date}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono tabular-nums text-[#0d1f3c]">
                      {row.time}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-700">
                      {row.trainingDuration}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold tabular-nums text-accent">
                      {row.bestLap}
                    </td>
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
