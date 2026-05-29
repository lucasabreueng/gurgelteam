import type { IconType } from "react-icons/lib";
import {
  HiCheckCircle,
  HiClock,
  HiExclamationTriangle,
  HiReceiptPercent,
} from "react-icons/hi2";
import { useFinancialReceivablesKpis } from "@/lib/query/hooks/use-financial-receivables";
import { AdminResponsiveKpis } from "@/components/admin/admin-responsive-kpis";
import { AccountsReceivableTable } from "../accounts-receivable-table";

const KPI_ICONS: Record<string, IconType> = {
  received: HiCheckCircle,
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

export function ReceivablesTab({
  onAction,
  filtersOpen,
  onFiltersOpenChange,
  onActiveFilterCountChange,
}: Props) {
  const { data: kpis = [] } = useFinancialReceivablesKpis();

  return (
    <div className="admin-page-stack">
      <AdminResponsiveKpis
        kpis={kpis}
        icons={KPI_ICONS}
        defaultIcon={HiClock}
        desktopClassName="admin-page-grid grid grid-cols-2 lg:grid-cols-4"
      />

      <AccountsReceivableTable
        onAction={onAction}
        filtersOpen={filtersOpen}
        onFiltersOpenChange={onFiltersOpenChange}
        onActiveFilterCountChange={onActiveFilterCountChange}
        hideMobileFilterToolbar
      />
    </div>
  );
}
