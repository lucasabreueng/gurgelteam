"use client";

import type { CashFlowPeriodFilter, CashFlowPeriodKey } from "@/lib/admin-cash-flow-mocks";
import { CASH_FLOW_PERIOD_OPTIONS } from "@/lib/admin-cash-flow-mocks";
import { settingsInputClass } from "../../settings/settings-section";
import {
  FINANCIAL_PERIOD_FILTER_BAR_CLASS,
  financialPeriodCustomButtonClass,
  financialPeriodPresetButtonClass,
} from "../financial-period-filter-styles";

import { useEffect, useState } from "react";
import { HiFunnel } from "react-icons/hi2";

type Props = {
  filter: CashFlowPeriodFilter;
  onChange: (filter: CashFlowPeriodFilter) => void;
};

export function CashFlowPeriodFilterBar({ filter, onChange }: Props) {
  const [showCustom, setShowCustom] = useState(filter.key === "custom");

  useEffect(() => {
    if (filter.key === "custom") setShowCustom(true);
  }, [filter.key]);

  const selectPreset = (key: Exclude<CashFlowPeriodKey, "custom">) => {
    setShowCustom(false);
    onChange({ key, customStart: filter.customStart, customEnd: filter.customEnd });
  };

  const openCustomFilter = () => {
    setShowCustom(true);
    if (filter.key !== "custom") {
      onChange({
        key: "custom",
        customStart: filter.customStart,
        customEnd: filter.customEnd,
      });
    }
  };

  const applyCustomRange = (start: string, end: string) => {
    if (start && end) {
      onChange({ key: "custom", customStart: start, customEnd: end });
    }
  };

  return (
    <div className="flex w-full flex-col items-stretch gap-3 lg:items-end">
      <div
        className={`${FINANCIAL_PERIOD_FILTER_BAR_CLASS} flex flex-wrap justify-end gap-2`}
      >
        {CASH_FLOW_PERIOD_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => selectPreset(option.key)}
            className={financialPeriodPresetButtonClass(filter.key === option.key)}
          >
            {option.label}
          </button>
        ))}
        <button
          type="button"
          onClick={openCustomFilter}
          aria-expanded={showCustom}
          aria-label="Filtrar por período personalizado"
          className={financialPeriodCustomButtonClass(filter.key === "custom")}
        >
          <HiFunnel className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {showCustom ? (
        <div className="flex flex-wrap items-end justify-end gap-2 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-3">
          <label className="min-w-[140px] space-y-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Data inicial
            </span>
            <input
              type="date"
              className={`${settingsInputClass} py-2 text-[12px]`}
              value={filter.customStart ?? ""}
              onChange={(e) => {
                const start = e.target.value;
                const end = filter.customEnd ?? start;
                applyCustomRange(start, end);
              }}
            />
          </label>
          <label className="min-w-[140px] space-y-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Data final
            </span>
            <input
              type="date"
              className={`${settingsInputClass} py-2 text-[12px]`}
              value={filter.customEnd ?? ""}
              onChange={(e) => {
                const end = e.target.value;
                const start = filter.customStart ?? end;
                applyCustomRange(start, end);
              }}
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
