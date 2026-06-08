"use client";

import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import type { LessonSessionDTO } from "@/lib/contracts/lessons/lesson.types";
import { getAppServices } from "@/lib/data-source/app-services";
import { ScheduleDrawerShell } from "../schedule/schedule-drawer-shell";
import { LessonSessionWorkspace } from "./lesson-session-workspace";

type Props = {
  open: boolean;
  session: LessonSessionDTO | null;
  onClose: () => void;
  onFinalized: (message: string) => void;
};

export function LessonRegistrationDrawer({
  open,
  session,
  onClose,
  onFinalized,
}: Props) {
  const [headerActions, setHeaderActions] = useState<ReactNode>(null);

  const handleWorkspaceFinalized = useCallback(
    (message: string) => {
      onFinalized(message);
      onClose();
    },
    [onFinalized, onClose],
  );

  if (!open || !session) return null;

  const dateLabel = getAppServices().schedule.formatDateShort(session.date);

  return (
    <div className="lg:hidden">
      <ScheduleDrawerShell
        open={open}
        onClose={onClose}
        title={session.studentName}
        titleId="lesson-registration-drawer-title"
        description={
          <span>
            {dateLabel} · {session.start}–{session.end} · {session.category}
          </span>
        }
        headerActions={headerActions}
        zIndexClass="z-[220]"
      >
        <div className="p-4 md:p-5">
          <LessonSessionWorkspace
            key={`${session.id}-${session.status}`}
            session={session}
            hideTitleHeader
            onHeaderActionsChange={setHeaderActions}
            onFinalized={handleWorkspaceFinalized}
          />
        </div>
      </ScheduleDrawerShell>
    </div>
  );
}
