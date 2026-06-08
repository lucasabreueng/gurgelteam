"use client";

import type { ReactNode } from "react";
import type { GurgelSlotStatus } from "@/lib/contracts/schedule";
import type { GurgelTimelineSlot } from "@/lib/schedule/gurgel-timeline";
import { adminCardClass } from "@/lib/design";

const STATUS_STYLES: Record<
  GurgelSlotStatus,
  { label: string; pill: string; dot: string }
> = {
  available: {
    label: "Disponível",
    pill: "bg-[var(--ds-success-bg)] text-[var(--ds-success-text)] ring-[var(--ds-success-border)]",
    dot: "bg-emerald-500",
  },
  busy: {
    label: "Ocupado",
    pill: "bg-[var(--ds-bg-muted)] text-[var(--ds-text-secondary)] ring-[var(--ds-border-field)]",
    dot: "bg-neutral-500",
  },
  break: {
    label: "Indisponível",
    pill: "bg-[var(--ds-info-bg)] text-[var(--ds-info-text)] ring-[var(--ds-info-border)]",
    dot: "bg-sky-500",
  },
  conflict: {
    label: "Atenção",
    pill: "bg-[var(--ds-warning-bg)] text-[var(--ds-warning-text)] ring-[var(--ds-warning-border)]",
    dot: "bg-amber-500",
  },
  level_mismatch: {
    label: "Outro nível",
    pill: "bg-[var(--ds-info-bg)] text-[var(--ds-info-text)] ring-[var(--ds-info-border)]",
    dot: "bg-violet-500",
  },
};

type Props = {
  date: string;
  categoryId: string;
  categoryLabel: string;
  slots: GurgelTimelineSlot[];
  loading?: boolean;
  selectedTime: string;
  levelOverrideTimes: Set<string>;
  onSelectTime: (time: string) => void;
};

function AvailabilityShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={`${adminCardClass} p-4 md:p-5`}>
      <h2 className="text-sm font-bold text-[var(--ds-text-primary)]">{title}</h2>
      {children}
    </section>
  );
}

export function GurgelAvailabilityStatus({
  date,
  categoryId,
  categoryLabel,
  slots,
  loading = false,
  selectedTime,
  levelOverrideTimes,
  onSelectTime,
}: Props) {
  if (!categoryId) {
    return (
      <AvailabilityShell title="Horário da aula">
        <p className="mt-2 text-xs text-[var(--ds-text-muted)]">
          Selecione o aluno e a categoria para ver os horários disponíveis.
        </p>
      </AvailabilityShell>
    );
  }

  if (loading) {
    return (
      <AvailabilityShell title="Horário da aula">
        <p className="mt-2 text-xs text-[var(--ds-text-muted)]">Carregando horários…</p>
      </AvailabilityShell>
    );
  }

  if (slots.length === 0) {
    return (
      <AvailabilityShell title="Horário da aula">
        <p className="mt-2 text-xs text-[var(--ds-text-muted)]">
          Nenhum horário cadastrado para {categoryLabel} neste dia.
        </p>
      </AvailabilityShell>
    );
  }

  return (
    <AvailabilityShell title="Horário da aula">
      <p className="mt-1 text-xs text-[var(--ds-text-muted)]">
        Horários da categoria {categoryLabel} · grade do kartódromo · {date}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((slot) => {
          const st = STATUS_STYLES[slot.status];
          const selected = selectedTime === slot.time;
          const disabled = slot.status === "busy" || slot.status === "break";
          const overridden =
            slot.status === "level_mismatch" && levelOverrideTimes.has(slot.time);

          return (
            <button
              key={slot.slotId}
              type="button"
              disabled={disabled}
              onClick={() => onSelectTime(slot.time)}
              className={`rounded-xl border-2 px-2 py-2.5 text-left transition ${
                selected
                  ? "border-accent bg-accent text-white"
                  : disabled
                    ? "cursor-not-allowed border-transparent bg-[var(--ds-bg-muted)] opacity-60"
                    : "border-[var(--ds-border-field)] bg-[var(--ds-bg-card)] hover:border-accent/30"
              }`}
            >
              <span className="block text-xs font-black tabular-nums">
                {slot.time}
                <span className="font-semibold opacity-80"> – {slot.end}</span>
              </span>
              <span
                className={`mt-1 inline-flex items-center gap-1 rounded px-1 py-0.5 text-[9px] font-bold uppercase ring-1 ${
                  selected ? "bg-white/15 text-white ring-white/20" : st.pill
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${selected ? "bg-white" : st.dot}`}
                />
                {overridden ? "Liberado" : st.label}
              </span>
              <span
                className={`mt-1 block text-[9px] font-semibold uppercase ${
                  selected ? "text-white/80" : "text-[var(--ds-text-muted)]"
                }`}
              >
                {slot.levelName}
              </span>
            </button>
          );
        })}
      </div>
    </AvailabilityShell>
  );
}
