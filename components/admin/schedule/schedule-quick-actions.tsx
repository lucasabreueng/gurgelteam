"use client";

import { useScheduleMeta } from "@/lib/query/hooks/use-schedule";

type Props = {
  onAction: (action: string) => void;
};

export function ScheduleQuickActions({ onAction }: Props) {
  const { data: meta } = useScheduleMeta();
  const quickActions = meta?.quickActions ?? [];
  return (
    <section>
      <h2 className="text-sm font-bold text-[#0d1f3c]">Ações rápidas</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {quickActions.map((qa) => (
          <li key={qa.id}>
            <button
              type="button"
              onClick={() => onAction(qa.action)}
              className="flex h-full w-full items-center justify-center rounded-xl border-2 border-[rgba(17,17,17,0.08)] bg-white px-3 py-4 text-center text-[10px] font-bold uppercase tracking-wide text-[#0d1f3c] transition hover:border-accent/30 hover:shadow-md"
            >
              {qa.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
