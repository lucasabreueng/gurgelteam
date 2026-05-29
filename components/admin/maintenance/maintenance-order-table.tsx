"use client";

import type { MaintenanceOrderListItem } from "@/lib/contracts/maintenance";

import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";

import Image from "next/image";
import { HiChevronRight, HiEye } from "react-icons/hi2";

import { MaintenancePriorityBadge } from "./maintenance-priority-badge";
import { MaintenanceStatusBadge } from "./maintenance-status-badge";
import { MaintenanceTablePagination } from "./maintenance-table-pagination";

const metaBadge =
  "inline-flex rounded-md border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-2 py-0.5 text-[11px] font-semibold text-[#0d1f3c]";

type Props = {
  orders: MaintenanceOrderListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewDetails: (id: string) => void;
};

export function MaintenanceOrderTable({
  orders,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
}: Props) {
  return (
    <div>
      <div className="hidden overflow-visible rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)] lg:block">
        <div className="overflow-x-auto rounded-t-2xl">
          <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <th className="px-4 py-3.5">OS / Kart</th>
              <th className="px-3 py-3.5">Categoria</th>
              <th className="px-3 py-3.5">Tipo</th>
              <th className="px-3 py-3.5">Problema</th>
              <th className="px-3 py-3.5">Prioridade</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="px-3 py-3.5">Mecânico</th>
              <th className="px-3 py-3.5">Abertura</th>
              <th className="px-3 py-3.5">Parado</th>
              <th className="px-3 py-3.5">Peças</th>
              <th className="px-4 py-3.5 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-[rgba(17,17,17,0.05)] transition last:border-0 hover:bg-[#fafbfc]/80"
              >
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => onViewDetails(order.id)}
                    className="flex items-center gap-3 text-left transition hover:opacity-80"
                  >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-2 ring-white shadow-sm">
                      <Image
                        src={order.kartPhoto}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </span>
                    <span>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                        {order.osNumber}
                      </span>
                      <span className="block font-semibold text-[#0d1f3c]">
                        Kart {String(order.kartNumber).padStart(2, "0")}
                      </span>
                      {order.ownerName ? (
                        <span className="text-[10px] font-medium text-neutral-600">
                          {order.ownerName}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </td>
                <td className="px-3 py-3.5">
                  <span className={metaBadge}>{order.categoryName}</span>
                </td>
                <td className="px-3 py-3.5">
                  <span className={metaBadge}>
                    {MaintenanceServiceMock.getTypeLabels()[order.type]}
                  </span>
                </td>
                <td className="max-w-[200px] px-3 py-3.5">
                  <p className="line-clamp-2 text-neutral-700">{order.problem}</p>
                </td>
                <td className="px-3 py-3.5">
                  <MaintenancePriorityBadge priority={order.priority} />
                </td>
                <td className="px-3 py-3.5">
                  <MaintenanceStatusBadge status={order.status} />
                </td>
                <td className="px-3 py-3.5 font-medium text-neutral-700">
                  {order.mechanicName}
                </td>
                <td className="px-3 py-3.5 text-neutral-700">{order.openedAt}</td>
                <td className="px-3 py-3.5 font-semibold tabular-nums text-[#0d1f3c]">
                  {order.stoppedDays}d
                </td>
                <td className="px-3 py-3.5 text-neutral-700">
                  {order.partsNeeded.length}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="Ver detalhes"
                      aria-label="Ver detalhes"
                      onClick={() => onViewDetails(order.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-[#0d1f3c]/5 hover:text-[#0d1f3c]"
                    >
                      <HiEye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      </div>

      <div className="min-w-0 lg:hidden">
        {orders.length === 0 ? (
          <p className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-10 text-center text-sm text-neutral-500">
            Nenhuma ordem encontrada com os filtros atuais.
          </p>
        ) : (
          <ul className="flex flex-col gap-[var(--admin-gap)]">
            {orders.map((order) => (
              <li key={order.id}>
                <button
                  type="button"
                  onClick={() => onViewDetails(order.id)}
                  className="grid w-full grid-cols-[48px_minmax(0,1fr)_auto] grid-rows-[auto_auto] items-start gap-x-3 gap-y-1.5 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-3 py-3 text-left shadow-[0_1px_8px_rgba(13,31,60,0.04)] transition active:scale-[0.99] hover:border-accent/20"
                >
                  <span className="relative row-span-2 h-12 w-12 overflow-hidden rounded-2xl ring-2 ring-white shadow-sm">
                    <Image
                      src={order.kartPhoto}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </span>

                  <div className="col-start-2 row-start-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span
                        className={`inline-flex max-w-full min-w-0 items-center gap-1.5 rounded-md bg-[#fafbfc] px-1.5 py-0.5 text-[#0d1f3c] ring-1 ring-[rgba(17,17,17,0.06)]`}
                      >
                        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-neutral-500">
                          {order.osNumber}
                        </span>
                        <span className="shrink-0 text-neutral-400" aria-hidden>
                          ·
                        </span>
                        <span className="shrink-0 text-[11px] font-bold">
                          Kart {String(order.kartNumber).padStart(2, "0")}
                        </span>
                        {order.ownerName ? (
                          <>
                            <span className="shrink-0 text-neutral-400" aria-hidden>
                              ·
                            </span>
                            <span className="min-w-0 truncate text-[11px] font-semibold">
                              {order.ownerName}
                            </span>
                          </>
                        ) : null}
                      </span>
                      <MaintenancePriorityBadge priority={order.priority} />
                      <MaintenanceStatusBadge status={order.status} />
                    </div>
                  </div>

                  <div className="col-start-2 row-start-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={metaBadge}>{order.categoryName}</span>
                      <span className={metaBadge}>
                        {MaintenanceServiceMock.getTypeLabels()[order.type]}
                      </span>
                    </div>
                  </div>

                  <div className="col-start-3 row-span-2 flex items-center self-center">
                    <HiChevronRight
                      className="h-4 w-4 text-neutral-300"
                      aria-hidden
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {orders.length === 0 ? null : (
        <div className="mt-3">
          <MaintenanceTablePagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
