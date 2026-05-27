"use client";

import { LessonStatus } from "@/lib/contracts/enums";

function styleFor(status: LessonStatus) {
  switch (status) {
    case LessonStatus.SCHEDULED:
      return "bg-sky-50 text-sky-900 ring-sky-200/70";
    case LessonStatus.IN_PROGRESS:
      return "bg-amber-50 text-amber-950 ring-amber-200/70";
    case LessonStatus.PENDING_REGISTRATION:
    case LessonStatus.CONFIRMED:
      return "bg-violet-50 text-violet-950 ring-violet-200/70";
    case LessonStatus.COMPLETED:
      return "bg-emerald-50 text-emerald-900 ring-emerald-200/70";
    case LessonStatus.CANCELLED:
      return "bg-neutral-50 text-neutral-700 ring-neutral-200/70";
    default:
      return "bg-neutral-50 text-neutral-700 ring-neutral-200/70";
  }
}

function dotFor(status: LessonStatus) {
  switch (status) {
    case LessonStatus.SCHEDULED:
      return "bg-sky-500";
    case LessonStatus.IN_PROGRESS:
      return "bg-amber-500 animate-pulse";
    case LessonStatus.PENDING_REGISTRATION:
    case LessonStatus.CONFIRMED:
      return "bg-violet-500";
    case LessonStatus.COMPLETED:
      return "bg-emerald-500";
    case LessonStatus.CANCELLED:
      return "bg-neutral-500";
    default:
      return "bg-neutral-500";
  }
}

function labelFor(status: LessonStatus) {
  switch (status) {
    case LessonStatus.SCHEDULED:
      return "Aguardando";
    case LessonStatus.IN_PROGRESS:
      return "Em andamento";
    case LessonStatus.PENDING_REGISTRATION:
    case LessonStatus.CONFIRMED:
      return "Pendente de registro";
    case LessonStatus.COMPLETED:
      return "Concluída";
    case LessonStatus.CANCELLED:
      return "Cancelada";
    default:
      return "—";
  }
}

export function SessionStatusBadge({ status }: { status: LessonStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${styleFor(status)}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotFor(status)}`}
        aria-hidden
      />
      {labelFor(status)}
    </span>
  );
}
