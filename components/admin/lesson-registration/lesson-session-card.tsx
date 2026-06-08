"use client";

import { ScheduleServiceMock } from "@/services/schedule/scheduleServiceMock";
import { UserAvatar } from "@/components/ui/user-avatar";
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
      <UserAvatar
        src={session.avatar}
        name={session.studentName}
        size={44}
        roundedClass="rounded-xl"
      />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="truncate font-bold text-[var(--ds-text-primary)]">
            {session.studentName}
          </span>
          <span className="shrink-0 text-[11px] font-semibold uppercase text-[var(--ds-text-muted)]">
            {session.category}
          </span>
        </span>
        <span className="mt-1 block text-xs text-[var(--ds-text-secondary)]">
          {ScheduleServiceMock.formatDateShort(session.date)} · {session.start}–{session.end}
        </span>
        <span className="mt-2 inline-block">
          <RegistrationListStatusBadge status={session.status} />
        </span>
      </span>
    </button>
  );
}
