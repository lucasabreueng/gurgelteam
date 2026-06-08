"use client";

import { LessonStatus } from "@/lib/contracts/enums";
import {
  adminBadgeInfoClass,
  adminBadgeNeutralStatusClass,
  adminBadgeSuccessClass,
  adminBadgeWarningClass,
} from "@/lib/design";

const STYLES: Record<
  "concluido" | "em_andamento" | "pendente" | "cancelado",
  { wrap: string; dot: string; label: string; pulse?: boolean }
> = {
  concluido: {
    wrap: adminBadgeSuccessClass,
    dot: "bg-emerald-500",
    label: "Concluído",
  },
  em_andamento: {
    wrap: adminBadgeWarningClass,
    dot: "bg-amber-500",
    label: "Em andamento",
    pulse: true,
  },
  pendente: {
    wrap: adminBadgeInfoClass,
    dot: "bg-violet-500",
    label: "Pendente",
  },
  cancelado: {
    wrap: adminBadgeNeutralStatusClass,
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
