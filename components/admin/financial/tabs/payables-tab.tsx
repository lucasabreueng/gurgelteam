import type { IconType } from "react-icons/lib";
import {
  HiCheckCircle,
  HiClock,
  HiExclamationTriangle,
  HiReceiptPercent,
} from "react-icons/hi2";
import { useFinancialPayablesKpis } from "@/lib/query/hooks/use-financial-payables";
import { KpiCard } from "@/components/ui/kpi-card";
import { AccountsPayableTable } from "../accounts-payable-table";

const KPI_ICONS: Record<string, IconType> = {
  paid: HiCheckCircle,
  pending: HiClock,
  overdue: HiExclamationTriangle,
  partial: HiReceiptPercent,
};

type Props = {
  onAction: (msg: string) => void;
};

export function PayablesTab({ onAction }: Props) {
  const { data: kpis = [] } = useFinancialPayablesKpis();

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

      <AccountsPayableTable onAction={onAction} />
    </div>
  );
}
