"use client";

import { HiOutlineChevronDown } from "react-icons/hi2";
import { AppDropdown } from "@/components/ui/app-dropdown";
import type { PilotViewOption } from "@/lib/contracts/student/dashboard-view";

type Props = {
  options: PilotViewOption[];
  value: string;
  onChange: (id: string) => void;
};

export function PilotViewSelector({ options, value, onChange }: Props) {
  const dropdownOptions = options.map((o) => ({
    value: o.id,
    label: o.hint === "Eu mesmo" ? `${o.label} (eu mesmo)` : o.label,
  }));

  return (
    <AppDropdown
      id="pilot-view-selector"
      aria-label="Selecionar piloto para visualizar"
      options={dropdownOptions}
      value={value}
      onSelect={onChange}
      placeholder="Selecionar piloto"
      rootClassName="relative block min-w-[min(100%,220px)] w-[220px] rounded-xl border border-[rgba(13,31,60,0.2)] bg-white shadow-sm focus-within:ring-2 focus-within:ring-accent/15"
      triggerClassName="flex h-11 w-full min-w-0 cursor-pointer items-center rounded-xl border-0 bg-transparent px-4 py-0 text-left outline-none transition hover:bg-[#fafbfc]"
      labelClassName="flex w-full items-center justify-between gap-2 text-[13px] font-semibold text-[#0d1f3c]"
      listClassName="z-[200] !border !border-[rgba(17,17,17,0.1)] !bg-white shadow-[0_4px_20px_rgba(13,31,60,0.08)]"
      optionClassName="!font-medium !text-[#111] hover:!bg-[#fafbfc]"
      chevron={
        <HiOutlineChevronDown
          className="h-[18px] w-[18px] shrink-0 text-neutral-500"
          aria-hidden
        />
      }
    />
  );
}
