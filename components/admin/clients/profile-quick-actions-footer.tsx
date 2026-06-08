"use client";

import {
  HiCalendarDays,
  HiClipboardDocumentCheck,
  HiCurrencyDollar,
  HiPaperAirplane,
} from "react-icons/hi2";

type Props = {
  onScheduleClass?: () => void;
  onRegisterFeedback?: () => void;
  onSendResult?: () => void;
  onGenerateCharge?: () => void;
};

export function ProfileQuickActionsFooter({
  onScheduleClass,
  onRegisterFeedback,
  onSendResult,
  onGenerateCharge,
}: Props) {
  return (
    <div className="drawer-footer-actions grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
      <button
        type="button"
        onClick={onScheduleClass}
        className="btn-outline-sm flex w-full min-w-0 items-center justify-center gap-1.5 px-2 py-3"
      >
        <HiCalendarDays className="h-4 w-4 shrink-0" aria-hidden />
        <span className="truncate text-[10px] font-bold uppercase tracking-wide sm:text-[11px]">
          Agendar aula
        </span>
      </button>
      <button
        type="button"
        onClick={onRegisterFeedback}
        className="btn-outline-sm flex w-full min-w-0 items-center justify-center gap-1.5 px-2 py-3"
      >
        <HiClipboardDocumentCheck className="h-4 w-4 shrink-0" aria-hidden />
        <span className="truncate text-[10px] font-bold uppercase tracking-wide sm:text-[11px]">
          Registrar feedback
        </span>
      </button>
      <button
        type="button"
        onClick={onSendResult}
        className="btn-outline-sm flex w-full min-w-0 items-center justify-center gap-1.5 px-2 py-3"
      >
        <HiPaperAirplane className="h-4 w-4 shrink-0" aria-hidden />
        <span className="truncate text-[10px] font-bold uppercase tracking-wide sm:text-[11px]">
          Enviar resultado
        </span>
      </button>
      <button
        type="button"
        onClick={onGenerateCharge}
        className="btn-outline-sm flex w-full min-w-0 items-center justify-center gap-1.5 px-2 py-3"
      >
        <HiCurrencyDollar className="h-4 w-4 shrink-0" aria-hidden />
        <span className="truncate text-[10px] font-bold uppercase tracking-wide sm:text-[11px]">
          Gerar cobrança
        </span>
      </button>
    </div>
  );
}
