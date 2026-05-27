import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

import {
  CategoryConsumptionChart,
  ConsumptionChart,
  MovementChart,
} from "./inventory-charts";

type Props = {
  onOpenPart?: (id: string) => void;
};

export function InventoryOverview({ onOpenPart }: Props) {
  const recentMovements = InventoryServiceMock.getMovements().slice(0, 5);
  const criticalPreview = InventoryServiceMock.getCriticalStock().slice(0, 5);

  return (
    <div className="admin-page-stack">
      <section className="admin-page-grid grid lg:grid-cols-3">
        <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
          <h3 className="text-sm font-bold text-[#0d1f3c]">Peças críticas</h3>
          <ul className="mt-4 space-y-2">
            {criticalPreview.map((c) => (
              <li key={c.partId}>
                <button
                  type="button"
                  onClick={() => onOpenPart?.(c.partId)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl bg-red-50/60 px-4 py-3 text-left text-sm transition hover:bg-red-50"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-[#0d1f3c]">
                      {c.partName}
                    </span>
                    <span className="text-xs text-red-800">{c.message}</span>
                  </span>
                  <span className="shrink-0 text-xs font-bold text-red-600">
                    {c.sessionsLeft} sess.
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
          <h3 className="text-sm font-bold text-[#0d1f3c]">Movimentações recentes</h3>
          <ul className="mt-4 space-y-2">
            {recentMovements.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#fafbfc] px-4 py-3 text-sm ring-1 ring-[rgba(17,17,17,0.06)]"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-[#0d1f3c]">
                    {m.partName}
                  </span>
                  <span className="text-xs text-neutral-500">{m.datetime}</span>
                </span>
                <span className="shrink-0 text-[10px] font-bold uppercase text-neutral-600">
                  {InventoryServiceMock.getMovementTypeLabels()[m.type]} ·{" "}
                  {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
          <h3 className="text-sm font-bold text-[#0d1f3c]">Peças mais utilizadas</h3>
          <ul className="mt-4 space-y-2">
            {InventoryServiceMock.getTopUsedParts().map((p, i) => (
              <li
                key={p.name}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="min-w-0 truncate font-medium text-[#0d1f3c]">
                  {i + 1}. {p.name}
                </span>
                <span className="shrink-0 font-bold tabular-nums text-neutral-600">
                  {p.count}
                </span>
              </li>
            ))}
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
