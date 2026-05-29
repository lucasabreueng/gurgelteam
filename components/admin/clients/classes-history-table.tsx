"use client";

import { useMemo, useState } from "react";
import type { ClientClassHistoryRow } from "@/lib/contracts/clients";
import { ProfileSectionHeader } from "./profile-section-header";

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

      <div className="mt-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-sm">
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
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
                <tr
                  key={row.id}
                  className="border-b border-[rgba(17,17,17,0.05)] last:border-0"
                >
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

        <div className="lg:hidden">
          {visibleRows.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-neutral-500">
              Nenhuma aula registrada.
            </p>
          ) : (
            <ul className="divide-y divide-[rgba(17,17,17,0.06)]">
              {visibleRows.map((row) => (
                <li key={row.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-[#0d1f3c]">
                        {row.date} ·{" "}
                        <span className="font-mono tabular-nums">{row.time}</span>
                      </p>
                      <p className="mt-1 text-[11px] text-neutral-600">
                        Treino:{" "}
                        <span className="font-semibold text-[#111]">
                          {row.trainingDuration}
                        </span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-600">
                        Melhor tempo:{" "}
                        <span className="font-bold tabular-nums text-accent">
                          {row.bestLap}
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
