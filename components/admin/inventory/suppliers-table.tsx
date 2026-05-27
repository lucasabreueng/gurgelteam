"use client";

import type { SupplierStatus } from "@/lib/contracts/inventory";

import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import { useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

import { FilterBox, filterFieldHeightClass, filtersActive } from "@/components/ui/filter-box";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { settingsInputClass } from "../settings/settings-section";
import { InventoryTablePagination } from "./inventory-table-pagination";
import {
  InventoryTableActions,
  InventoryTableShell,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryTdFirstClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "./inventory-table-shared";
import { useInventorySuppliers } from "./use-inventory-suppliers";
import { useInventoryTableState } from "./use-inventory-table-state";

const STATUS_STYLE: Record<SupplierStatus, string> = {
  ativo: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  atrasado: "bg-red-50 text-red-800 ring-red-200/60",
  inativo: "bg-neutral-100 text-neutral-600 ring-neutral-200/60",
};

const STATUS_OPTIONS = [
  { value: "", label: "Status" },
  ...(
    Object.entries(InventoryServiceMock.getSupplierStatusLabels()) as [SupplierStatus, string][]
  ).map(([value, label]) => ({ value, label })),
];

type Props = {
  onOpenSupplier?: (id: string) => void;
  onEditSupplier?: (id: string) => void;
  onDeleteSupplier?: (id: string) => void;
};

export function SuppliersTable({
  onOpenSupplier,
  onEditSupplier,
  onDeleteSupplier,
}: Props) {
  const allSuppliers = useInventorySuppliers();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SupplierStatus | "">("");

  const suppliers = useMemo(
    () => InventoryServiceMock.filterSuppliersList(allSuppliers, { query, status: status || "all" }),
    [allSuppliers, query, status],
  );

  const {
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    paginatedItems,
    totalItems,
  } = useInventoryTableState(suppliers, [query, status]);

  const filtersAreActive = filtersActive([query, status]);

  return (
    <div className="admin-page-stack">
      <FilterBox
        active={filtersAreActive}
        onClear={() => {
          setQuery("");
          setStatus("");
        }}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-stretch">
          <div className="relative min-w-[200px] flex-[2] lg:min-w-[240px]">
            <HiMagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Buscar fornecedor, código…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${settingsInputClass} ${filterFieldHeightClass} w-full pl-10`}
              aria-label="Buscar fornecedor"
            />
          </div>
          <div className="w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1">
            <SettingsDropdown
              aria-label="Status"
              options={STATUS_OPTIONS}
              value={status}
              onSelect={(v) => setStatus(v as SupplierStatus | "")}
            />
          </div>
        </div>
      </FilterBox>

      <InventoryTableShell
        isEmpty={totalItems === 0}
        emptyMessage="Nenhum fornecedor encontrado com os filtros atuais."
        pagination={
          <InventoryTablePagination
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
            <th className={inventoryThFirstClass}>Código</th>
            <th className={inventoryThClass}>Descrição</th>
            <th className={inventoryThClass}>Status</th>
            <th className={inventoryThClass}>CNPJ</th>
            <th className={inventoryThClass}>Cidade</th>
            <th className={inventoryThClass}>Telefone</th>
            <th className={inventoryThClass}>Prazo médio</th>
            <th className={inventoryThClass}>Última compra</th>
            <th className={`${inventoryThClass} text-right`} />
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((s) => (
            <tr
              key={s.id}
              className="border-b border-[rgba(17,17,17,0.05)] transition last:border-0 hover:bg-[#fafbfc]/80"
            >
              <td className={inventoryTdFirstClass}>{s.code}</td>
              <td className={inventoryTdDescClass}>{s.name}</td>
              <td className={inventoryTdClass}>
                <span
                  className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${STATUS_STYLE[s.status]}`}
                >
                  {InventoryServiceMock.getSupplierStatusLabels()[s.status]}
                </span>
              </td>
              <td className={inventoryTdClass}>{s.cnpj}</td>
              <td className={inventoryTdClass}>{s.city}</td>
              <td className={inventoryTdClass}>{s.phone}</td>
              <td className={inventoryTdClass}>{s.avgLeadDays} dias</td>
              <td className={inventoryTdClass}>
                {InventoryServiceMock.formatInventoryDate(s.lastPurchase)}
              </td>
              <InventoryTableActions
                onView={() => onOpenSupplier?.(s.id)}
                onEdit={() => onEditSupplier?.(s.id)}
                onDelete={() => onDeleteSupplier?.(s.id)}
              />
            </tr>
          ))}
        </tbody>
      </InventoryTableShell>
    </div>
  );
}
