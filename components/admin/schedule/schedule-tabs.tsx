"use client";

import type { ScheduleViewKey } from "@/lib/contracts/schedule";
import { useScheduleMeta } from "@/lib/query/hooks/use-schedule";

type Props = {
  active: ScheduleViewKey;
  onChange: (key: ScheduleViewKey) => void;
  className?: string;
};

export function ScheduleViewToggle({ active, onChange, className = "" }: Props) {
  const { data: meta } = useScheduleMeta();
  const viewTabs = meta?.viewTabs ?? [];
  return (
    <div
      className={`flex shrink-0 gap-1 rounded-xl bg-[#fafbfc] p-1 ring-1 ring-[rgba(17,17,17,0.06)] ${className}`}
      role="tablist"
      aria-label="Visualização da agenda"
    >
      {viewTabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={active === tab.key}
          onClick={() => onChange(tab.key)}
          className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition ${
            active === tab.key
              ? "bg-[#0d1f3c] text-white shadow-sm"
              : "text-neutral-600 hover:text-[#0d1f3c]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/** @deprecated Use ScheduleViewToggle */
export function ScheduleTabs(props: Props) {
  return <ScheduleViewToggle {...props} />;
}
