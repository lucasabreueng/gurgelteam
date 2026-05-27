import type { PaymentStatus } from "@/lib/contracts/schedule";

const STYLES: Partial<Record<PaymentStatus, string>> = {
  pago: "bg-emerald-100 text-emerald-800 ring-emerald-200/80",
  pendente: "bg-amber-100 text-amber-900 ring-amber-200/80",
};

const LABELS: Partial<Record<PaymentStatus, string>> = {
  pago: "Pago",
  pendente: "Pendente",
};

export function FinancialStatusBadge({ status }: { status: PaymentStatus }) {
  const style = STYLES[status];
  const label = LABELS[status];
  if (!style || !label) return null;

  return (
    <span
      className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${style}`}
    >
      {label}
    </span>
  );
}
