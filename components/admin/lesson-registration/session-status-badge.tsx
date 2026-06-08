"use client";

import { LessonStatus } from "@/lib/contracts/enums";
import { StatusBadge } from "@/components/ui/status-badge";

function styleFor(status: LessonStatus) {
  switch (status) {
    case LessonStatus.SCHEDULED:
      return {
        className: "bg-sky-50 text-sky-900 ring-sky-200/70",
        dot: "bg-sky-500",
        pulse: false,
      };
    case LessonStatus.IN_PROGRESS:
      return {
        className: "bg-amber-50 text-amber-950 ring-amber-200/70",
        dot: "bg-amber-500",
        pulse: true,
      };
    case LessonStatus.PENDING_REGISTRATION:
      return {
        className: "bg-violet-50 text-violet-950 ring-violet-200/70",
        dot: "bg-violet-500",
        pulse: false,
      };
    case LessonStatus.COMPLETED:
      return {
        className: "bg-emerald-50 text-emerald-900 ring-emerald-200/70",
        dot: "bg-emerald-500",
        pulse: false,
      };
    case LessonStatus.CANCELLED:
      return {
        className: "bg-neutral-50 text-neutral-700 ring-neutral-200/70",
        dot: "bg-neutral-500",
        pulse: false,
      };
    default:
      return {
        className: "bg-neutral-50 text-neutral-700 ring-neutral-200/70",
        dot: "bg-neutral-500",
        pulse: false,
      };
  }
}

function labelFor(status: LessonStatus) {
  switch (status) {
    case LessonStatus.SCHEDULED:
      return "Aguardando";
    case LessonStatus.IN_PROGRESS:
      return "Em andamento";
    case LessonStatus.PENDING_REGISTRATION:
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
  const { className, dot, pulse } = styleFor(status);
  return (
    <StatusBadge className={className} dotClassName={dot} pulseDot={pulse}>
      {labelFor(status)}
    </StatusBadge>
  );
}
