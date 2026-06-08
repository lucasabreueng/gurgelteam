"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { queryKeys } from "@/lib/query/keys";
import { useInspectionTemplate } from "@/lib/query/hooks/use-inspection-template";

type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  detail: string;
};

type Props = {
  kartId?: string;
};

export function TechnicalTimeline({ kartId }: Props) {
  const { data: template } = useInspectionTemplate();

  const { data: apiRows = [] } = useQuery({
    queryKey: [...queryKeys.maintenance.all, "kart-inspections", kartId] as const,
    queryFn: () => getAppServices().inspection.listInspections(kartId),
    enabled: Boolean(kartId),
  });

  const events = useMemo(() => {
    const apiEvents: TimelineEvent[] = apiRows.map((row) => ({
      id: row.id,
      date: new Date(row.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
      title: `Inspeção · ${row.checklistType}`,
      detail: row.overallStatus ?? "Registrada",
    }));

    const seedEvents = (template?.technicalTimeline ?? []) as TimelineEvent[];

    if (apiEvents.length > 0) {
      return apiEvents.slice(0, 8);
    }

    return seedEvents.slice(0, 8);
  }, [apiRows, template?.technicalTimeline]);

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Timeline técnica</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Inspeções, falhas e manutenções recentes
      </p>
      {events.length === 0 ? (
        <p className="mt-5 text-sm text-neutral-500">
          Nenhum evento técnico registrado para este kart.
        </p>
      ) : (
        <ol className="relative mt-5 space-y-0 pl-1">
          {events.map((ev, i) => (
            <li key={ev.id} className="relative flex gap-4 pb-6 last:pb-0">
              {i < events.length - 1 ? (
                <span
                  className="absolute left-[7px] top-4 h-[calc(100%-8px)] w-0.5 bg-neutral-200"
                  aria-hidden
                />
              ) : null}
              <span
                className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-white bg-[#0d1f3c] ring-2 ring-[#0d1f3c]/20"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase text-neutral-500">
                  {ev.date}
                </p>
                <p className="text-sm font-bold text-[#0d1f3c]">{ev.title}</p>
                <p className="mt-0.5 text-xs text-neutral-600">{ev.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
