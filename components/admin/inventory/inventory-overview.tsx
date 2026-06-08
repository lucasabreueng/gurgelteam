import type { MovementType } from "@/lib/contracts/inventory";
import { useInventoryMovements } from "@/lib/query/hooks/use-inventory-catalog";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import {
  CategoryConsumptionChart,
  ConsumptionChart,
  MovementChart,
} from "./inventory-charts";

type Props = {
  onOpenPart?: (id: string) => void;
};

const movementItemClass =
  "flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#fafbfc] px-4 py-3 text-sm ring-1 ring-[rgba(17,17,17,0.06)]";

export function InventoryOverview({ onOpenPart }: Props) {
  const { data: movements = [] } = useInventoryMovements();
  const recentMovements = movements.slice(0, 5);
  const criticalPreview = InventoryServiceMock.getCriticalStock()
    .filter((c) => c.stock < c.minStock)
    .slice(0, 5);

  return (
    <div className="admin-page-stack">
      <section className="admin-page-grid grid lg:grid-cols-2">
        <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
          <h3 className="text-sm font-bold text-[#0d1f3c]">Peças críticas</h3>
          <ul className="mt-4 space-y-2">
            {criticalPreview.length === 0 ? (
              <li className="rounded-xl bg-[#fafbfc] px-4 py-6 text-center text-sm text-neutral-500 ring-1 ring-[rgba(17,17,17,0.06)]">
                Nenhuma peça abaixo do mínimo.
              </li>
            ) : (
              criticalPreview.map((c) => (
                <li key={c.partId}>
                  <button
                    type="button"
                    onClick={() => onOpenPart?.(c.partId)}
                    className={`${movementItemClass} w-full text-left transition hover:bg-white`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-[#0d1f3c]">
                        {c.partName}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {c.partCode}
                      </span>
                    </span>
                    <span className="shrink-0 text-[10px] font-bold uppercase tabular-nums text-red-700">
                      {c.stock} / {c.minStock}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
          <h3 className="text-sm font-bold text-[#0d1f3c]">Movimentações recentes</h3>
          <ul className="mt-4 space-y-2">
            {recentMovements.map((m) => {
              const apiRow = m as {
                id: string;
                partName: string;
                createdAt?: string;
                datetime?: string;
                qty?: number;
                quantity?: number;
                type: string;
              };
              const datetime = apiRow.createdAt
                ? InventoryServiceMock.formatInventoryDate(apiRow.createdAt)
                : (apiRow.datetime ?? "—");
              const quantity =
                apiRow.qty !== undefined
                  ? apiRow.type === "entrada" || apiRow.type === "devolucao"
                    ? apiRow.qty
                    : -apiRow.qty
                  : (apiRow.quantity ?? 0);
              const typeLabels = InventoryServiceMock.getMovementTypeLabels();
              return (
              <li key={m.id} className={movementItemClass}>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-[#0d1f3c]">
                    {m.partName}
                  </span>
                  <span className="text-xs text-neutral-500">{datetime}</span>
                </span>
                <span className="shrink-0 text-[10px] font-bold uppercase text-neutral-600">
                  {typeLabels[apiRow.type as MovementType]} ·{" "}
                  {quantity > 0 ? `+${quantity}` : quantity}
                </span>
              </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="admin-page-grid grid lg:grid-cols-3">
        <ConsumptionChart />
        <MovementChart />
        <CategoryConsumptionChart />
      </section>
    </div>
  );
}
