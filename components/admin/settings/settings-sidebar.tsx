"use client";

import type { SettingsTabKey } from "@/lib/contracts/settings";
import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";
import {
  adminSettingsProfileTabActiveClass,
  adminSettingsProfileTabClass,
} from "@/lib/design";

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
            className={`shrink-0 text-left text-[13px] font-semibold transition lg:w-full lg:rounded-2xl lg:px-4 lg:py-3 ${
              isActive
                ? `${adminSettingsProfileTabActiveClass} max-lg:shadow-none lg:shadow-[var(--ds-shadow-card)]`
                : `${adminSettingsProfileTabClass} lg:border-transparent lg:bg-transparent lg:shadow-none lg:hover:bg-[var(--ds-bg-muted)]`
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
