"use client";

import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

import { SettingsDropdown } from "../settings/settings-dropdown";

type Props = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

const pageSizeOptions = MaintenanceServiceMock.getTablePageSizes().map((size) => ({
  value: String(size),
  label: String(size),
}));

export function MaintenanceTablePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);

  return (
    <div className="relative z-20 flex flex-col gap-4 overflow-visible border-t border-[rgba(17,17,17,0.08)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-5">
      <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
        <div className="relative z-20 flex items-center gap-2">
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Linhas
          </span>
          <div className="relative z-30 w-[88px]">
            <SettingsDropdown
              aria-label="Linhas por página"
              value={String(pageSize)}
              options={pageSizeOptions}
              onSelect={(value) => onPageSizeChange(Number(value))}
            />
          </div>
        </div>
        <span>
          {totalItems === 0
            ? "Nenhum registro"
            : `${start}–${end} de ${totalItems}`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-[rgba(17,17,17,0.1)] bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/30 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página anterior"
        >
          <HiChevronLeft className="h-4 w-4" aria-hidden />
          Anterior
        </button>
        <span className="min-w-[4.5rem] text-center text-[12px] font-semibold tabular-nums text-neutral-600">
          {safePage} / {totalPages}
        </span>
        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          className="inline-flex h-9 items-center gap-1 rounded-xl border border-[rgba(17,17,17,0.1)] bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/30 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Próxima página"
        >
          Próxima
          <HiChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
