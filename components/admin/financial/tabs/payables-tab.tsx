import type { IconType } from "react-icons/lib";
import {
  HiCheckCircle,
  HiClock,
  HiExclamationTriangle,
  HiReceiptPercent,
} from "react-icons/hi2";
import { useFinancialPayablesKpis } from "@/lib/query/hooks/use-financial-payables";
import { AdminResponsiveKpis } from "@/components/admin/admin-responsive-kpis";
import { AccountsPayableTable } from "../accounts-payable-table";

const KPI_ICONS: Record<string, IconType> = {
  paid: HiCheckCircle,
  pending: HiClock,
  overdue: HiExclamationTriangle,
  partial: HiReceiptPercent,
};

type Props = {
  onAction: (msg: string) => void;
  filtersOpen?: boolean;
  onFiltersOpenChange?: (open: boolean) => void;
  onActiveFilterCountChange?: (count: number) => void;
};

export function PayablesTab({
  onAction,
  filtersOpen,
  onFiltersOpenChange,
  onActiveFilterCountChange,
}: Props) {
  const { data: kpis = [] } = useFinancialPayablesKpis();

  return (
    <div className="admin-page-stack">
      <AdminResponsiveKpis
        kpis={kpis}
        icons={KPI_ICONS}
        defaultIcon={HiClock}
        desktopClassName="admin-page-grid grid grid-cols-2 lg:grid-cols-4"
        showDeltaBadge={false}
      />

      <AccountsPayableTable
        onAction={onAction}
        filtersOpen={filtersOpen}
        onFiltersOpenChange={onFiltersOpenChange}
        onActiveFilterCountChange={onActiveFilterCountChange}
        hideMobileFilterToolbar
      />
    </div>
  );
}
