"use client";

import type { GurgelSlotStatus } from "@/lib/contracts/schedule";
import { NewClassServiceMock } from "@/services/schedule/newClassServiceMock";

const ROW_STYLES: Record<GurgelSlotStatus, string> = {
  available: "border-emerald-200/60 bg-emerald-50/50",
  busy: "border-[rgba(17,17,17,0.08)] bg-white",
  break: "border-sky-200/60 bg-sky-50/40",
  conflict: "border-amber-200/60 bg-amber-50/50",
  level_mismatch: "border-violet-200/60 bg-violet-50/50",
};

type Props = {
  date: string;
  selectedTime: string;
  onSelectTime: (time: string) => void;
};

export function GurgelTimeline({ date, selectedTime, onSelectTime }: Props) {
  const slots = NewClassServiceMock.buildGurgelTimeline(date);

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm md:p-5">
      <h2 className="text-sm font-bold text-[#0d1f3c]">
        Timeline — agenda do Gurgel
      </h2>
      <p className="mt-1 text-xs text-neutral-500">
        Aulas, horários livres e intervalos do dia
      </p>
      <ul className="relative mt-4 space-y-2">
        <span
          className="absolute left-[2.35rem] top-2 hidden h-[calc(100%-8px)] w-px bg-neutral-200 sm:block"
          aria-hidden
        />
        {slots.map((slot) => {
          const selected = selectedTime === slot.time;
          const clickable =
            slot.status === "available" ||
            slot.status === "conflict" ||
            slot.status === "level_mismatch";
          return (
            <li key={slot.time} className="flex gap-3">
              <time className="w-10 shrink-0 pt-2 text-right text-[10px] font-bold tabular-nums text-neutral-500">
                {slot.time}
              </time>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onSelectTime(slot.time)}
                className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-left transition ${
                  ROW_STYLES[slot.status]
                } ${selected ? "ring-2 ring-[#0d1f3c]" : ""} ${
                  clickable ? "hover:shadow-sm" : "cursor-default"
                }`}
              >
                <span className="text-xs font-bold text-[#0d1f3c]">
                  {slot.title}
                </span>
                {slot.detail ? (
                  <span className="mt-0.5 block text-[10px] text-neutral-600">
                    {slot.detail}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
