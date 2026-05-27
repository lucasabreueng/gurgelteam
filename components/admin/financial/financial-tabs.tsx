"use client";

import type { FinancialTabKey } from "@/lib/contracts/finance/finance.types";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";

type Props = {
  active: FinancialTabKey;
  onChange: (key: FinancialTabKey) => void;
};

export function FinancialTabs({ active, onChange }: Props) {
  return (
    <nav aria-label="Seções financeiras" className="admin-page-gutter">
      <div
        role="tablist"
        className="-mb-px flex min-w-0 gap-0 overflow-x-auto scroll-smooth scroll-px-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {FinancialServiceMock.getTabs().map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`financial-panel-${tab.key}`}
              id={`financial-tab-${tab.key}`}
              onClick={() => onChange(tab.key)}
              className={`relative shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-semibold tracking-tight transition-colors sm:px-5 ${
                isActive
                  ? "-mb-px border-[#0d1f3c] text-[#0d1f3c]"
                  : "border-transparent text-neutral-500 hover:border-[rgba(13,31,60,0.2)] hover:text-[#0d1f3c]"
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
