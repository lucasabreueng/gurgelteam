"use client";

import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

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

const TYPE_LABELS: Record<string, string> = {
  movimentacao: "Movimentação",
  entrada: "Entrada",
  saida: "Saída",
  troca: "Troca",
  compra: "Compra",
  alerta: "Alerta",
};

export function InventoryHistoryTimeline() {
  const {
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    paginatedItems,
    totalItems,
  } = useInventoryTableState(InventoryServiceMock.getHistory(), []);

  return (
    <div className="admin-page-stack">
      <InventoryTableShell
        isEmpty={totalItems === 0}
        emptyMessage="Nenhum evento no histórico."
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
            <th className={inventoryThFirstClass}>Data/hora</th>
            <th className={inventoryThClass}>Tipo</th>
            <th className={inventoryThClass}>Evento</th>
            <th className={inventoryThClass}>Descrição</th>
            <th className={inventoryThClass}>Responsável</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((ev) => (
            <tr
              key={ev.id}
              className="border-b border-[rgba(17,17,17,0.05)] transition last:border-0 hover:bg-[#fafbfc]/80"
            >
              <td className={`${inventoryTdFirstClass} whitespace-nowrap`}>
                {ev.datetime}
              </td>
              <td className={inventoryTdClass}>
                {TYPE_LABELS[ev.type] ?? ev.type}
              </td>
              <td className={inventoryTdDescClass}>{ev.title}</td>
              <td className={inventoryTdClass}>{ev.description}</td>
              <td className={inventoryTdClass}>{ev.responsible ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </InventoryTableShell>
    </div>
  );
}
