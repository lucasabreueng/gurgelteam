"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import {
  adminDrawerHeaderSimpleClass,
  adminDrawerOverlayLightClass,
  adminDrawerPanelFormClass,
  adminDrawerTitleClass,
} from "@/lib/design";
import {
  DRAWER_FOOTER_INNER_CLASS,
  DRAWER_FOOTER_SHELL_CLASS,
} from "@/components/ui/drawer-footer";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** Shell lateral alinhado ao padrão dos drawers de clientes (`fixed` + painel à direita). */
export function TeamDrawerShell({
  open,
  onClose,
  title,
  titleId,
  children,
  footer,
}: Props) {
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
    <div className="fixed inset-0 z-[230] flex justify-end">
      <button
        type="button"
        className={adminDrawerOverlayLightClass}
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={adminDrawerPanelFormClass}
      >
        <header className={adminDrawerHeaderSimpleClass}>
          <div className="flex items-start justify-between gap-3">
            <h2 id={titleId} className={adminDrawerTitleClass}>
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"
              aria-label="Fechar"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer ? (
          <footer className={DRAWER_FOOTER_SHELL_CLASS}>
            <div className={DRAWER_FOOTER_INNER_CLASS}>{footer}</div>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
