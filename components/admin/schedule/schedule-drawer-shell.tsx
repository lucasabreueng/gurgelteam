"use client";

import { useEffect } from "react";
import { HiArrowLeft, HiXMark } from "react-icons/hi2";
import type { ReactNode } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { DRAWER_FOOTER_INNER_CLASS, DRAWER_FOOTER_SHELL_CLASS } from "@/components/ui/drawer-footer";

/** Largura padrão dos drawers da agenda admin. */
export const SCHEDULE_DRAWER_PANEL_CLASS =
  "app-drawer-panel relative flex h-full w-full max-w-full flex-col bg-[#f3f5f9] shadow-2xl lg:w-[min(100%,480px)] lg:max-w-[480px] lg:shrink-0";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Ex.: voltar para a lista de agendamentos do dia (mobile). */
  onBack?: () => void;
  title: string;
  titleId?: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Ações ao lado do botão fechar (ex.: Editar no registro de aulas). */
  headerActions?: ReactNode;
  ariaLabel?: string;
  zIndexClass?: string;
  /** Substitui classes do painel (ex.: drawer largo de detalhe do kart). */
  panelClassName?: string;
};

export function ScheduleDrawerShell({
  open,
  onClose,
  onBack,
  title,
  titleId,
  description,
  children,
  footer,
  headerActions,
  ariaLabel,
  zIndexClass = "z-[225]",
  panelClassName = SCHEDULE_DRAWER_PANEL_CLASS,
}: Props) {
  const headingId = titleId ?? "schedule-drawer-title";

  useDrawerBodyLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} flex max-lg:justify-stretch lg:justify-end`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        aria-labelledby={headingId}
        className={panelClassName}
      >
        <header className="shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white px-4 py-4 md:px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2
                id={headingId}
                className="text-xl font-bold text-[#0d1f3c]"
              >
                {title}
              </h2>
              {description ? (
                <div className="mt-1 text-sm text-neutral-600">{description}</div>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
                  aria-label="Voltar"
                >
                  <HiArrowLeft className="h-5 w-5" />
                </button>
              ) : null}
              {headerActions ? (
                <div className="flex items-center gap-1.5">{headerActions}</div>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
                aria-label="Fechar"
              >
                <HiXMark className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

        {footer ? (
          <footer className={DRAWER_FOOTER_SHELL_CLASS}>
            <div className={DRAWER_FOOTER_INNER_CLASS}>{footer}</div>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
