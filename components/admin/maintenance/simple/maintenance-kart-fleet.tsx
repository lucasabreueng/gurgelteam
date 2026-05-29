"use client";

import Image from "next/image";
import {
  HiChevronRight,
  HiClipboardDocumentCheck,
  HiClock,
  HiWrench,
} from "react-icons/hi2";
import type { MaintenanceFleetKart } from "@/lib/contracts/maintenance/simple";
import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";
import { MaintenanceKartStatusBadge } from "./maintenance-kart-status-badge";
import { MaintenanceTablePagination } from "../maintenance-table-pagination";

type Props = {
  karts: MaintenanceFleetKart[];
  mobileKarts: MaintenanceFleetKart[];
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onViewHistory: (kartId: string) => void;
  onNewInspection: (kartId: string) => void;
  onNewMaintenance: (kartId: string) => void;
};

function KartActions({
  kartId,
  onViewHistory,
  onNewInspection,
  onNewMaintenance,
  compact,
}: {
  kartId: string;
  onViewHistory: (id: string) => void;
  onNewInspection: (id: string) => void;
  onNewMaintenance: (id: string) => void;
  compact?: boolean;
}) {
  const btn = compact
    ? "flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wide text-[#0d1f3c]"
    : "flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-[#0d1f3c]/5 hover:text-[#0d1f3c]";

  return (
    <div className={compact ? "mt-2 flex gap-1.5" : "flex items-center justify-end gap-1"}>
      <button
        type="button"
        title="Ver histórico"
        aria-label="Ver histórico"
        onClick={() => onViewHistory(kartId)}
        className={btn}
      >
        <HiClock className="h-4 w-4 shrink-0" />
        {compact ? <span>Histórico</span> : null}
      </button>
      <button
        type="button"
        title="Nova inspeção"
        aria-label="Nova inspeção"
        onClick={() => onNewInspection(kartId)}
        className={btn}
      >
        <HiClipboardDocumentCheck className="h-4 w-4 shrink-0" />
        {compact ? <span>Inspeção</span> : null}
      </button>
      <button
        type="button"
        title="Nova manutenção"
        aria-label="Nova manutenção"
        onClick={() => onNewMaintenance(kartId)}
        className={btn}
      >
        <HiWrench className="h-4 w-4 shrink-0" />
        {compact ? <span>Manutenção</span> : null}
      </button>
    </div>
  );
}

export function MaintenanceKartFleet({
  karts,
  mobileKarts,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onViewHistory,
  onNewInspection,
  onNewMaintenance,
}: Props) {
  return (
    <div>
      <div className="hidden overflow-visible rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)] lg:block">
        <div className="overflow-x-auto rounded-t-2xl">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-4 py-3.5">Kart</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Última inspeção</th>
                <th className="px-3 py-3.5">Última manutenção</th>
                <th className="px-3 py-3.5">Próxima revisão</th>
                <th className="px-3 py-3.5">Custo no mês</th>
                <th className="px-4 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {karts.map((kart) => (
                <tr
                  key={kart.id}
                  className="border-b border-[rgba(17,17,17,0.05)] last:border-0 hover:bg-[#fafbfc]/80"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-2 ring-white shadow-sm">
                        <Image
                          src={kart.photo}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </span>
                      <span className="font-semibold tabular-nums text-[#0d1f3c]">
                        Kart {String(kart.number).padStart(2, "0")}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <MaintenanceKartStatusBadge status={kart.status} />
                  </td>
                  <td className="px-3 py-3.5 text-neutral-700">
                    {kart.lastInspection}
                  </td>
                  <td className="px-3 py-3.5 text-neutral-700">
                    {kart.lastMaintenance}
                  </td>
                  <td className="px-3 py-3.5 font-medium text-[#0d1f3c]">
                    {kart.nextRevision}
                  </td>
                  <td className="px-3 py-3.5 font-semibold tabular-nums text-[#0d1f3c]">
                    {MaintenanceServiceMock.formatCurrency(kart.monthlyCostCents)}
                  </td>
                  <td className="px-4 py-3.5">
                    <KartActions
                      kartId={kart.id}
                      onViewHistory={onViewHistory}
                      onNewInspection={onNewInspection}
                      onNewMaintenance={onNewMaintenance}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {karts.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-neutral-500">
            Nenhum kart encontrado com os filtros atuais.
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

      <div className="min-w-0 lg:hidden">
        {mobileKarts.length === 0 ? (
          <p className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-10 text-center text-sm text-neutral-500">
            Nenhum kart encontrado com os filtros atuais.
          </p>
        ) : (
          <ul className="flex flex-col gap-[var(--admin-gap)]">
            {mobileKarts.map((kart) => (
              <li key={kart.id}>
                <article className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-3 shadow-[0_1px_8px_rgba(13,31,60,0.04)]">
                  <div className="flex items-start gap-3">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white shadow-sm">
                      <Image
                        src={kart.photo}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[13px] font-bold text-[#0d1f3c]">
                          Kart {String(kart.number).padStart(2, "0")}
                        </span>
                        <MaintenanceKartStatusBadge status={kart.status} />
                      </div>
                      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                        <div>
                          <dt className="text-neutral-500">Última inspeção</dt>
                          <dd className="font-semibold text-[#111]">
                            {kart.lastInspection}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">Última manutenção</dt>
                          <dd className="font-semibold text-[#111]">
                            {kart.lastMaintenance}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">Próxima revisão</dt>
                          <dd className="font-semibold text-[#111]">
                            {kart.nextRevision}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">Custo no mês</dt>
                          <dd className="font-bold tabular-nums text-[#0d1f3c]">
                            {MaintenanceServiceMock.formatCurrency(
                              kart.monthlyCostCents,
                            )}
                          </dd>
                        </div>
                      </dl>
                      <KartActions
                        kartId={kart.id}
                        onViewHistory={onViewHistory}
                        onNewInspection={onNewInspection}
                        onNewMaintenance={onNewMaintenance}
                        compact
                      />
                    </div>
                    <HiChevronRight
                      className="mt-1 h-4 w-4 shrink-0 text-neutral-300"
                      aria-hidden
                    />
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
