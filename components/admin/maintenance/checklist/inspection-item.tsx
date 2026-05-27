"use client";

import type { InspectionItemDef, InspectionItemStatus } from "@/lib/contracts/maintenance";
import { InspectionStatusButton } from "./inspection-status-button";

type Props = {
  item: InspectionItemDef;
  value: InspectionItemStatus;
  onChange: (status: InspectionItemStatus) => void;
  children?: React.ReactNode;
};

export function InspectionItem({ item, value, onChange, children }: Props) {
  const set = (next: "ok" | "warn" | "fail") => {
    onChange(value === next ? null : next);
  };

  return (
    <div className="rounded-xl border border-[rgba(17,17,17,0.06)] bg-white p-3 shadow-sm transition hover:border-accent/15">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-[#0d1f3c]">{item.label}</p>
        <div className="flex gap-2">
          <InspectionStatusButton
            status="ok"
            selected={value === "ok"}
            onSelect={() => set("ok")}
          />
          <InspectionStatusButton
            status="warn"
            selected={value === "warn"}
            onSelect={() => set("warn")}
          />
          <InspectionStatusButton
            status="fail"
            selected={value === "fail"}
            onSelect={() => set("fail")}
          />
        </div>
      </div>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
