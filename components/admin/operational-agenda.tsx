"use client";

import { useOperationalAgenda } from "@/lib/query/hooks/use-dashboard";
import { adminTableBodyRowClass } from "@/lib/design";

type Props = {
  className?: string;
};

export function OperationalAgenda({ className = "" }: Props) {
  const { data: agenda = [], isPending } = useOperationalAgenda();

  if (isPending) {
    return (
      <div
        className={`flex h-full flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-7 ${className}`}
        aria-busy="true"
        aria-label="Carregando agenda operacional"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded-lg bg-neutral-200/80" />
          <div className="h-4 w-32 rounded-lg bg-neutral-200/80" />
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-10 w-full rounded-lg bg-neutral-200/80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-7 ${className}`}
    >
      <div>
        <h3 className="text-xl font-bold text-[#0d1f3c]">Agenda operacional</h3>
        <p className="mt-1 text-sm text-neutral-600">Hoje · horários agendados</p>
      </div>

      <div className="mt-6 min-h-0 flex-1">
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(17,17,17,0.08)] text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="pb-3 pr-3 font-bold">Horário</th>
                <th className="pb-3 pr-3 font-bold">Piloto</th>
                <th className="hidden pb-3 pr-3 font-bold sm:table-cell">Categoria</th>
                <th className="pb-3 font-bold">Nível</th>
              </tr>
            </thead>
            <tbody>
              {agenda.map((slot) => (
                <tr
                  key={slot.id}
                  className={adminTableBodyRowClass}
                >
                  <td className="py-3.5 pr-3 text-[13px] font-semibold tabular-nums text-[#0d1f3c]">
                    {slot.startTime} – {slot.endTime}
                  </td>
                  <td className="py-3.5 pr-3 font-semibold text-[#111]">
                    {slot.pilotName}
                  </td>
                  <td className="hidden py-3.5 pr-3 text-neutral-700 sm:table-cell">
                    {slot.category}
                  </td>
                  <td className="py-3.5 text-neutral-700">{slot.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden">
          {agenda.length === 0 ? (
            <p className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-4 py-10 text-center text-sm text-neutral-500">
              Nenhum horário encontrado para hoje.
            </p>
          ) : (
            <ul className="space-y-2">
              {agenda.map((slot) => (
                <li key={slot.id}>
                  <div className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-[#0d1f3c]">
                          {slot.startTime} – {slot.endTime}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] font-semibold text-[#111]">
                          {slot.pilotName}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-600">
                          <span className="font-semibold text-[#111]">
                            {slot.level}
                          </span>
                          {slot.category ? (
                            <>
                              <span className="mx-1.5 text-neutral-300">·</span>
                              <span>{slot.category}</span>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
