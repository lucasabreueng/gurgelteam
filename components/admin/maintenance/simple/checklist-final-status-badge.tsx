import type { ChecklistFinalStatus } from "@/lib/contracts/maintenance/complete-checklist";
import { CHECKLIST_FINAL_STATUS_LABELS } from "@/lib/contracts/maintenance/complete-checklist";

const TONE: Record<ChecklistFinalStatus, string> = {
  aprovado: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  aprovado_ressalvas: "bg-amber-50 text-amber-900 ring-amber-200/60",
  reprovado: "bg-red-50 text-red-800 ring-red-200/60",
};

type Props = { status: ChecklistFinalStatus };

export function ChecklistFinalStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${TONE[status]}`}
    >
      {CHECKLIST_FINAL_STATUS_LABELS[status]}
    </span>
  );
}
