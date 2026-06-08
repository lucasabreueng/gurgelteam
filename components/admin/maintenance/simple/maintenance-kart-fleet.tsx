"use client";

import Image from "next/image";
import {
  HiChevronRight,
  HiClipboardDocumentCheck,
  HiClock,
  HiWrench,
} from "react-icons/hi2";
import type { MaintenanceFleetKart } from "@/lib/contracts/maintenance/simple";
import { getAppServices } from "@/lib/data-source/app-services";
import {
  adminTableActionButtonClass,
  adminTableBodyRowClass,
  adminTableHeadRowClass,
  adminTableScrollClass,
  adminTableWrapClass,
} from "@/lib/design";
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

function PreventiveMaintenanceCell({
  kart,
}: {
  kart: MaintenanceFleetKart;
}) {
  const { mostUrgent } = kart.preventiveMaintenance;
  const tone = mostUrgent.overdue
    ? "text-red-700"
    : mostUrgent.hoursRemaining <= 2
      ? "text-amber-800"
      : "text-[#0d1f3c]";

  return (
    <div className="min-w-[180px]">
      <p className={`text-[13px] font-semibold leading-snug ${tone}`}>
        {mostUrgent.displayLabel}
      </p>
      <p className="mt-0.5 text-[11px] text-neutral-500">
        Motor: {kart.engineHours.toLocaleString("pt-BR")}h · próx. em{" "}
        {mostUrgent.nextDueHours.toLocaleString("pt-BR")}h
      </p>
    </div>
  );
}

function CorrectiveMaintenanceCell({
  kart,
}: {
  kart: MaintenanceFleetKart;
}) {
  const { correctiveMaintenance } = kart;
  if (correctiveMaintenance.status === "none") {
    return <span className="text-neutral-500">—</span>;
  }

  const tone =
    correctiveMaintenance.status === "checklist_aberto"
      ? "text-amber-900 bg-amber-50 ring-amber-200/60"
      : "text-sky-900 bg-sky-50 ring-sky-200/60";

  return (
    <span
      className={`inline-flex max-w-[220px] rounded-lg px-2 py-1 text-[11px] font-semibold leading-snug ring-1 ${tone}`}
    >
      {correctiveMaintenance.label}
    </span>
  );
}

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
    ? "flex h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-[var(--ds-border)] bg-[var(--ds-bg-muted)] text-[10px] font-bold uppercase tracking-wide text-[var(--ds-text-primary)]"
    : adminTableActionButtonClass;

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
  const formatCurrency = getAppServices().maintenance.formatCurrency;

  return (
    <div>
      <div className={`hidden lg:block ${adminTableWrapClass}`}>
        <div className={adminTableScrollClass}>
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className={adminTableHeadRowClass}>
                <th className="px-4 py-3.5">Kart</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Última inspeção</th>
                <th className="px-3 py-3.5">Última manutenção</th>
                <th className="px-3 py-3.5">Manutenção preventiva</th>
                <th className="px-3 py-3.5">Manutenção corretiva</th>
                <th className="px-3 py-3.5">Custo no mês</th>
                <th className="px-4 py-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {karts.map((kart) => (
                <tr key={kart.id} className={adminTableBodyRowClass}>
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
                  <td className="px-3 py-3.5">
                    <PreventiveMaintenanceCell kart={kart} />
                  </td>
                  <td className="px-3 py-3.5">
                    <CorrectiveMaintenanceCell kart={kart} />
                  </td>
                  <td className="px-3 py-3.5 font-semibold tabular-nums text-[#0d1f3c]">
                    {formatCurrency(kart.monthlyCostCents)}
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
                      <dl className="mt-2 grid grid-cols-1 gap-y-2 text-[11px]">
                        <div className="grid grid-cols-2 gap-x-3">
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
                        </div>
                        <div>
                          <dt className="text-neutral-500">Manutenção preventiva</dt>
                          <dd className="mt-0.5">
                            <PreventiveMaintenanceCell kart={kart} />
                          </dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">Manutenção corretiva</dt>
                          <dd className="mt-0.5">
                            <CorrectiveMaintenanceCell kart={kart} />
                          </dd>
                        </div>
                        <div>
                          <dt className="text-neutral-500">Custo no mês</dt>
                          <dd className="font-bold tabular-nums text-[#0d1f3c]">
                            {formatCurrency(kart.monthlyCostCents)}
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
