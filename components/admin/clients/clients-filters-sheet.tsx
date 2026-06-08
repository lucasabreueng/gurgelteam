"use client";

import { useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import type { KartCategory, SkillLevel } from "@/lib/contracts/settings";
import {
  adminDividerTopClass,
  adminDrawerTitleClass,
  adminOutlineButtonClass,
  adminPanelBgClass,
} from "@/lib/design";
import {
  ClientsFilters,
  type ClientsFilterState,
} from "./clients-filters";

type Props = {
  open: boolean;
  onClose: () => void;
  filters: ClientsFilterState;
  onChange: (patch: Partial<ClientsFilterState>) => void;
  onClear: () => void;
  resultCount: number;
  kartCategories: KartCategory[];
  skillLevels: SkillLevel[];
};

export function ClientsFiltersSheet({
  open,
  onClose,
  filters,
  onChange,
  onClear,
  resultCount,
  kartCategories,
  skillLevels,
}: Props) {
  useDrawerBodyLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[220] lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar filtros"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="clients-filters-title"
        className={`app-drawer-panel absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl p-4 shadow-2xl ${adminPanelBgClass}`}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="clients-filters-title"
            className={`text-base ${adminDrawerTitleClass}`}
          >
            Filtros
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500 hover:bg-white/80"
            aria-label="Fechar"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        <ClientsFilters
          filters={filters}
          onChange={onChange}
          kartCategories={kartCategories}
          skillLevels={skillLevels}
          layout="stacked"
        />

        <div className={`mt-4 flex flex-col gap-2 pt-4 ${adminDividerTopClass}`}>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary-md w-full"
          >
            Ver {resultCount} cliente{resultCount === 1 ? "" : "s"}
          </button>
          <button
            type="button"
            onClick={onClear}
            className={`w-full py-3 ${adminOutlineButtonClass}`}
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
