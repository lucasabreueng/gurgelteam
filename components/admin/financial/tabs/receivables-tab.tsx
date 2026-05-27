import type { IconType } from "react-icons/lib";
import {
  HiCheckCircle,
  HiClock,
  HiExclamationTriangle,
  HiReceiptPercent,
} from "react-icons/hi2";
import { useFinancialReceivablesKpis } from "@/lib/query/hooks/use-financial-receivables";
import { KpiCard } from "@/components/ui/kpi-card";
import { AccountsReceivableTable } from "../accounts-receivable-table";

const KPI_ICONS: Record<string, IconType> = {
  received: HiCheckCircle,
  pending: HiClock,
  overdue: HiExclamationTriangle,
  partial: HiReceiptPercent,
};

type Props = {
  onAction: (msg: string) => void;
};

export function ReceivablesTab({ onAction }: Props) {
  const { data: kpis = [] } = useFinancialReceivablesKpis();

  return (
    <div className="admin-page-stack">
      <section className="admin-page-grid grid grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            deltaPositive={kpi.deltaPositive}
            Icon={KPI_ICONS[kpi.id] ?? HiClock}
          />
        ))}
      </section>

      <AccountsReceivableTable onAction={onAction} />
    </div>
  );
}
