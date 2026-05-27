"use client";

import { LessonStatus } from "@/lib/contracts/enums";

const STYLES: Record<
  "concluido" | "em_andamento" | "pendente" | "cancelado",
  { wrap: string; dot: string; label: string; pulse?: boolean }
> = {
  concluido: {
    wrap: "bg-emerald-50 text-emerald-900 ring-emerald-200/70",
    dot: "bg-emerald-500",
    label: "Concluído",
  },
  em_andamento: {
    wrap: "bg-amber-50 text-amber-950 ring-amber-200/70",
    dot: "bg-amber-500",
    label: "Em andamento",
    pulse: true,
  },
  pendente: {
    wrap: "bg-violet-50 text-violet-950 ring-violet-200/70",
    dot: "bg-violet-500",
    label: "Pendente",
  },
  cancelado: {
    wrap: "bg-neutral-50 text-neutral-700 ring-neutral-200/70",
    dot: "bg-neutral-500",
    label: "Cancelado",
  },
};

function resolveVariant(status: LessonStatus): keyof typeof STYLES {
  if (status === LessonStatus.COMPLETED) return "concluido";
  if (status === LessonStatus.IN_PROGRESS) return "em_andamento";
  if (status === LessonStatus.CANCELLED) return "cancelado";
  return "pendente";
}

export function RegistrationListStatusBadge({
  status,
}: {
  status: LessonStatus;
}) {
  const variant = STYLES[resolveVariant(status)];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${variant.wrap}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${variant.dot} ${variant.pulse ? "animate-pulse" : ""}`}
        aria-hidden
      />
      {variant.label}
    </span>
  );
}
