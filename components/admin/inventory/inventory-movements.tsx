"use client";

import type { MovementType } from "@/lib/contracts/inventory";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";
import { useInventoryMovements } from "@/lib/query/hooks/use-inventory-catalog";
import { useMemo, useState } from "react";
import { ResponsiveTableFilters } from "@/components/ui/responsive-table-filters";
import { TableFiltersToolbar } from "@/components/ui/table-filters-toolbar";
import { InventoryTablePagination } from "./inventory-table-pagination";
import {
  InventoryTableShell,
  adminTableBodyRowClass,
  adminTableHeadRowClass,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryTdFirstClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "./inventory-table-shared";
import {
  MovementsFilters,
  countMovementsFilters,
  type MovementsFilterState,
} from "./movements-filters";
import { useInventoryTableState } from "./use-inventory-table-state";
import {
  adminBadgeErrorClass,
  adminBadgeInfoClass,
  adminBadgeNeutralClass,
  adminBadgeSuccessClass,
  adminBadgeWarningClass,
} from "@/lib/design";

const TYPE_STYLE: Record<MovementType, string> = {
  entrada: adminBadgeSuccessClass,
  saida: adminBadgeInfoClass,
  ajuste: adminBadgeWarningClass,
  perda: adminBadgeErrorClass,
  devolucao: adminBadgeNeutralClass,
};

const DEFAULT_FILTERS: MovementsFilterState = {
  query: "",
  typeFilter: "",
};

export function InventoryMovements() {
  const { data: rawMovements = [] } = useInventoryMovements();
  const [filters, setFilters] = useState<MovementsFilterState>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const rows = useMemo(() => {
    let list = rawMovements.map((m) => {
      if ("createdAt" in m) {
        return {
          id: m.id,
          partCode: m.partCode,
          partName: m.partName,
          type: m.type as MovementType,
          quantity:
            m.type === "entrada" || m.type === "devolucao" ? m.qty : -m.qty,
          kartNumber: null as number | null,
          osNumber: null as string | null,
          responsible: "—",
          datetime: InventoryServiceMock.formatInventoryDate(m.createdAt),
        };
      }
      return m;
    });
    if (filters.typeFilter) list = list.filter((m) => m.type === filters.typeFilter);
    const q = filters.query.trim().toLowerCase();
    if (q) {
      list = list.filter((m) =>
        [m.partName, m.partCode, m.responsible, m.osNumber ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    return list;
  }, [filters, rawMovements]);

  const {
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    paginatedItems,
    totalItems,
  } = useInventoryTableState(rows, [filters.query, filters.typeFilter]);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="admin-page-stack">
      <TableFiltersToolbar
        onOpen={() => setFiltersOpen(true)}
        activeFilterCount={countMovementsFilters(filters)}
      />
      <ResponsiveTableFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        onClear={clearFilters}
        resultCount={rows.length}
        resultUnit="movimentação"
        renderFilters={(layout) => (
          <MovementsFilters
            layout={layout}
            filters={filters}
            onChange={(patch) => setFilters((p) => ({ ...p, ...patch }))}
            onClear={clearFilters}
          />
        )}
      />

      <InventoryTableShell
        isEmpty={totalItems === 0}
        emptyMessage="Nenhuma movimentação encontrada."
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
          <tr className={adminTableHeadRowClass}>
            <th className={inventoryThFirstClass}>Código</th>
            <th className={inventoryThClass}>Descrição</th>
            <th className={inventoryThClass}>Tipo</th>
            <th className={inventoryThClass}>Qtd</th>
            <th className={inventoryThClass}>Kart</th>
            <th className={inventoryThClass}>OS</th>
            <th className={inventoryThClass}>Responsável</th>
            <th className={inventoryThClass}>Data/hora</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((m) => (
            <tr
              key={m.id}
              className={adminTableBodyRowClass}
            >
              <td className={inventoryTdFirstClass}>{m.partCode}</td>
              <td className={inventoryTdDescClass}>{m.partName}</td>
              <td className={inventoryTdClass}>
                <span
                  className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${TYPE_STYLE[m.type]}`}
                >
                  {InventoryServiceMock.getMovementTypeLabels()[m.type]}
                </span>
              </td>
              <td className={`${inventoryTdClass} tabular-nums font-semibold text-[#0d1f3c]`}>
                {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
              </td>
              <td className={inventoryTdClass}>
                {m.kartNumber
                  ? `Kart ${String(m.kartNumber).padStart(2, "0")}`
                  : "—"}
              </td>
              <td className={inventoryTdClass}>{m.osNumber ?? "—"}</td>
              <td className={inventoryTdClass}>{m.responsible}</td>
              <td className={inventoryTdClass}>{m.datetime}</td>
            </tr>
          ))}
        </tbody>
      </InventoryTableShell>
    </div>
  );
}
