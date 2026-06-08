"use client";



import { useEffect, useState } from "react";

import type { GurgelSlotStatus } from "@/lib/contracts/schedule";

import { getAppServices } from "@/lib/data-source/app-services";

import type { GurgelTimelineSlot } from "@/lib/schedule/gurgel-timeline";

import { adminCardClass } from "@/lib/design";



const ROW_STYLES: Record<GurgelSlotStatus, string> = {

  available: "border-[var(--ds-success-border)] bg-[var(--ds-success-bg)]",

  busy: "border-[var(--ds-border)] bg-[var(--ds-bg-card)]",

  break: "border-[var(--ds-info-border)] bg-[var(--ds-info-bg)]",

  conflict: "border-[var(--ds-warning-border)] bg-[var(--ds-warning-bg)]",

  level_mismatch: "border-[var(--ds-info-border)] bg-[var(--ds-info-bg)]",

};



type Props = {

  date: string;

  selectedTime: string;

  onSelectTime: (time: string) => void;

};



export function GurgelTimeline({ date, selectedTime, onSelectTime }: Props) {

  const { newClass } = getAppServices();

  const [slots, setSlots] = useState<GurgelTimelineSlot[]>([]);

  const [loading, setLoading] = useState(false);



  useEffect(() => {

    let cancelled = false;

    setLoading(true);



    void newClass

      .buildGurgelTimeline(date)

      .then((next) => {

        if (!cancelled) setSlots(next);

      })

      .catch(() => {

        if (!cancelled) setSlots([]);

      })

      .finally(() => {

        if (!cancelled) setLoading(false);

      });



    return () => {

      cancelled = true;

    };

  }, [date, newClass]);



  return (

    <section className={`${adminCardClass} p-4 md:p-5`}>

      <h2 className="text-sm font-bold text-[var(--ds-text-primary)]">

        Timeline — agenda do Gurgel

      </h2>

      <p className="mt-1 text-xs text-[var(--ds-text-muted)]">

        Aulas, horários livres e intervalos do dia

      </p>

      {loading ? (

        <p className="mt-4 text-xs text-[var(--ds-text-muted)]">Carregando…</p>

      ) : (

        <ul className="relative mt-4 space-y-2">

          <span

            className="absolute left-[2.35rem] top-2 hidden h-[calc(100%-8px)] w-px bg-[var(--ds-border)] sm:block"

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

                <time className="w-10 shrink-0 pt-2 text-right text-[10px] font-bold tabular-nums text-[var(--ds-text-muted)]">

                  {slot.time}

                </time>

                <button

                  type="button"

                  disabled={!clickable}

                  onClick={() => clickable && onSelectTime(slot.time)}

                  className={`min-w-0 flex-1 rounded-xl border px-3 py-2.5 text-left transition ${

                    ROW_STYLES[slot.status]

                  } ${selected ? "ring-2 ring-accent" : ""} ${

                    clickable ? "hover:shadow-sm" : "cursor-default"

                  }`}

                >

                  <span className="text-xs font-bold text-[var(--ds-text-primary)]">

                    {slot.title}

                  </span>

                  {slot.detail ? (

                    <span className="mt-0.5 block text-[10px] text-[var(--ds-text-secondary)]">

                      {slot.detail}

                    </span>

                  ) : null}

                </button>

              </li>

            );

          })}

        </ul>

      )}

    </section>

  );

}

