"use client";

import type { LessonSessionDTO } from "@/lib/contracts/lessons/lesson.types";
import { LessonSessionCard } from "./lesson-session-card";

type Props = {
  sessions: LessonSessionDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
};

export function LessonSessionList({
  sessions,
  selectedId,
  onSelect,
  loading,
}: Props) {
  if (loading) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="h-24 animate-pulse rounded-2xl bg-white/80 ring-1 ring-[rgba(17,17,17,0.06)]"
          />
        ))}
      </ul>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white px-4 py-12 text-center text-sm text-neutral-500">
        Nenhuma aula encontrada com os filtros atuais.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {sessions.map((session) => (
        <li key={session.id}>
          <LessonSessionCard
            session={session}
            selected={selectedId === session.id}
            onClick={() => onSelect(session.id)}
          />
        </li>
      ))}
    </ul>
  );
}
