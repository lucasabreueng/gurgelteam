"use client";

import type { PurchaseStatus, PurchaseOrder } from "@/lib/contracts/inventory";

import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import { HiArrowDownTray, HiShoppingCart } from "react-icons/hi2";

import { InventoryTablePagination } from "./inventory-table-pagination";
import {
  InventoryTableShell,
  TableIconButton,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryTdFirstClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "./inventory-table-shared";
import { useInventoryTableState } from "./use-inventory-table-state";

const STATUS_STYLE: Record<PurchaseStatus, string> = {
  solicitado: "bg-amber-50 text-amber-900 ring-amber-200/60",
  aprovado: "bg-sky-50 text-sky-900 ring-sky-200/60",
  comprado: "bg-violet-50 text-violet-900 ring-violet-200/60",
  entregue: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
};

type Props = {
  onRequestPurchase?: (order: PurchaseOrder) => void;
  onReceive?: (order: PurchaseOrder) => void;
};

export function PurchaseOrders({ onRequestPurchase, onReceive }: Props) {
  const {
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    paginatedItems,
    totalItems,
  } = useInventoryTableState(InventoryServiceMock.getPurchaseOrders(), []);

  return (
    <div className="admin-page-stack">
      <InventoryTableShell
        isEmpty={totalItems === 0}
        emptyMessage="Nenhum pedido de compra."
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
            <th className={inventoryThClass}>Fornecedor</th>
            <th className={inventoryThClass}>Qtd</th>
            <th className={inventoryThClass}>Valor</th>
            <th className={inventoryThClass}>Previsão</th>
            <th className={inventoryThClass}>Status</th>
            <th className={inventoryThClass}>Solicitante</th>
            <th className={`${inventoryThClass} text-right`} />
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((po) => (
            <tr
              key={po.id}
              className="border-b border-[rgba(17,17,17,0.05)] transition last:border-0 hover:bg-[#fafbfc]/80"
            >
              <td className={inventoryTdFirstClass}>{po.partCode}</td>
              <td className={inventoryTdDescClass}>{po.partName}</td>
              <td className={inventoryTdClass}>{po.supplierName}</td>
              <td className={`${inventoryTdClass} tabular-nums font-semibold text-[#0d1f3c]`}>
                {po.quantity} un.
              </td>
              <td className={`${inventoryTdClass} tabular-nums font-semibold text-[#0d1f3c]`}>
                {InventoryServiceMock.formatCurrency(po.value)}
              </td>
              <td className={inventoryTdClass}>{po.forecast}</td>
              <td className={inventoryTdClass}>
                <span
                  className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ${STATUS_STYLE[po.status]}`}
                >
                  {InventoryServiceMock.getPurchaseStatusLabels()[po.status]}
                </span>
              </td>
              <td className={inventoryTdClass}>{po.requestedBy}</td>
              <td className="px-4 py-3.5">
                <div className="flex items-center justify-end gap-1">
                  <TableIconButton
                    icon={HiShoppingCart}
                    label="Solicitar compra"
                    onClick={() => onRequestPurchase?.(po)}
                  />
                  <TableIconButton
                    icon={HiArrowDownTray}
                    label="Registrar recebimento"
                    onClick={() => onReceive?.(po)}
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
