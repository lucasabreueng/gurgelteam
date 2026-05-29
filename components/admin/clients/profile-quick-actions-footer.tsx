"use client";

import {
  HiCalendarDays,
  HiClipboardDocumentCheck,
  HiPaperAirplane,
} from "react-icons/hi2";

const ACTIONS = [
  { icon: HiCalendarDays, label: "Agendar aula" },
  { icon: HiClipboardDocumentCheck, label: "Registrar feedback" },
  { icon: HiPaperAirplane, label: "Enviar resultado" },
] as const;

export function ProfileQuickActionsFooter() {
  return (
    <div className="drawer-footer-actions grid w-full grid-cols-3 gap-2">
      {ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          className="btn-outline-sm flex w-full min-w-0 items-center justify-center gap-1.5 px-2 py-3"
        >
          <action.icon className="h-4 w-4 shrink-0" aria-hidden />
          <span className="truncate text-[10px] font-bold uppercase tracking-wide sm:text-[11px]">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}
