"use client";

import {
  HiDocumentArrowDown,
  HiDocumentDuplicate,
  HiEye,
} from "react-icons/hi2";
import type { ChecklistHistoryRow } from "@/lib/contracts/maintenance/complete-checklist";
import { COMPLETE_CHECKLIST_TYPE_LABELS } from "@/lib/contracts/maintenance/complete-checklist";
import { ChecklistFinalStatusBadge } from "./checklist-final-status-badge";
import { MaintenanceTablePagination } from "../maintenance-table-pagination";

type Props = {
  rows: ChecklistHistoryRow[];
  mobileRows: ChecklistHistoryRow[];
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExportPdf: (id: string) => void;
};

export function MaintenanceChecklistsTable({
  rows,
  mobileRows,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onView,
  onDuplicate,
  onExportPdf,
}: Props) {
  return (
    <>
      <div className="hidden overflow-visible rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)] lg:block">
        <div className="overflow-x-auto rounded-t-2xl">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-4 py-3.5">Data</th>
                <th className="px-3 py-3.5">Kart</th>
                <th className="px-3 py-3.5">Tipo</th>
                <th className="px-3 py-3.5">Responsável</th>
                <th className="px-3 py-3.5">Resultado</th>
                <th className="px-3 py-3.5">Reprovados</th>
                <th className="px-4 py-3.5 text-right">Ações</th>
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
                    {COMPLETE_CHECKLIST_TYPE_LABELS[row.type]}
                  </td>
                  <td className="px-3 py-3.5 text-neutral-700">
                    {row.responsibleName}
                  </td>
                  <td className="px-3 py-3.5">
                    <ChecklistFinalStatusBadge status={row.finalStatus} />
                  </td>
                  <td className="px-3 py-3.5 tabular-nums font-semibold text-[#0d1f3c]">
                    {row.failedCount}
                  </td>
                  <td className="px-4 py-3.5">
                    <RowActions
                      id={row.id}
                      onView={onView}
                      onDuplicate={onDuplicate}
                      onExportPdf={onExportPdf}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-neutral-500">
            Nenhum checklist completo registrado.
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
            Nenhum checklist completo registrado.
          </li>
        ) : (
          mobileRows.map((row) => (
            <li key={row.id}>
              <article className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-3 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-[#0d1f3c]">
                    Kart {String(row.kartNumber).padStart(2, "0")}
                  </p>
                  <ChecklistFinalStatusBadge status={row.finalStatus} />
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  {row.date} · {COMPLETE_CHECKLIST_TYPE_LABELS[row.type]}
                </p>
                <p className="mt-1 text-xs text-neutral-600">
                  {row.responsibleName} · {row.failedCount} reprovado(s)
                </p>
                <RowActions
                  id={row.id}
                  onView={onView}
                  onDuplicate={onDuplicate}
                  onExportPdf={onExportPdf}
                  compact
                />
              </article>
            </li>
          ))
        )}
      </ul>
    </>
  );
}

function RowActions({
  id,
  onView,
  onDuplicate,
  onExportPdf,
  compact,
}: {
  id: string;
  onView: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExportPdf: (id: string) => void;
  compact?: boolean;
}) {
  const btn = compact
    ? "flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase text-[#0d1f3c]"
    : "flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-[#0d1f3c]/5 hover:text-[#0d1f3c]";

  return (
    <div
      className={
        compact ? "mt-3 flex gap-1.5" : "flex items-center justify-end gap-1"
      }
    >
      <button
        type="button"
        title="Visualizar"
        aria-label="Visualizar"
        onClick={() => onView(id)}
        className={btn}
      >
        <HiEye className="h-4 w-4 shrink-0" />
        {compact ? <span>Ver</span> : null}
      </button>
      <button
        type="button"
        title="Duplicar"
        aria-label="Duplicar"
        onClick={() => onDuplicate(id)}
        className={btn}
      >
        <HiDocumentDuplicate className="h-4 w-4 shrink-0" />
        {compact ? <span>Duplicar</span> : null}
      </button>
      <button
        type="button"
        title="Exportar PDF"
        aria-label="Exportar PDF"
        onClick={() => onExportPdf(id)}
        className={btn}
      >
        <HiDocumentArrowDown className="h-4 w-4 shrink-0" />
        {compact ? <span>PDF</span> : null}
      </button>
    </div>
  );
}
