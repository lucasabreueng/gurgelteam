"use client";

import { useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";
import type { StockLevel } from "@/lib/contracts/parts";
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
import { StockStatusBadge } from "./stock-status-badge";
import { useInventoryParts } from "./use-inventory-parts";
import { useInventoryTableState } from "./use-inventory-table-state";

type Props = {
  onOpenPart: (id: string) => void;
  onEditPart: (id: string) => void;
  onDeletePart: (id: string) => void;
};

export function PartsTable({ onOpenPart, onEditPart, onDeletePart }: Props) {
  const allParts = useInventoryParts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [health, setHealth] = useState<StockLevel | "">("");

  const parts = useMemo(
    () =>
      InventoryServiceMock.filterPartsList(allParts, {
        query,
        category: category || "all",
        supplier: supplier || "all",
        health: health || "all",
      }),
    [allParts, query, category, supplier, health],
  );

  const {
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    paginatedItems,
    totalItems,
  } = useInventoryTableState(parts, [query, category, supplier, health]);

  const categoryOptions = [
    { value: "", label: "Categoria" },
    ...InventoryServiceMock.getCategories().map((c) => ({ value: c, label: c })),
  ];

  const supplierOptions = [
    { value: "", label: "Fornecedor" },
    ...InventoryServiceMock.getSupplierNames().map((s) => ({ value: s, label: s })),
  ];

  const filtersAreActive = filtersActive([query, category, supplier, health]);

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setSupplier("");
    setHealth("");
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
              placeholder="Buscar peça, código…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${settingsInputClass} ${filterFieldHeightClass} w-full pl-10`}
              aria-label="Buscar peça"
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
          <div className="w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1">
            <SettingsDropdown
              aria-label="Saúde do estoque"
              options={InventoryServiceMock.getStockHealthFilterOptions().map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              value={health}
              onSelect={(v) => setHealth(v as StockLevel | "")}
            />
          </div>
          <div className="w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1">
            <SettingsDropdown
              aria-label="Fornecedor"
              options={supplierOptions}
              value={supplier}
              onSelect={setSupplier}
            />
          </div>
        </div>
      </FilterBox>

      <InventoryTableShell
        isEmpty={totalItems === 0}
        emptyMessage="Nenhuma peça encontrada com os filtros atuais."
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
            <th className={inventoryThClass}>Categoria</th>
            <th className={inventoryThClass}>Estoque</th>
            <th className={inventoryThClass}>Saúde</th>
            <th className={inventoryThClass}>Custo unit.</th>
            <th className={`${inventoryThClass} text-right`} />
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((part) => (
            <tr
              key={part.id}
              className="border-b border-[rgba(17,17,17,0.05)] transition last:border-0 hover:bg-[#fafbfc]/80"
            >
              <td className={inventoryTdFirstClass}>{part.code}</td>
              <td className={inventoryTdDescClass}>{part.name}</td>
              <td className={inventoryTdClass}>{part.category}</td>
              <td className={`${inventoryTdClass} tabular-nums font-semibold text-[#0d1f3c]`}>
                {part.stock}
              </td>
              <td className={inventoryTdClass}>
                <StockStatusBadge level={part.stockLevel} />
              </td>
              <td className={`${inventoryTdClass} tabular-nums font-semibold text-[#0d1f3c]`}>
                {InventoryServiceMock.formatCurrency(part.unitCost)}
              </td>
              <InventoryTableActions
                onView={() => onOpenPart(part.id)}
                onEdit={() => onEditPart(part.id)}
                onDelete={() => onDeletePart(part.id)}
              />
            </tr>
          ))}
        </tbody>
      </InventoryTableShell>
    </div>
  );
}
