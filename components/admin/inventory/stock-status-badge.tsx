import type { StockLevel } from "@/lib/contracts/parts";
import {
  adminBadgeErrorClass,
  adminBadgeSuccessClass,
  adminBadgeWarningClass,
} from "@/lib/design";
import { StatusBadge } from "@/components/ui/status-badge";

const CONFIG: Record<
  StockLevel,
  { label: string; dot: string; className: string }
> = {
  ok: {
    label: "Estoque normal",
    dot: "bg-[var(--ds-success-text)]",
    className: adminBadgeSuccessClass,
  },
  low: {
    label: "Estoque baixo",
    dot: "bg-[var(--ds-warning-text)]",
    className: adminBadgeWarningClass,
  },
  critical: {
    label: "Estoque crítico",
    dot: "bg-[var(--ds-error-text)]",
    className: adminBadgeErrorClass,
  },
};

export function StockStatusBadge({ level }: { level: StockLevel }) {
  const c = CONFIG[level];
  return (
    <StatusBadge className={c.className} dotClassName={c.dot}>
      {c.label}
    </StatusBadge>
  );
}
