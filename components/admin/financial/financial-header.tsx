"use client";

import type { ReactNode } from "react";
import { HiBanknotes, HiPlus } from "react-icons/hi2";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";
import { TableFiltersButton } from "@/components/ui/table-filters-button";
import { AdminPageHeader } from "../admin-page-header";

type Props = {
  title: string;
  subtitle: string;
  /** Substitui todo o bloco de ações (botões + filtros). */
  actions?: ReactNode;
  /** Filtro de período renderizado abaixo dos botões padrão. */
  periodFilter?: ReactNode;
  newChargeLabel?: string;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
  onNewCharge?: () => void;
  onNewExpense?: () => void;
  onRegisterPayment?: () => void;
};

export function FinancialHeader({
  title,
  subtitle,
  actions,
  periodFilter,
  newChargeLabel = "Nova receita",
  onOpenFilters,
  activeFilterCount = 0,
  onNewCharge,
  onNewExpense,
  onRegisterPayment,
}: Props) {
  const { tabletLandscape } = useAdminPanelTabletLayout();

  const chargeLabel = tabletLandscape ? "Receita" : newChargeLabel;
  const expenseLabel = tabletLandscape ? "Despesa" : "Nova despesa";
  const paymentLabel = tabletLandscape ? "Pagamento" : "Registrar pagamento";

  const defaultActions = (
    <>
      <button type="button" onClick={onNewCharge} className="btn-outline-sm bg-white">
        <HiPlus className="h-4 w-4" aria-hidden />
        {chargeLabel}
      </button>
      <button type="button" onClick={onNewExpense} className="btn-outline-sm bg-white">
        <HiPlus className="h-4 w-4" aria-hidden />
        {expenseLabel}
      </button>
      <button type="button" onClick={onRegisterPayment} className="btn-primary-sm">
        <HiBanknotes className="h-4 w-4" aria-hidden />
        {paymentLabel}
      </button>
      {onOpenFilters ? (
        <TableFiltersButton
          onClick={onOpenFilters}
          activeFilterCount={activeFilterCount}
          iconOnlyPortrait
        />
      ) : null}
    </>
  );

  const resolvedActions =
    actions ??
    (periodFilter ? (
      <div className="flex w-full flex-col items-stretch gap-3 lg:items-end">
        <div className="flex flex-wrap justify-end gap-2">{defaultActions}</div>
        {periodFilter}
      </div>
    ) : (
      defaultActions
    ));

  return (
    <AdminPageHeader
      title={title}
      subtitle={subtitle}
      actions={resolvedActions}
      actionsClassName="admin-page-header-actions--tablet-compact"
    />
  );
}
