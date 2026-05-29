"use client";

import { useMemo, useState } from "react";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";
import { ResponsiveTableFilters } from "@/components/ui/responsive-table-filters";
import { TableFiltersToolbar } from "@/components/ui/table-filters-toolbar";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import { InventoryTablePagination } from "./inventory-table-pagination";
import {
  InventoryTableActions,
  InventoryTableShell,
  TableIconButton,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryTdFirstClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "./inventory-table-shared";
import {
  PartsFilters,
  countPartsFilters,
  type PartsFilterState,
} from "./parts-filters";
import { StockStatusBadge } from "./stock-status-badge";
import { useInventoryParts } from "./use-inventory-parts";
import { useInventoryTableState } from "./use-inventory-table-state";

const DEFAULT_FILTERS: PartsFilterState = {
  query: "",
  category: "",
  supplier: "",
  health: "",
};

type Props = {
  onOpenPart: (id: string) => void;
  onEditPart: (id: string) => void;
  onDeletePart: (id: string) => void;
};

export function PartsTable({ onOpenPart, onEditPart, onDeletePart }: Props) {
  const allParts = useInventoryParts();
  const [filters, setFilters] = useState<PartsFilterState>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const parts = useMemo(
    () =>
      InventoryServiceMock.filterPartsList(allParts, {
        query: filters.query,
        category: filters.category || "all",
        supplier: filters.supplier || "all",
        health: filters.health || "all",
      }),
    [allParts, filters],
  );

  const {
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    paginatedItems,
    totalItems,
  } = useInventoryTableState(parts, [
    filters.query,
    filters.category,
    filters.supplier,
    filters.health,
  ]);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="admin-page-stack">
      <TableFiltersToolbar
        onOpen={() => setFiltersOpen(true)}
        activeFilterCount={countPartsFilters(filters)}
      />
      <ResponsiveTableFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        onClear={clearFilters}
        resultCount={parts.length}
        resultUnit="peça"
        renderFilters={(layout) => (
          <PartsFilters
            layout={layout}
            filters={filters}
            onChange={(patch) => setFilters((p) => ({ ...p, ...patch }))}
            onClear={clearFilters}
          />
        )}
      />

      <div className="hidden lg:block">
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

      <div className="lg:hidden">
        {totalItems === 0 ? (
          <p className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-10 text-center text-sm text-neutral-500">
            Nenhuma peça encontrada com os filtros atuais.
          </p>
        ) : (
          <ul className="space-y-2">
            {paginatedItems.map((part) => (
              <li key={part.id}>
                <article className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-3 shadow-[0_1px_8px_rgba(13,31,60,0.04)]">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenPart(part.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-[13px] font-bold text-[#0d1f3c]">
                        {part.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-600">
                        <span className="font-semibold text-[#111]">{part.code}</span>
                        <span className="mx-1.5 text-neutral-300">·</span>
                        <span>{part.category}</span>
                      </p>
                    </button>

                    <div className="flex shrink-0 items-center gap-1">
                      <TableIconButton
                        icon={HiEye}
                        label="Visualizar"
                        onClick={() => onOpenPart(part.id)}
                      />
                      <TableIconButton
                        icon={HiPencil}
                        label="Editar"
                        onClick={() => onEditPart(part.id)}
                      />
                      <TableIconButton
                        icon={HiTrash}
                        label="Excluir"
                        onClick={() => onDeletePart(part.id)}
                      />
                    </div>
                  </div>

                  <dl className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <dt className="text-neutral-500">Estoque</dt>
                      <dd className="font-bold tabular-nums text-[#0d1f3c]">
                        {part.stock}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Saúde</dt>
                      <dd>
                        <StockStatusBadge level={part.stockLevel} />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Custo unit.</dt>
                      <dd className="font-bold tabular-nums text-[#0d1f3c]">
                        {InventoryServiceMock.formatCurrency(part.unitCost)}
                      </dd>
                    </div>
                  </dl>
                </article>
              </li>
            ))}
          </ul>
        )}

        {totalItems === 0 ? null : (
          <div className="mt-3">
            <InventoryTablePagination
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
