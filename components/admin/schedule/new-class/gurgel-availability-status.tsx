"use client";

import type { GurgelSlotStatus } from "@/lib/contracts/schedule";
import { NewClassServiceMock } from "@/services/schedule/newClassServiceMock";

const STATUS_STYLES: Record<
  GurgelSlotStatus,
  { label: string; pill: string; dot: string }
> = {
  available: {
    label: "Disponível",
    pill: "bg-emerald-100 text-emerald-900 ring-emerald-200/80",
    dot: "bg-emerald-500",
  },
  busy: {
    label: "Ocupado",
    pill: "bg-neutral-200 text-neutral-700 ring-neutral-300/60",
    dot: "bg-neutral-500",
  },
  break: {
    label: "Indisponível",
    pill: "bg-sky-100 text-sky-900 ring-sky-200/80",
    dot: "bg-sky-500",
  },
  conflict: {
    label: "Atenção",
    pill: "bg-amber-100 text-amber-900 ring-amber-200/80",
    dot: "bg-amber-500",
  },
  level_mismatch: {
    label: "Outro nível",
    pill: "bg-violet-100 text-violet-900 ring-violet-200/80",
    dot: "bg-violet-500",
  },
};

type Props = {
  date: string;
  categoryId: string;
  studentLevelId?: string;
  selectedTime: string;
  levelOverrideTimes: Set<string>;
  onSelectTime: (time: string) => void;
};

export function GurgelAvailabilityStatus({
  date,
  categoryId,
  studentLevelId,
  selectedTime,
  levelOverrideTimes,
  onSelectTime,
}: Props) {
  if (!categoryId) {
    return (
      <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm md:p-5">
        <h2 className="text-sm font-bold text-[#0d1f3c]">Horário da aula</h2>
        <p className="mt-2 text-xs text-neutral-500">
          Selecione o aluno e a categoria para ver os horários disponíveis.
        </p>
      </section>
    );
  }

  const slots = NewClassServiceMock.buildGurgelTimeline(date, {
    categoryId,
    studentLevelId,
  });

  if (slots.length === 0) {
    return (
      <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm md:p-5">
        <h2 className="text-sm font-bold text-[#0d1f3c]">Horário da aula</h2>
        <p className="mt-2 text-xs text-neutral-500">
          Nenhum horário cadastrado para {NewClassServiceMock.getCategoryLabel(categoryId)} neste
          dia.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm md:p-5">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Horário da aula</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Horários da categoria {NewClassServiceMock.getCategoryLabel(categoryId)} · grade do
        kartódromo
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
                  ? "border-[#0d1f3c] bg-[#0d1f3c] text-white"
                  : disabled
                    ? "cursor-not-allowed border-transparent bg-neutral-100 opacity-60"
                    : "border-[rgba(17,17,17,0.08)] bg-white hover:border-accent/30"
              }`}
            >
              <span className="block text-xs font-black tabular-nums">
                {slot.time}
                <span className="font-semibold opacity-80"> – {slot.end}</span>
              </span>
              <span
                className={`mt-1 inline-flex items-center gap-1 rounded px-1 py-0.5 text-[9px] font-bold uppercase ${
                  selected ? "bg-white/15 text-white" : st.pill
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${selected ? "bg-white" : st.dot}`}
                />
                {overridden ? "Liberado" : st.label}
              </span>
              <span
                className={`mt-1 block text-[9px] font-semibold uppercase ${
                  selected ? "text-white/80" : "text-neutral-500"
                }`}
              >
                {slot.levelName}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
