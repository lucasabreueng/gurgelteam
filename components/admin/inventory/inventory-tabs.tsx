"use client";

import type { InventoryTabKey } from "@/lib/contracts/inventory";
import { InventoryServiceMock } from "@/services/inventory/inventoryServiceMock";

type Props = {
  active: InventoryTabKey;
  onChange: (key: InventoryTabKey) => void;
};

const TAB_LIST_CLASS =
  "-mb-px app-scrollbar-hidden flex min-w-0 touch-pan-x select-none gap-0 overflow-x-auto overscroll-x-contain scroll-smooth scroll-px-5";

const TAB_BUTTON_CLASS =
  "relative shrink-0 select-none whitespace-nowrap border-b-2 px-4 py-3 text-[13px] font-semibold tracking-tight transition-colors sm:px-5";

export function InventoryTabs({ active, onChange }: Props) {
  return (
    <nav aria-label="Seções de estoque" className="admin-page-gutter select-none">
      <div role="tablist" className={TAB_LIST_CLASS}>
        {InventoryServiceMock.getTabs().map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`inventory-panel-${tab.key}`}
              id={`inventory-tab-${tab.key}`}
              onClick={() => onChange(tab.key)}
              className={`${TAB_BUTTON_CLASS} ${
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
