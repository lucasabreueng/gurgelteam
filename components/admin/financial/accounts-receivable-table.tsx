"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReceivableStatus } from "@/lib/contracts/finance/finance.types";
import { useFinancialReceivables } from "@/lib/query/hooks/use-financial-receivables";
import type { IconType } from "react-icons/lib";
import {
  HiBanknotes,
  HiBellAlert,
  HiDocumentText,
  HiUser,
} from "react-icons/hi2";
import { ResponsiveTableFilters } from "@/components/ui/responsive-table-filters";
import { TableFiltersToolbar } from "@/components/ui/table-filters-toolbar";
import {
  ReceivableFilters,
  countReceivableFilters,
  type ReceivableFilterState,
} from "./receivable-filters";
import { useInventoryTableState } from "../inventory/use-inventory-table-state";
import {
  InventoryTableShell,
  TableIconButton,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryTdFirstClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "../inventory/inventory-table-shared";
import { FinancialTablePagination } from "./financial-table-pagination";
import { ReceivableStatusBadge } from "./receivable-status-badge";

type Props = {
  onAction?: (msg: string) => void;
  filtersOpen?: boolean;
  onFiltersOpenChange?: (open: boolean) => void;
  onActiveFilterCountChange?: (count: number) => void;
  hideMobileFilterToolbar?: boolean;
};

const DEFAULT_FILTERS: ReceivableFilterState = {
  query: "",
  status: "",
  method: "",
  service: "",
};

export function AccountsReceivableTable({
  onAction,
  filtersOpen: filtersOpenProp,
  onFiltersOpenChange,
  onActiveFilterCountChange,
  hideMobileFilterToolbar = false,
}: Props) {
  const [filterState, setFilterState] = useState<ReceivableFilterState>(DEFAULT_FILTERS);
  const [filtersOpenInternal, setFiltersOpenInternal] = useState(false);
  const filtersOpen = filtersOpenProp ?? filtersOpenInternal;
  const setFiltersOpen = onFiltersOpenChange ?? setFiltersOpenInternal;

  useEffect(() => {
    onActiveFilterCountChange?.(countReceivableFilters(filterState));
  }, [filterState, onActiveFilterCountChange]);

  const apiFilters = useMemo(
    () => ({
      query: filterState.query,
      status: filterState.status,
      method: filterState.method,
      service: filterState.service,
    }),
    [filterState],
  );
  const { data: rows = [] } = useFinancialReceivables(apiFilters);

  const {
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    paginatedItems,
    totalItems,
  } = useInventoryTableState(rows, [
    filterState.query,
    filterState.status,
    filterState.method,
    filterState.service,
  ]);

  const clearFilters = () => setFilterState(DEFAULT_FILTERS);

  return (
    <div className="admin-page-stack">
      {hideMobileFilterToolbar ? null : (
        <TableFiltersToolbar
          onOpen={() => setFiltersOpen(true)}
          activeFilterCount={countReceivableFilters(filterState)}
        />
      )}
      <ResponsiveTableFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        onClear={clearFilters}
        resultCount={rows.length}
        resultUnit="título"
        renderFilters={(layout) => (
          <ReceivableFilters
            layout={layout}
            filters={filterState}
            onChange={(patch) => setFilterState((p) => ({ ...p, ...patch }))}
            onClear={clearFilters}
          />
        )}
      />

      <div className="hidden lg:block">
        <InventoryTableShell
          isEmpty={totalItems === 0}
          emptyMessage="Nenhum título encontrado com os filtros atuais."
          pagination={
            <FinancialTablePagination
              page={page}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          }
        >
          <thead>
            <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc]">
              <th className={inventoryThFirstClass}>Cliente</th>
              <th className={inventoryThClass}>Valor</th>
              <th className={inventoryThClass}>Vencimento</th>
              <th className={inventoryThClass}>Status</th>
              <th className={inventoryThClass}>Pagamento</th>
              <th className={inventoryThClass}>Serviço</th>
              <th className={`${inventoryThClass} text-right`}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[rgba(17,17,17,0.04)] transition hover:bg-[#fafbfc]/80"
              >
                <td className={`${inventoryTdFirstClass} font-semibold text-[#0d1f3c]`}>
                  {row.clientName}
                </td>
                <td className={`${inventoryTdClass} font-bold tabular-nums`}>
                  {row.amount}
                </td>
                <td className={inventoryTdClass}>{row.dueDate}</td>
                <td className={inventoryTdClass}>
                  <ReceivableStatusBadge status={row.status} />
                </td>
                <td className={inventoryTdClass}>{row.paymentMethod}</td>
                <td className={inventoryTdDescClass}>{row.service}</td>
                <td className={inventoryTdClass}>
                  <ReceivableRowActions
                    clientName={row.clientName}
                    status={row.status}
                    onAction={onAction}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </InventoryTableShell>
      </div>

      <div className="lg:hidden">
        {totalItems === 0 ? (
          <p className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-10 text-center text-sm text-neutral-500">
            Nenhum título encontrado com os filtros atuais.
          </p>
        ) : (
          <ul className="space-y-2">
            {paginatedItems.map((row) => (
              <li key={row.id}>
                <article className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-3 shadow-[0_1px_8px_rgba(13,31,60,0.04)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-[#0d1f3c]">
                        {row.clientName}
                      </p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-neutral-600">
                        <span className="font-bold tabular-nums text-[#111]">
                          {row.amount}
                        </span>
                        <span className="text-neutral-300">·</span>
                        <span className="text-neutral-700">{row.dueDate}</span>
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <ReceivableStatusBadge status={row.status} />
                        <span className="text-[11px] text-neutral-600">
                          {row.paymentMethod}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[11px] text-neutral-600">
                        {row.service}
                      </p>
                    </div>
                    <ReceivableRowActions
                      clientName={row.clientName}
                      status={row.status}
                      onAction={onAction}
                    />
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {totalItems === 0 ? null : (
          <div className="mt-3">
            <FinancialTablePagination
              page={page}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ReceivableRowActions({
  clientName,
  status,
  onAction,
}: {
  clientName: string;
  status: ReceivableStatus;
  onAction?: (msg: string) => void;
}) {
  const actions: { label: string; icon: IconType; show: boolean; msg: string }[] =
    [
      {
        label: "Cobrar",
        icon: HiBellAlert,
        show: status !== "pago",
        msg: `Cobrança enviada — ${clientName} (mock).`,
      },
      {
        label: "Registrar pagamento",
        icon: HiBanknotes,
        show: true,
        msg: `Pagamento registrado — ${clientName} (mock).`,
      },
      {
        label: "Gerar recibo",
        icon: HiDocumentText,
        show: true,
        msg: `Recibo — ${clientName} (mock).`,
      },
      {
        label: "Abrir cliente",
        icon: HiUser,
        show: true,
        msg: `Cliente ${clientName} (mock).`,
      },
    ];

  return (
    <div className="flex items-center justify-end gap-1">
      {actions
        .filter((a) => a.show)
        .map((a) => (
          <TableIconButton
            key={a.label}
            icon={a.icon}
            label={a.label}
            onClick={() => onAction?.(a.msg)}
          />
        ))}
    </div>
  );
}
