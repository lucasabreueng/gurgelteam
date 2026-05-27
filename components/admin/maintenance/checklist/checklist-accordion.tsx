"use client";

import type {
  InspectionItemDef,
  InspectionItemStatus,
  InspectionSectionDef,
} from "@/lib/contracts/maintenance";
import { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { InspectionItem } from "./inspection-item";
import { TireWearCard } from "./tire-wear-card";

type Props = {
  section: InspectionSectionDef;
  items: Record<string, InspectionItemStatus>;
  onItemChange: (id: string, status: InspectionItemStatus) => void;
  defaultOpen?: boolean;
};

export function ChecklistAccordion({
  section,
  items,
  onItemChange,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const answered = section.items.filter((i) => items[i.id] != null).length;
  const fails = section.items.filter((i) => items[i.id] === "fail").length;
  const warns = section.items.filter((i) => items[i.id] === "warn").length;

  const badge =
    fails > 0
      ? "bg-red-100 text-red-800"
      : warns > 0
        ? "bg-amber-100 text-amber-900"
        : answered === section.items.length
          ? "bg-emerald-100 text-emerald-800"
          : "bg-neutral-100 text-neutral-600";

  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-[0_2px_12px_rgba(13,31,60,0.04)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-[#fafbfc] md:px-5"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-[#0d1f3c]">
            {section.title}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${badge}`}
          >
            {answered}/{section.items.length}
          </span>
        </div>
        <HiChevronDown
          className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-2 border-t border-[rgba(17,17,17,0.06)] bg-[#fafbfc]/50 px-3 py-3 md:px-4 md:py-4">
            {section.items.map((item) => (
              <SectionItemRow
                key={item.id}
                item={item}
                value={items[item.id] ?? null}
                onChange={(s) => onItemChange(item.id, s)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionItemRow({
  item,
  value,
  onChange,
}: {
  item: InspectionItemDef;
  value: InspectionItemStatus;
  onChange: (s: InspectionItemStatus) => void;
}) {
  return (
    <InspectionItem item={item} value={value} onChange={onChange}>
      {item.tireWearPercent != null ? (
        <TireWearCard percent={item.tireWearPercent} />
      ) : null}
    </InspectionItem>
  );
}
