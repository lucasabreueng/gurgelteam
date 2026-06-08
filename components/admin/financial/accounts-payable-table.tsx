"use client";

import { useEffect, useMemo, useState } from "react";
import { HiBanknotes, HiDocumentText } from "react-icons/hi2";
import { useFinancialPayables } from "@/lib/query/hooks/use-financial-payables";
import { ResponsiveTableFilters } from "@/components/ui/responsive-table-filters";
import { TableFiltersToolbar } from "@/components/ui/table-filters-toolbar";
import {
  PayableFilters,
  countPayableFilters,
  type PayableFilterState,
} from "./payable-filters";
import { useInventoryTableState } from "../inventory/use-inventory-table-state";
import {
  InventoryTableShell,
  TableIconButton,
  adminTableBodyRowClass,
  adminTableHeadRowClass,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryTdFirstClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "../inventory/inventory-table-shared";
import { FinancialTablePagination } from "./financial-table-pagination";
import { ReceivableStatusBadge } from "./receivable-status-badge";

const DEFAULT_FILTERS: PayableFilterState = {
  query: "",
  status: "",
  method: "",
  category: "",
};

type Props = {
  onAction?: (msg: string) => void;
  filtersOpen?: boolean;
  onFiltersOpenChange?: (open: boolean) => void;
  onActiveFilterCountChange?: (count: number) => void;
  hideMobileFilterToolbar?: boolean;
};

export function AccountsPayableTable({
  onAction,
  filtersOpen: filtersOpenProp,
  onFiltersOpenChange,
  onActiveFilterCountChange,
  hideMobileFilterToolbar = false,
}: Props) {
  const [filterState, setFilterState] = useState<PayableFilterState>(DEFAULT_FILTERS);
  const [filtersOpenInternal, setFiltersOpenInternal] = useState(false);
  const filtersOpen = filtersOpenProp ?? filtersOpenInternal;
  const setFiltersOpen = onFiltersOpenChange ?? setFiltersOpenInternal;

  useEffect(() => {
    onActiveFilterCountChange?.(countPayableFilters(filterState));
  }, [filterState, onActiveFilterCountChange]);

  const apiFilters = useMemo(
    () => ({
      query: filterState.query,
      status: filterState.status,
      method: filterState.method,
      category: filterState.category,
    }),
    [filterState],
  );
  const { data: rows = [] } = useFinancialPayables(apiFilters);

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
    filterState.category,
  ]);

  const clearFilters = () => setFilterState(DEFAULT_FILTERS);

  return (
    <div className="admin-page-stack">
      {hideMobileFilterToolbar ? null : (
        <TableFiltersToolbar
          onOpen={() => setFiltersOpen(true)}
          activeFilterCount={countPayableFilters(filterState)}
        />
      )}
      <ResponsiveTableFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        onClear={clearFilters}
        resultCount={rows.length}
        resultUnit="despesa"
        renderFilters={(layout) => (
          <PayableFilters
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
          emptyMessage="Nenhuma despesa encontrada com os filtros atuais."
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
            <tr className={adminTableHeadRowClass}>
              <th className={inventoryThFirstClass}>Fornecedor</th>
              <th className={inventoryThClass}>Valor</th>
              <th className={inventoryThClass}>Vencimento</th>
              <th className={inventoryThClass}>Status</th>
              <th className={inventoryThClass}>Pagamento</th>
              <th className={inventoryThClass}>Categoria</th>
              <th className={`${inventoryThClass} text-right`}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((row) => (
              <tr
                key={row.id}
                className={adminTableBodyRowClass}
              >
                <td className={`${inventoryTdFirstClass} font-semibold text-[#0d1f3c]`}>
                  {row.supplierName}
                </td>
                <td className={`${inventoryTdClass} font-bold tabular-nums`}>
                  {row.amount}
                </td>
                <td className={inventoryTdClass}>{row.dueDate}</td>
                <td className={inventoryTdClass}>
                  <ReceivableStatusBadge status={row.status} />
                </td>
                <td className={inventoryTdClass}>{row.paymentMethod}</td>
                <td className={inventoryTdDescClass}>{row.category}</td>
                <td className={inventoryTdClass}>
                  <div className="flex items-center justify-end gap-1">
                    {row.status !== "pago" ? (
                      <TableIconButton
                        icon={HiBanknotes}
                        label="Pagar"
                        onClick={() =>
                          onAction?.(
                            `Pagamento registrado — ${row.supplierName} (mock).`,
                          )
                        }
                      />
                    ) : null}
                    <TableIconButton
                      icon={HiDocumentText}
                      label="Comprovante"
                      onClick={() =>
                        onAction?.(`Comprovante — ${row.supplierName} (mock).`)
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </InventoryTableShell>
      </div>

      <div className="lg:hidden">
        {totalItems === 0 ? (
          <p className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-10 text-center text-sm text-neutral-500">
            Nenhuma despesa encontrada com os filtros atuais.
          </p>
        ) : (
          <ul className="space-y-2">
            {paginatedItems.map((row) => (
              <li key={row.id}>
                <article className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-3 shadow-[0_1px_8px_rgba(13,31,60,0.04)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-[#0d1f3c]">
                        {row.supplierName}
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
                        {row.category}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {row.status !== "pago" ? (
                        <TableIconButton
                          icon={HiBanknotes}
                          label="Pagar"
                          onClick={() =>
                            onAction?.(
                              `Pagamento registrado — ${row.supplierName} (mock).`,
                            )
                          }
                        />
                      ) : null}
                      <TableIconButton
                        icon={HiDocumentText}
                        label="Comprovante"
                        onClick={() =>
                          onAction?.(`Comprovante — ${row.supplierName} (mock).`)
                        }
                      />
                    </div>
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
