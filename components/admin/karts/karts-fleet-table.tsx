"use client";

import Image from "next/image";
import { HiEye, HiPencil } from "react-icons/hi2";
import type { FleetKartListItem } from "@/lib/contracts/karts";
import { KartStatusBadge } from "./kart-status-badge";
import { KartMobileList } from "./kart-mobile-list";
import { KartsTablePagination } from "./karts-table-pagination";

const metaBadge =
  "inline-flex rounded-md border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-2 py-0.5 text-[11px] font-semibold text-[#0d1f3c]";

type Props = {
  /** Lista paginada — somente desktop. */
  karts: FleetKartListItem[];
  /** Lista completa filtrada — mobile/tablet retrato (scroll infinito). */
  mobileKarts: FleetKartListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
};

export function KartsFleetTable({
  karts,
  mobileKarts,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onViewDetails,
  onEdit,
}: Props) {
  return (
    <div>
      <div className="hidden overflow-visible rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)] lg:block">
        <div className="overflow-x-auto rounded-t-2xl">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-4 py-3.5">Kart</th>
                <th className="px-3 py-3.5">Categoria</th>
                <th className="px-3 py-3.5">Tipo</th>
                <th className="px-3 py-3.5">Motor</th>
                <th className="px-3 py-3.5">Chassi</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Último uso</th>
                <th className="px-3 py-3.5">Próx. manutenção</th>
                <th className="px-3 py-3.5">Horas</th>
                <th className="px-3 py-3.5">Score</th>
                <th className="px-4 py-3.5 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {karts.map((kart) => {
                const isClient = kart.ownership === "client";

                return (
                  <tr
                    key={kart.id}
                    className="border-b border-[rgba(17,17,17,0.05)] transition last:border-0 hover:bg-[#fafbfc]/80"
                  >
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={() => onViewDetails(kart.id)}
                        className="flex items-center gap-3 text-left transition hover:opacity-80"
                      >
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-2 ring-white shadow-sm">
                          <Image
                            src={kart.photo}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </span>
                        <span>
                          <span className="block font-semibold text-[#0d1f3c]">
                            Kart {String(kart.number).padStart(2, "0")}
                          </span>
                          {isClient && kart.ownerName ? (
                            <span className="text-[10px] font-medium text-neutral-600">
                              {kart.ownerName}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={metaBadge}>{kart.categoryName}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={metaBadge}>
                        {isClient ? "Cliente" : "Próprio"}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 font-medium text-neutral-700">
                      {kart.motor}
                    </td>
                    <td className="px-3 py-3.5 text-neutral-700">{kart.chassis}</td>
                    <td className="px-3 py-3.5">
                      <KartStatusBadge status={kart.status} />
                    </td>
                    <td className="px-3 py-3.5 text-neutral-700">{kart.lastUse}</td>
                    <td
                      className={`px-3 py-3.5 font-semibold ${
                        kart.nextMaintenanceDays < 0
                          ? "text-red-700"
                          : "text-neutral-700"
                      }`}
                    >
                      {kart.nextMaintenance}
                    </td>
                    <td className="px-3 py-3.5 font-semibold tabular-nums text-[#0d1f3c]">
                      {kart.usageHours}h
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="inline-flex min-w-[2.25rem] items-center justify-center rounded-lg bg-[#0d1f3c]/[0.06] px-2 py-1 text-sm font-bold tabular-nums text-[#0d1f3c]">
                        {kart.score}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="Detalhes"
                          aria-label="Detalhes"
                          onClick={() => onViewDetails(kart.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-[#0d1f3c]/5 hover:text-[#0d1f3c]"
                        >
                          <HiEye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Editar"
                          aria-label="Editar kart"
                          onClick={() => onEdit(kart.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-[#0d1f3c]/5 hover:text-[#0d1f3c]"
                        >
                          <HiPencil className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {karts.length === 0 ? null : (
          <KartsTablePagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>

      <KartMobileList karts={mobileKarts} onViewDetails={onViewDetails} />
    </div>
  );
}
