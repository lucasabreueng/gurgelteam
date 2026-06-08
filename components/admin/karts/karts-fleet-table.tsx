"use client";

import Image from "next/image";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import type { FleetKartListItem } from "@/lib/contracts/karts";
import { EmptyState } from "@/components/ui/empty-state";
import {
  adminAvatarRingClass,
  adminMetaBadgeClass,
  adminTableActionButtonClass,
  adminTableBodyRowClass,
  adminTableHeadRowClass,
  adminTableScrollClass,
  adminTableScoreChipClass,
  adminTableWrapClass,
  adminTextAccentBoldClass,
} from "@/lib/design";
import { KartFleetStatusBadge } from "./kart-fleet-status-badge";
import {
  CorrectiveMaintenanceCell,
  PreventiveMaintenanceCell,
} from "./kart-maintenance-cells";
import { KartMobileList } from "./kart-mobile-list";
import { KartsTablePagination } from "./karts-table-pagination";

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
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
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
  onDelete,
}: Props) {
  return (
    <div>
      <div className={`hidden lg:block ${adminTableWrapClass}`}>
        <div className={adminTableScrollClass}>
          <table className="w-full min-w-[1280px] text-left text-sm">
            <thead>
              <tr className={adminTableHeadRowClass}>
                <th className="px-4 py-3.5">Kart</th>
                <th className="px-3 py-3.5">Categoria</th>
                <th className="px-3 py-3.5">Tipo</th>
                <th className="px-3 py-3.5">Motor</th>
                <th className="px-3 py-3.5">Chassi</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Último uso</th>
                <th className="px-3 py-3.5">Manutenção preventiva</th>
                <th className="px-3 py-3.5">Manutenção corretiva</th>
                <th className="px-3 py-3.5">Horas</th>
                <th className="px-3 py-3.5">Score</th>
                <th className="px-4 py-3.5 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {karts.length === 0 ? (
                <tr>
                  <td colSpan={12}>
                    <EmptyState
                      compact
                      title="Nenhum kart encontrado"
                      description="Ajuste os filtros ou cadastre um novo kart na frota."
                    />
                  </td>
                </tr>
              ) : (
                karts.map((kart) => {
                  const isClient = kart.ownership === "client";

                  return (
                    <tr key={kart.id} className={adminTableBodyRowClass}>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => onViewDetails(kart.id)}
                          className="flex items-center gap-3 text-left transition hover:opacity-80"
                        >
                          <span
                            className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-xl shadow-sm ${adminAvatarRingClass}`}
                          >
                            <Image
                              src={kart.photo}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </span>
                          <span>
                            <span className={`block font-semibold ${adminTextAccentBoldClass}`}>
                              Kart {String(kart.number).padStart(2, "0")}
                            </span>
                            {isClient && kart.ownerName ? (
                              <span className="text-[10px] font-medium text-[var(--ds-text-secondary)]">
                                {kart.ownerName}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className={adminMetaBadgeClass}>{kart.categoryName}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className={adminMetaBadgeClass}>
                          {isClient ? "Cliente" : "Próprio"}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 font-medium text-[var(--ds-text-secondary)]">
                        {kart.motor}
                      </td>
                      <td className="px-3 py-3.5 text-[var(--ds-text-secondary)]">
                        {kart.chassis}
                      </td>
                      <td className="px-3 py-3.5">
                        <KartFleetStatusBadge status={kart.fleetStatus} />
                      </td>
                      <td className="px-3 py-3.5 text-[var(--ds-text-secondary)]">
                        {kart.lastUse}
                      </td>
                      <td className="px-3 py-3.5">
                        <PreventiveMaintenanceCell kart={kart} />
                      </td>
                      <td className="px-3 py-3.5">
                        <CorrectiveMaintenanceCell kart={kart} />
                      </td>
                      <td className={`px-3 py-3.5 font-semibold tabular-nums ${adminTextAccentBoldClass}`}>
                        {kart.usageHours}h
                      </td>
                      <td className="px-3 py-3.5">
                        <span className={adminTableScoreChipClass}>{kart.score}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title="Detalhes"
                            aria-label="Detalhes"
                            onClick={() => onViewDetails(kart.id)}
                            className={adminTableActionButtonClass}
                          >
                            <HiEye className="h-4 w-4" />
                          </button>
                          {onEdit ? (
                            <button
                              type="button"
                              title="Editar"
                              aria-label="Editar kart"
                              onClick={() => onEdit(kart.id)}
                              className={adminTableActionButtonClass}
                            >
                              <HiPencil className="h-4 w-4" />
                            </button>
                          ) : null}
                          {onDelete ? (
                            <button
                              type="button"
                              title="Excluir"
                              aria-label="Excluir kart"
                              onClick={() => onDelete(kart.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--ds-text-muted)] transition hover:bg-[var(--ds-error-bg)] hover:text-[var(--ds-error-text)]"
                            >
                              <HiTrash className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
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
