import {
  RECEIVABLE_STATUS_LABELS,
  type ReceivableStatus,
} from "@/lib/contracts/finance/finance.types";

const STYLES: Record<ReceivableStatus, string> = {
  pago: "bg-emerald-50 text-emerald-800 ring-emerald-200/70",
  pendente: "bg-amber-50 text-amber-900 ring-amber-200/70",
  vencido: "bg-red-50 text-red-800 ring-red-200/70",
  parcial: "bg-sky-50 text-sky-900 ring-sky-200/70",
};

export function ReceivableStatusBadge({ status }: { status: ReceivableStatus }) {
  return (
    <span
      className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${STYLES[status]}`}
    >
      {RECEIVABLE_STATUS_LABELS[status]}
    </span>
  );
}
