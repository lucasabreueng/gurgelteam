"use client";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import type { PilotViewOption } from "@/lib/contracts/student/dashboard-view";
import { PilotViewSelector } from "./pilot-view-selector";

type Props = {
  displayName: string;
  subtitle: string;
  pilotViewOptions?: PilotViewOption[];
  activePilotViewId?: string;
  onPilotViewChange?: (id: string) => void;
};

export function StudentDashboardHeader({
  displayName,
  subtitle,
  pilotViewOptions,
  activePilotViewId,
  onPilotViewChange,
}: Props) {
  const showPilotSelector =
    pilotViewOptions &&
    pilotViewOptions.length > 0 &&
    activePilotViewId &&
    onPilotViewChange;

  return (
    <AdminPageHeader
      title={`Olá, ${displayName}`}
      subtitle={subtitle}
      actions={
        showPilotSelector ? (
          <PilotViewSelector
            options={pilotViewOptions}
            value={activePilotViewId}
            onChange={onPilotViewChange}
          />
        ) : undefined
      }
    />
  );
}
