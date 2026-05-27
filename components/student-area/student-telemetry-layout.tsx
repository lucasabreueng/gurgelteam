"use client";

import type { ReactNode } from "react";
import { StudentShell } from "./student-shell";
import { TelemetryWorkspace } from "./telemetry/telemetry-workspace";

const TELEMETRY_MAIN_CLASS =
  "!overflow-hidden !p-0 !pb-0 !pt-[calc(var(--admin-header-h,76px))] max-lg:!h-[calc(100dvh-var(--admin-header-h,76px))] lg:!h-[calc(100dvh-var(--admin-header-h,76px))]";

const TELEMETRY_STACK_CLASS =
  "!gap-0 !min-h-0 !p-0 h-full max-h-full overflow-hidden";

type Props = {
  children: ReactNode;
};

export function StudentTelemetryLayout({ children }: Props) {
  return (
    <StudentShell
      activeNav="telemetria"
      mobileTitle="Telemetria"
      mainClassName={TELEMETRY_MAIN_CLASS}
      stackClassName={TELEMETRY_STACK_CLASS}
    >
      <div className="h-full min-h-0 max-h-full overflow-hidden">
        <TelemetryWorkspace>{children}</TelemetryWorkspace>
      </div>
    </StudentShell>
  );
}
