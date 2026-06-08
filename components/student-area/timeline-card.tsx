import Link from "next/link";
import { HiCalendarDays } from "react-icons/hi2";
import type { TimelineItem } from "@/lib/contracts/student-area";

type Props = { items: readonly TimelineItem[]; className?: string };

export function TimelineCard({ items, className = "" }: Props) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6 ${className}`}
    >
      <div className="flex shrink-0 items-start justify-between gap-3">
        <h3 className="text-lg font-bold text-[#0d1f3c]">
          Próximas atividades
        </h3>
        <Link
          href="/piloto/reservar"
          className="shrink-0 text-[13px] font-semibold text-accent transition hover:underline"
        >
          Reservar
        </Link>
      </div>
      <ul className="relative mt-6 min-h-0 flex-1 space-y-0 overflow-y-auto pl-0">
        {items.length === 0 ? (
          <li className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-8 text-center">
            <p className="text-sm font-semibold text-[#0d1f3c]">
              Nenhuma aula agendada
            </p>
            <p className="mt-2 text-[13px] text-neutral-600">
              Quando houver treinos confirmados, eles aparecerão aqui.
            </p>
          </li>
        ) : (
          <>
        <span
          aria-hidden
          className="absolute bottom-5 left-[15px] top-5 w-[2px] rounded-full bg-[rgba(13,31,60,0.08)] md:left-[17px]"
        />
        {items.map((item) => (
          <li
            key={item.id}
            className="relative flex gap-4 pb-8 last:pb-0 md:gap-6"
          >
            <span className="relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.08)] bg-white text-accent shadow-sm md:h-11 md:w-11 md:rounded-2xl md:text-accent">
              <HiCalendarDays className="h-6 w-6" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 border-b border-dashed border-[rgba(17,17,17,0.08)] pb-8 last:border-0 last:pb-0">
              <p className="text-[15px] font-semibold text-[#111]">{item.title}</p>
              <p className="mt-1 text-sm font-medium text-[#c41e3a]">{item.meta}</p>
              <p className="mt-2 text-[13px] text-neutral-600">{item.location}</p>
            </div>
          </li>
        ))}
          </>
        )}
      </ul>
    </div>
  );
}
