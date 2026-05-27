"use client";

import type { SettingsTabKey } from "@/lib/contracts/settings";
import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

type Props = {
  active: SettingsTabKey;
  onChange: (key: SettingsTabKey) => void;
};

export function SettingsSidebar({ active, onChange }: Props) {
  return (
    <nav
      className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
      aria-label="Seções de configurações"
    >
      {SettingsServiceMock.getTabs().map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-left text-[13px] font-semibold transition lg:w-full lg:rounded-2xl lg:px-4 lg:py-3 ${
              isActive
                ? "bg-[#0d1f3c] text-white shadow-[0_4px_14px_rgba(13,31,60,0.2)]"
                : "bg-white text-neutral-600 ring-1 ring-[rgba(17,17,17,0.08)] hover:bg-[#fafbfc] hover:text-[#0d1f3c] lg:bg-transparent lg:ring-0 lg:hover:bg-white/80"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
