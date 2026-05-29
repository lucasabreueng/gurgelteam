"use client";

import { MaintenanceServiceMock } from "@/services/maintenance/maintenanceServiceMock";
import { ScheduleDrawerShell } from "@/components/admin/schedule/schedule-drawer-shell";
import { KartTechnicalTimeline } from "@/components/admin/karts/kart-technical-timeline";

type Props = {
  kartId: string | null;
  onClose: () => void;
};

export function KartHistoryDrawer({ kartId, onClose }: Props) {
  const kart = kartId ? MaintenanceServiceMock.getKartById(kartId) : undefined;
  const timeline = kartId
    ? MaintenanceServiceMock.getKartTechnicalTimeline(kartId)
    : [];

  return (
    <ScheduleDrawerShell
      open={Boolean(kartId && kart)}
      onClose={onClose}
      title={
        kart
          ? `Histórico — Kart ${String(kart.number).padStart(2, "0")}`
          : "Histórico"
      }
      titleId="kart-history-title"
      description="Inspeções, manutenções e checklists deste kart."
      zIndexClass="z-[227]"
    >
      <div className="p-4 md:p-5">
        <KartTechnicalTimeline entries={timeline} />
      </div>
    </ScheduleDrawerShell>
  );
}
