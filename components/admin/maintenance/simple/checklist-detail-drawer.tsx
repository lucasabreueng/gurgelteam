"use client";

import type { ChecklistHistoryRow } from "@/lib/contracts/maintenance/complete-checklist";
import { COMPLETE_CHECKLIST_TYPE_LABELS } from "@/lib/contracts/maintenance/complete-checklist";
import { ScheduleDrawerShell } from "@/components/admin/schedule/schedule-drawer-shell";
import { DrawerFooterActions } from "@/components/ui/drawer-footer";
import { ChecklistFinalStatusBadge } from "./checklist-final-status-badge";

type Props = {
  row: ChecklistHistoryRow | null;
  onClose: () => void;
  onDuplicate: (id: string) => void;
  onExportPdf: (id: string) => void;
};

export function ChecklistDetailDrawer({
  row,
  onClose,
  onDuplicate,
  onExportPdf,
}: Props) {
  return (
    <ScheduleDrawerShell
      open={Boolean(row)}
      onClose={onClose}
      title={
        row
          ? `Checklist — Kart ${String(row.kartNumber).padStart(2, "0")}`
          : "Checklist"
      }
      titleId="checklist-detail-title"
      description={row ? COMPLETE_CHECKLIST_TYPE_LABELS[row.type] : undefined}
      zIndexClass="z-[227]"
      footer={
        row ? (
          <DrawerFooterActions columns={2}>
            <button
              type="button"
              onClick={() => onDuplicate(row.id)}
              className="btn-outline-sm bg-white"
            >
              Duplicar
            </button>
            <button
              type="button"
              onClick={() => onExportPdf(row.id)}
              className="btn-primary-md"
            >
              Exportar PDF
            </button>
          </DrawerFooterActions>
        ) : undefined
      }
    >
      {row ? (
        <div className="space-y-4 p-4 md:p-5">
          <dl className="grid gap-3 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-bold uppercase text-neutral-500">
                Data
              </dt>
              <dd className="font-semibold text-[#0d1f3c]">{row.date}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-neutral-500">
                Responsável
              </dt>
              <dd className="font-semibold text-[#0d1f3c]">
                {row.responsibleName}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-neutral-500">
                Resultado
              </dt>
              <dd className="mt-1">
                <ChecklistFinalStatusBadge status={row.finalStatus} />
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase text-neutral-500">
                Itens reprovados
              </dt>
              <dd className="font-semibold text-[#0d1f3c]">{row.failedCount}</dd>
            </div>
          </dl>
          <p className="text-sm text-neutral-600">
            Detalhamento item a item disponível ao duplicar este checklist para
            uma nova avaliação.
          </p>
        </div>
      ) : null}
    </ScheduleDrawerShell>
  );
}
