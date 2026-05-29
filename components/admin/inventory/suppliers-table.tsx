"use client";

import type { SupplierStatus } from "@/lib/contracts/inventory";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";
import { useMemo, useState } from "react";
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
  SuppliersFilters,
  countSuppliersFilters,
  type SuppliersFilterState,
} from "./suppliers-filters";
import { useInventorySuppliers } from "./use-inventory-suppliers";
import { useInventoryTableState } from "./use-inventory-table-state";

const STATUS_STYLE: Record<SupplierStatus, string> = {
  ativo: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
  atrasado: "bg-red-50 text-red-800 ring-red-200/60",
  inativo: "bg-neutral-100 text-neutral-600 ring-neutral-200/60",
};

const DEFAULT_FILTERS: SuppliersFilterState = {
  query: "",
  status: "",
};

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
  const [filters, setFilters] = useState<SuppliersFilterState>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const suppliers = useMemo(
    () =>
      InventoryServiceMock.filterSuppliersList(allSuppliers, {
        query: filters.query,
        status: filters.status || "all",
      }),
    [allSuppliers, filters],
  );

  const {
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    paginatedItems,
    totalItems,
  } = useInventoryTableState(suppliers, [filters.query, filters.status]);

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="admin-page-stack">
      <TableFiltersToolbar
        onOpen={() => setFiltersOpen(true)}
        activeFilterCount={countSuppliersFilters(filters)}
      />
      <ResponsiveTableFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        onClear={clearFilters}
        resultCount={suppliers.length}
        resultUnit="fornecedor"
        renderFilters={(layout) => (
          <SuppliersFilters
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

      <div className="lg:hidden">
        {totalItems === 0 ? (
          <p className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white px-4 py-10 text-center text-sm text-neutral-500">
            Nenhum fornecedor encontrado com os filtros atuais.
          </p>
        ) : (
          <ul className="space-y-2">
            {paginatedItems.map((s) => (
              <li key={s.id}>
                <article className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-3 shadow-[0_1px_8px_rgba(13,31,60,0.04)]">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenSupplier?.(s.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-[13px] font-bold text-[#0d1f3c]">
                        {s.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-600">
                        <span className="font-semibold text-[#111]">{s.code}</span>
                        <span className="mx-1.5 text-neutral-300">·</span>
                        <span>{s.city}</span>
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${STATUS_STYLE[s.status]}`}
                        >
                          {InventoryServiceMock.getSupplierStatusLabels()[s.status]}
                        </span>
                        <span className="text-[11px] text-neutral-600">
                          Prazo médio: <span className="font-semibold text-[#111]">{s.avgLeadDays} dias</span>
                        </span>
                      </div>
                    </button>

                    <div className="flex shrink-0 items-center gap-1">
                      {onOpenSupplier ? (
                        <TableIconButton
                          icon={HiEye}
                          label="Visualizar"
                          onClick={() => onOpenSupplier(s.id)}
                        />
                      ) : null}
                      {onEditSupplier ? (
                        <TableIconButton
                          icon={HiPencil}
                          label="Editar"
                          onClick={() => onEditSupplier(s.id)}
                        />
                      ) : null}
                      {onDeleteSupplier ? (
                        <TableIconButton
                          icon={HiTrash}
                          label="Excluir"
                          onClick={() => onDeleteSupplier(s.id)}
                        />
                      ) : null}
                    </div>
                  </div>

                  <dl className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <dt className="text-neutral-500">CNPJ</dt>
                      <dd className="font-semibold text-[#111]">{s.cnpj}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Telefone</dt>
                      <dd className="font-semibold text-[#111]">{s.phone}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-neutral-500">Última compra</dt>
                      <dd className="font-semibold text-[#111]">
                        {InventoryServiceMock.formatInventoryDate(s.lastPurchase)}
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
