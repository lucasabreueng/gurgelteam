"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppServices } from "@/lib/data-source/app-services";
import { useKartTechnicalTimeline } from "@/lib/query/hooks/use-kart-technical-timeline";
import { ScheduleDrawerShell } from "@/components/admin/schedule/schedule-drawer-shell";
import { KartTechnicalTimeline } from "@/components/admin/karts/kart-technical-timeline";

type Props = {
  kartId: string | null;
  onClose: () => void;
};

export function KartHistoryDrawer({ kartId, onClose }: Props) {
  const { data: kart } = useQuery({
    queryKey: ["maintenance", "kart", kartId ?? ""],
    queryFn: () => getAppServices().maintenance.getKartById(kartId!),
    enabled: Boolean(kartId),
  });
  const { data: timeline = [], isPending } = useKartTechnicalTimeline(kartId);

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
        {isPending ? (
          <p className="text-sm text-neutral-500">Carregando histórico…</p>
        ) : (
          <KartTechnicalTimeline entries={timeline} />
        )}
      </div>
    </ScheduleDrawerShell>
  );
}
