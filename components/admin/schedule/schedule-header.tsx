"use client";

import { HiLockClosed, HiPlus } from "react-icons/hi2";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";
import { AdminPageHeader } from "../admin-page-header";

type Props = {
  onNewClass?: () => void;
  onBlockSlot?: () => void;
};

export function ScheduleHeader({ onNewClass, onBlockSlot }: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();

  return (
    <AdminPageHeader
      title="Agenda"
      subtitle="Gerencie aulas, treinos, reservas, disponibilidade e operação diária."
      actions={
        onNewClass || onBlockSlot ? (
          <>
            {onNewClass ? (
              <button type="button" onClick={() => onNewClass()} className="btn-outline-sm">
                <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
                {tabletLandscape ? "Aula" : "Nova aula"}
              </button>
            ) : null}
            {onBlockSlot ? (
              <button type="button" onClick={onBlockSlot} className="btn-outline-sm">
                <HiLockClosed className="h-4 w-4 shrink-0" aria-hidden />
                {tabletLandscape ? "Bloquear" : "Bloquear horário"}
              </button>
            ) : null}
          </>
        ) : undefined
      }
      actionsClassName="admin-page-header-actions--tablet-compact"
    />
  );
}
