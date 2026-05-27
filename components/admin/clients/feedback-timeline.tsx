"use client";

import {
  HiAcademicCap,
  HiBanknotes,
  HiBolt,
  HiChatBubbleLeftEllipsis,
  HiFlag,
  HiTrophy,
} from "react-icons/hi2";
import type { ClientTimelineEvent } from "@/lib/contracts/clients";

type Props = {
  events: ClientTimelineEvent[];
};

function eventIcon(type: ClientTimelineEvent["type"]) {
  switch (type) {
    case "aula":
      return HiAcademicCap;
    case "treino":
      return HiBolt;
    case "feedback":
      return HiChatBubbleLeftEllipsis;
    case "campeonato":
      return HiFlag;
    case "pagamento":
      return HiBanknotes;
    case "conquista":
      return HiTrophy;
    default:
      return HiBolt;
  }
}

function eventColor(type: ClientTimelineEvent["type"]) {
  switch (type) {
    case "conquista":
      return "bg-amber-100 text-amber-800 ring-amber-200/60";
    case "pagamento":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200/60";
    case "campeonato":
      return "bg-[#0d1f3c]/8 text-[#0d1f3c] ring-[#0d1f3c]/15";
    default:
      return "bg-white text-accent ring-[rgba(17,17,17,0.1)]";
  }
}

export function FeedbackTimeline({ events }: Props) {
  return (
    <section>
      <h3 className="text-lg font-bold text-[#0d1f3c]">Timeline</h3>
      <p className="mt-1 text-sm text-neutral-600">
        Histórico de aulas, treinos, feedbacks e conquistas.
      </p>

      <ol className="relative mt-6 space-y-0 border-l-2 border-[rgba(13,31,60,0.12)] pl-6">
        {events.map((event, i) => {
          const Icon = eventIcon(event.type);
          return (
            <li key={event.id} className="relative pb-8 last:pb-0">
              <span
                className={`absolute -left-[31px] flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white ${eventColor(event.type)}`}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <time className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                {event.date}
              </time>
              <p className="mt-1 font-semibold text-[#0d1f3c]">{event.title}</p>
              <p className="mt-0.5 text-sm text-neutral-600">
                {event.description}
              </p>
              {i === 0 ? (
                <span className="mt-2 inline-flex rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase text-accent">
                  Mais recente
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
