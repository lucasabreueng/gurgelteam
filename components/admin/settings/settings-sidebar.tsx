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
      className="settings-tabs-nav flex gap-2 overflow-x-auto scroll-px-0.5 py-0.5 app-scrollbar-hidden lg:flex-col lg:overflow-visible lg:scroll-px-0 lg:py-0"
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
                ? "border border-transparent bg-[#0d1f3c] text-white max-lg:shadow-none lg:shadow-[0_4px_14px_rgba(13,31,60,0.2)]"
                : "border border-[rgba(17,17,17,0.08)] bg-white text-neutral-600 hover:border-accent/30 hover:bg-[#fafbfc] hover:text-[#0d1f3c] lg:border-transparent lg:bg-transparent lg:shadow-none lg:hover:bg-white/80"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
