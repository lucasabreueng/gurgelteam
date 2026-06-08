import type { KartStatus } from "@/lib/contracts/karts";
import {
  adminBadgeInfoClass,
  adminBadgeNeutralStatusClass,
  adminBadgeSuccessClass,
  adminBadgeWarningClass,
} from "@/lib/design";
import { KartsServiceMock } from "@/services/karts/kartsServiceMock";
import { StatusBadge } from "@/components/ui/status-badge";

export function statusStyle(status: KartStatus) {
  switch (status) {
    case "disponivel":
      return adminBadgeSuccessClass;
    case "em_treino":
    case "lavagem":
    case "preparacao":
      return adminBadgeInfoClass;
    case "reservado":
      return "bg-[var(--ds-info-bg)] text-[var(--ds-info-text)] ring-[var(--ds-info-border)]";
    case "manutencao":
    case "aguardando_peca":
      return adminBadgeWarningClass;
    default:
      return adminBadgeNeutralStatusClass;
  }
}

export function KartStatusBadge({ status }: { status: KartStatus }) {
  return (
    <StatusBadge className={statusStyle(status)}>
      {KartsServiceMock.getStatusLabels()[status]}
    </StatusBadge>
  );
}
