"use client";

import type { SimpleInspectionRow } from "@/lib/contracts/maintenance/complete-checklist";
import { MaintenanceTablePagination } from "../maintenance-table-pagination";

type Props = {
  rows: SimpleInspectionRow[];
  mobileRows: SimpleInspectionRow[];
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onNewInspection?: (kartId: string) => void;
};

export function MaintenanceInspectionsTable({
  rows,
  mobileRows,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onNewInspection,
}: Props) {
  return (
    <>
      <div className="hidden overflow-visible rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)] lg:block">
        <div className="overflow-x-auto rounded-t-2xl">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-4 py-3.5">Data</th>
                <th className="px-3 py-3.5">Kart</th>
                <th className="px-3 py-3.5">Responsável</th>
                <th className="px-3 py-3.5">Resumo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[rgba(17,17,17,0.05)] last:border-0 hover:bg-[#fafbfc]/80"
                >
                  <td className="px-4 py-3.5 text-neutral-700">{row.date}</td>
                  <td className="px-3 py-3.5 font-semibold tabular-nums text-[#0d1f3c]">
                    Kart {String(row.kartNumber).padStart(2, "0")}
                  </td>
                  <td className="px-3 py-3.5 text-neutral-700">
                    {row.responsibleName}
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={
                        row.hasAttention
                          ? "font-semibold text-amber-800"
                          : "text-neutral-700"
                      }
                    >
                      {row.summary}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-neutral-500">
            Nenhuma inspeção registrada.
          </p>
        ) : (
          <MaintenanceTablePagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>

      <ul className="flex flex-col gap-[var(--admin-gap)] lg:hidden">
        {mobileRows.length === 0 ? (
          <li className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-10 text-center text-sm text-neutral-500">
            Nenhuma inspeção registrada.
          </li>
        ) : (
          mobileRows.map((row) => (
            <li key={row.id}>
              <article className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-3 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-[#0d1f3c]">
                    Kart {String(row.kartNumber).padStart(2, "0")}
                  </p>
                  <span className="text-[11px] text-neutral-500">{row.date}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-600">{row.responsibleName}</p>
                <p
                  className={`mt-2 text-sm ${row.hasAttention ? "font-semibold text-amber-800" : "text-neutral-700"}`}
                >
                  {row.summary}
                </p>
                {onNewInspection ? (
                  <button
                    type="button"
                    onClick={() => onNewInspection(row.kartId)}
                    className="btn-outline-sm mt-3 w-full bg-white"
                  >
                    Nova inspeção neste kart
                  </button>
                ) : null}
              </article>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
