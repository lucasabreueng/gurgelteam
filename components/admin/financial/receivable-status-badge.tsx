import {
  RECEIVABLE_STATUS_LABELS,
  type ReceivableStatus,
} from "@/lib/contracts/finance/finance.types";
import {
  adminBadgeErrorClass,
  adminBadgeInfoClass,
  adminBadgeSuccessClass,
  adminBadgeWarningClass,
} from "@/lib/design";
import { StatusBadge } from "@/components/ui/status-badge";

const STYLES: Record<ReceivableStatus, string> = {
  pago: adminBadgeSuccessClass,
  pendente: adminBadgeWarningClass,
  vencido: adminBadgeErrorClass,
  parcial: adminBadgeInfoClass,
};

export function ReceivableStatusBadge({ status }: { status: ReceivableStatus }) {
  return (
    <StatusBadge className={STYLES[status]}>
      {RECEIVABLE_STATUS_LABELS[status]}
    </StatusBadge>
  );
}
