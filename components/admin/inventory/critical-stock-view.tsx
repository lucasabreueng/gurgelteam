"use client";

import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import { StockStatusBadge } from "./stock-status-badge";

type Props = {
  onRequestPurchase?: (partName?: string) => void;
  onOpenPart?: (partId: string) => void;
};

export function CriticalStockView({ onRequestPurchase, onOpenPart }: Props) {
  return (
    <div className="admin-page-stack">
      <div>
        <h2 className="text-lg font-bold text-[#0d1f3c]">Estoque crítico</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Peças com risco de ruptura — priorize reposição antes da próxima sessão
        </p>
      </div>

      <div className="overflow-visible rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
        <div className="overflow-x-auto rounded-t-2xl">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <th className="px-4 py-3.5">Peça</th>
                <th className="px-3 py-3.5">Código</th>
                <th className="px-3 py-3.5">Estoque</th>
                <th className="px-3 py-3.5">Saúde</th>
                <th className="px-3 py-3.5">Sessões rest.</th>
                <th className="px-3 py-3.5">Consumo médio</th>
                <th className="px-3 py-3.5">Última compra</th>
                <th className="px-3 py-3.5">Ruptura prev.</th>
                <th className="px-4 py-3.5 text-right" />
              </tr>
            </thead>
            <tbody>
              {InventoryServiceMock.getCriticalStock().map((item) => (
                <tr
                  key={item.partId}
                  className="border-b border-[rgba(17,17,17,0.05)] transition last:border-0 hover:bg-[#fafbfc]/80"
                >
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => onOpenPart?.(item.partId)}
                      className="text-left font-semibold text-[#0d1f3c] hover:underline"
                    >
                      {item.partName}
                    </button>
                    <p className="mt-0.5 text-xs text-red-800">{item.message}</p>
                  </td>
                  <td className="px-3 py-3.5 font-mono text-xs text-neutral-600">
                    {item.partCode}
                  </td>
                  <td className="px-3 py-3.5 tabular-nums">
                    <span className="font-semibold text-red-700">
                      {item.stock}
                    </span>
                    <span className="text-neutral-400">
                      {" "}
                      / {item.minStock}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <StockStatusBadge level="critical" />
                  </td>
                  <td className="px-3 py-3.5 font-bold tabular-nums text-red-600">
                    {item.sessionsLeft}
                  </td>
                  <td className="px-3 py-3.5 text-neutral-700">
                    {item.avgConsumption}
                  </td>
                  <td className="px-3 py-3.5 text-neutral-700">
                    {item.lastPurchase}
                  </td>
                  <td className="px-3 py-3.5 font-semibold text-red-700">
                    {item.ruptureForecast}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <button
                        type="button"
                        onClick={() => onRequestPurchase?.(item.partName)}
                        className="text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] hover:underline"
                      >
                        Comprar
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenPart?.(item.partId)}
                        className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:underline"
                      >
                        Ver peça
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
