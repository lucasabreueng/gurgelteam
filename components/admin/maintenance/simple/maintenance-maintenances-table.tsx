"use client";

import type { SimpleMaintenanceRow } from "@/lib/contracts/maintenance/complete-checklist";
import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";
import { MaintenanceTablePagination } from "../maintenance-table-pagination";

const STATUS_LABEL = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
} as const;

const STATUS_CLASS = {
  pendente: "bg-neutral-100 text-neutral-700",
  em_andamento: "bg-amber-100 text-amber-900",
  concluida: "bg-emerald-100 text-emerald-800",
} as const;

type Props = {
  rows: SimpleMaintenanceRow[];
  mobileRows: SimpleMaintenanceRow[];
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function MaintenanceMaintenancesTable({
  rows,
  mobileRows,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <>
      <div className="hidden overflow-visible rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)] lg:block">
        <div className="overflow-x-auto rounded-t-2xl">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-4 py-3.5">Data</th>
                <th className="px-3 py-3.5">Kart</th>
                <th className="px-3 py-3.5">Tipo</th>
                <th className="px-3 py-3.5">Categoria</th>
                <th className="px-3 py-3.5">Descrição</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Custo</th>
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
                  <td className="px-3 py-3.5 capitalize text-neutral-700">
                    {row.type}
                  </td>
                  <td className="px-3 py-3.5 text-neutral-700">{row.category}</td>
                  <td className="px-3 py-3.5 font-medium text-[#0d1f3c]">
                    {row.description}
                  </td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_CLASS[row.status]}`}
                    >
                      {STATUS_LABEL[row.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 font-semibold tabular-nums">
                    {MaintenanceServiceMock.formatCurrency(row.costCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-neutral-500">
            Nenhuma manutenção registrada.
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
            Nenhuma manutenção registrada.
          </li>
        ) : (
          mobileRows.map((row) => (
            <li key={row.id}>
              <article className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-3 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-[#0d1f3c]">
                    Kart {String(row.kartNumber).padStart(2, "0")}
                  </p>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_CLASS[row.status]}`}
                  >
                    {STATUS_LABEL[row.status]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  {row.date} · {row.type} · {row.category}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#0d1f3c]">
                  {row.description}
                </p>
                <p className="mt-1 text-sm font-bold tabular-nums text-[#0d1f3c]">
                  {MaintenanceServiceMock.formatCurrency(row.costCents)}
                </p>
              </article>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
