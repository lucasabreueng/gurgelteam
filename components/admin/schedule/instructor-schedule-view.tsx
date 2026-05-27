"use client";

import Image from "next/image";
import type { ScheduleEvent, ScheduleInstructor } from "@/lib/contracts/schedule";
import { ScheduleEventCard } from "./schedule-event-card";

type Props = {
  instructors: ScheduleInstructor[];
  events: ScheduleEvent[];
  onEventClick: (id: string) => void;
};

const STATUS_LABEL = {
  disponivel: "Disponível",
  em_aula: "Em aula",
  pausa: "Pausa",
};

export function InstructorScheduleView({
  instructors,
  events,
  onEventClick,
}: Props) {
  return (
    <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {instructors.map((inst) => {
        const instEvents = events.filter((e) => e.instructorId === inst.id);
        return (
          <article
            key={inst.id}
            className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl ring-2 ring-[#0d1f3c]/10">
                <Image src={inst.avatar} alt="" fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-[#0d1f3c]">{inst.name}</h3>
                <p className="text-xs text-neutral-500">
                  {STATUS_LABEL[inst.status]} · {inst.occupancy}% ocupação
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${inst.occupancy}%` }}
              />
            </div>
            <p className="mt-3 text-[10px] font-bold uppercase text-neutral-500">
              Livres: {inst.freeSlots.join(", ") || "—"}
            </p>
            <p className="mt-1 text-xs text-neutral-600">
              Alunos: {inst.studentsToday.join(" · ")}
            </p>
            <ul className="mt-4 space-y-2">
              {instEvents.length > 0 ? (
                instEvents.map((ev) => (
                  <ScheduleEventCard
                    key={ev.id}
                    event={ev}
                    onClick={() => onEventClick(ev.id)}
                    compact
                  />
                ))
              ) : (
                <li className="rounded-lg bg-[#fafbfc] px-3 py-4 text-center text-xs text-neutral-500">
                  Sem aulas neste filtro
                </li>
              )}
            </ul>
          </article>
        );
      })}
    </section>
  );
}
