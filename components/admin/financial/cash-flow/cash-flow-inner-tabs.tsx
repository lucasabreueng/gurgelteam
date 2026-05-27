"use client";

import type { CashFlowInnerTabKey } from "@/lib/contracts/cashflow";
import { CashFlowServiceMock } from "@/services/cashflow/cashFlowServiceMock";

type Props = {
  active: CashFlowInnerTabKey;
  onChange: (key: CashFlowInnerTabKey) => void;
};

export function CashFlowInnerTabs({ active, onChange }: Props) {
  return (
    <nav aria-label="Seções do fluxo de caixa">
      <div
        role="tablist"
        className="flex flex-wrap gap-2 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-1.5"
      >
        {CashFlowServiceMock.getInnerTabs().map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className={`rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                isActive
                  ? "bg-[#0d1f3c] text-white shadow-sm"
                  : "text-neutral-600 hover:bg-white hover:text-[#0d1f3c]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
