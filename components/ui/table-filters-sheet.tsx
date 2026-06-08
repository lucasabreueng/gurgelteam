"use client";

import { useEffect, type ReactNode } from "react";
import { HiXMark } from "react-icons/hi2";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  onClear?: () => void;
  applyLabel?: string;
  onApply?: () => void;
};

/** Painel inferior de filtros — mobile/tablet (< lg). */
export function TableFiltersSheet({
  open,
  onClose,
  title = "Filtros",
  children,
  onClear,
  applyLabel = "Aplicar filtros",
  onApply,
}: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();
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

  const handleApply = () => {
    onApply?.();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[220] ${tabletLandscape ? "hidden" : "lg:hidden"}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar filtros"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="table-filters-sheet-title"
        className="app-drawer-panel absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-[var(--ds-bg-panel)] p-4 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="table-filters-sheet-title"
            className="text-base font-bold text-[var(--ds-text-primary)]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[var(--ds-text-muted)] hover:bg-[var(--ds-bg-muted)]"
            aria-label="Fechar"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        {children}

        <div className="mt-4 flex flex-col gap-2 border-t border-[var(--ds-border)] pt-4">
          <button
            type="button"
            onClick={handleApply}
            className="w-full rounded-xl bg-accent py-3.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-[var(--ds-shadow-primary-btn)] transition hover:brightness-110"
          >
            {applyLabel}
          </button>
          {onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="w-full rounded-xl border border-[var(--ds-border-field)] bg-transparent py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-primary)] transition hover:bg-[var(--ds-bg-muted)]"
            >
              Limpar filtros
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
