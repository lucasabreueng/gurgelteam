"use client";

import type { MovementType } from "@/lib/contracts/inventory";

import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import { useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

import { FilterBox, filterFieldHeightClass, filtersActive } from "@/components/ui/filter-box";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { settingsInputClass } from "../settings/settings-section";
import { InventoryTablePagination } from "./inventory-table-pagination";
import {
  InventoryTableShell,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryTdFirstClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "./inventory-table-shared";
import { useInventoryTableState } from "./use-inventory-table-state";

const TYPE_STYLE: Record<MovementType, string> = {
  entrada: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  saida: "bg-sky-50 text-sky-900 ring-sky-200/60",
  ajuste: "bg-amber-50 text-amber-900 ring-amber-200/60",
  perda: "bg-red-50 text-red-800 ring-red-200/60",
  devolucao: "bg-violet-50 text-violet-900 ring-violet-200/60",
};

const TYPE_OPTIONS: { value: MovementType | ""; label: string }[] = [
  { value: "", label: "Todos tipos" },
  ...(
    Object.entries(InventoryServiceMock.getMovementTypeLabels()) as [MovementType, string][]
  ).map(([value, label]) => ({ value, label })),
];

export function InventoryMovements() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<MovementType | "">("");

  const rows = useMemo(() => {
    let list = [...InventoryServiceMock.getMovements()];
    if (typeFilter) list = list.filter((m) => m.type === typeFilter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((m) =>
        [m.partName, m.partCode, m.responsible, m.osNumber ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }
    return list;
  }, [query, typeFilter]);

  const {
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    paginatedItems,
    totalItems,
  } = useInventoryTableState(rows, [query, typeFilter]);

  const filtersAreActive = filtersActive([query, typeFilter]);

  return (
    <div className="admin-page-stack">
      <FilterBox
        active={filtersAreActive}
        onClear={() => {
          setQuery("");
          setTypeFilter("");
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
              placeholder="Buscar peça, OS, responsável…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${settingsInputClass} ${filterFieldHeightClass} w-full pl-10`}
              aria-label="Buscar movimentação"
            />
          </div>
          <div className="w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1">
            <SettingsDropdown
              aria-label="Tipo de movimentação"
              options={TYPE_OPTIONS}
              value={typeFilter}
              onSelect={(v) => setTypeFilter(v as MovementType | "")}
            />
          </div>
        </div>
      </FilterBox>

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
          <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc]">
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
              className="border-b border-[rgba(17,17,17,0.05)] transition last:border-0 hover:bg-[#fafbfc]/80"
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
