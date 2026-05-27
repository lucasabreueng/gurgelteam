"use client";

import { useMemo, useState } from "react";
import { HiBanknotes, HiDocumentText, HiMagnifyingGlass } from "react-icons/hi2";
import type { ReceivableStatus } from "@/lib/contracts/finance/finance.types";
import { useFinancialPayables } from "@/lib/query/hooks/use-financial-payables";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";
import { FilterBox, filterFieldHeightClass, filtersActive } from "@/components/ui/filter-box";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { settingsInputClass } from "../settings/settings-section";
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

const PAYABLE_METHODS = [
  "Boleto",
  "Pix",
  "Transferência",
  "Débito automático",
] as const;

type Props = {
  onAction?: (msg: string) => void;
};

export function AccountsPayableTable({ onAction }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ReceivableStatus | "">("");
  const [method, setMethod] = useState("");
  const [category, setCategory] = useState("");

  const filters = useMemo(
    () => ({ query, status, method, category }),
    [query, status, method, category],
  );
  const { data: rows = [] } = useFinancialPayables(filters);

  const {
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    paginatedItems,
    totalItems,
  } = useInventoryTableState(rows, [query, status, method, category]);

  const methodOptions = [
    { value: "", label: "Pagamento" },
    ...PAYABLE_METHODS.map((m) => ({ value: m, label: m })),
  ];

  const categoryOptions = [
    { value: "", label: "Categoria" },
    ...FinancialServiceMock.getPayableCategories().map((c) => ({
      value: c,
      label: c,
    })),
  ];

  const filtersAreActive = filtersActive([query, status, method, category]);

  const clearFilters = () => {
    setQuery("");
    setStatus("");
    setMethod("");
    setCategory("");
  };

  return (
    <div className="admin-page-stack">
      <FilterBox active={filtersAreActive} onClear={clearFilters}>
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-stretch">
          <div className="relative min-w-[200px] flex-[2] lg:min-w-[240px]">
            <HiMagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Buscar fornecedor, categoria…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${settingsInputClass} ${filterFieldHeightClass} w-full pl-10`}
              aria-label="Buscar despesa"
            />
          </div>
          <div className="w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1">
            <SettingsDropdown
              aria-label="Status"
              options={FinancialServiceMock.getReceivableFilterOptions().map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              value={status}
              onSelect={(v) => setStatus(v as ReceivableStatus | "")}
            />
          </div>
          <div className="w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1">
            <SettingsDropdown
              aria-label="Forma de pagamento"
              options={methodOptions}
              value={method}
              onSelect={setMethod}
            />
          </div>
          <div className="w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1">
            <SettingsDropdown
              aria-label="Categoria"
              options={categoryOptions}
              value={category}
              onSelect={setCategory}
            />
          </div>
        </div>
      </FilterBox>

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
          <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc]">
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
              className="border-b border-[rgba(17,17,17,0.04)] transition hover:bg-[#fafbfc]/80"
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
  );
}
