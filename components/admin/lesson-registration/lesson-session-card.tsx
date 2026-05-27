"use client";

import Image from "next/image";
import { ScheduleServiceMock } from "@/services/schedule/scheduleServiceMock";
import { RegistrationListStatusBadge } from "./registration-list-status-badge";
import { lessonRegistrationSelectionClass } from "./lesson-registration-selection";
import type { LessonSessionDTO } from "@/lib/contracts/lessons/lesson.types";

type Props = {
  session: LessonSessionDTO;
  selected?: boolean;
  onClick: () => void;
};

export function LessonSessionCard({ session, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full gap-3 rounded-2xl p-3.5 text-left transition ${lessonRegistrationSelectionClass(selected ?? false)}`}
    >
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl ring-2 ring-white shadow-sm">
        <Image
          src={session.avatar}
          alt=""
          fill
          className="object-cover"
          sizes="44px"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="truncate font-bold text-[#0d1f3c]">
            {session.studentName}
          </span>
          <span className="shrink-0 text-[11px] font-semibold uppercase text-neutral-500">
            {session.category}
          </span>
        </span>
        <span className="mt-1 block text-xs text-neutral-600">
          {ScheduleServiceMock.formatDateShort(session.date)} · {session.start}–{session.end}
        </span>
        <span className="mt-2 inline-block">
          <RegistrationListStatusBadge status={session.status} />
        </span>
      </span>
    </button>
  );
}
