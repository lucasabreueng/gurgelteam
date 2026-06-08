"use client";

import type { CashFlowPeriodFilter, CashFlowPeriodKey } from "@/lib/admin-cash-flow-mocks";
import { CASH_FLOW_PERIOD_OPTIONS } from "@/lib/admin-cash-flow-mocks";
import { ScheduleActionModal } from "@/components/admin/schedule/schedule-action-modal";
import { SettingsDatePicker } from "../../settings/settings-date-picker";
import {
  FINANCIAL_PERIOD_FILTER_BAR_CLASS,
  financialPeriodCustomButtonClass,
  financialPeriodPresetButtonClass,
} from "../financial-period-filter-styles";

import { useState } from "react";
import { HiFunnel } from "react-icons/hi2";

type Props = {
  filter: CashFlowPeriodFilter;
  onChange: (filter: CashFlowPeriodFilter) => void;
};

export function CashFlowPeriodFilterBar({ filter, onChange }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(filter.customStart ?? "");
  const [draftEnd, setDraftEnd] = useState(filter.customEnd ?? "");

  const selectPreset = (key: Exclude<CashFlowPeriodKey, "custom">) => {
    onChange({ key, customStart: filter.customStart, customEnd: filter.customEnd });
  };

  const openPeriodModal = () => {
    setDraftStart(filter.customStart ?? "");
    setDraftEnd(filter.customEnd ?? "");
    setModalOpen(true);
  };

  const applyCustomRange = () => {
    if (!draftStart || !draftEnd) return;
    onChange({ key: "custom", customStart: draftStart, customEnd: draftEnd });
    setModalOpen(false);
  };

  return (
    <>
      <div
        className={`${FINANCIAL_PERIOD_FILTER_BAR_CLASS} flex w-full flex-wrap justify-end gap-2 max-md:hidden`}
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
          onClick={openPeriodModal}
          aria-label="Filtrar por período personalizado"
          className={financialPeriodCustomButtonClass(filter.key === "custom")}
        >
          <HiFunnel className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="flex w-full justify-end md:hidden">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={financialPeriodCustomButtonClass(filter.key === "custom")}
          aria-label="Filtrar período do fluxo de caixa"
        >
          <HiFunnel className="h-4 w-4" aria-hidden />
          <span className="ml-2 text-[11px] font-bold uppercase tracking-wider">
            {filter.key === "custom"
              ? "Período customizado"
              : CASH_FLOW_PERIOD_OPTIONS.find((o) => o.key === filter.key)?.label ??
                "Período"}
          </span>
        </button>
      </div>

      <ScheduleActionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Período personalizado"
        titleId="cashflow-period-modal-title"
        description="Selecione a data inicial e final para filtrar o fluxo de caixa."
        maxWidthClass="max-w-md"
        contentOverflow="visible"
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
            <div className="grid grid-cols-2 gap-2 sm:hidden">
              {CASH_FLOW_PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    selectPreset(option.key);
                    setModalOpen(false);
                  }}
                  className={financialPeriodPresetButtonClass(filter.key === option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn-outline-sm"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={applyCustomRange}
                disabled={!draftStart || !draftEnd}
                className="btn-primary-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Aplicar
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]">
              Data inicial
            </span>
            <SettingsDatePicker
              value={draftStart}
              onChange={setDraftStart}
              aria-label="Data inicial"
              placeholder="Selecionar data inicial"
            />
          </label>
          <label className="block space-y-2">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]">
              Data final
            </span>
            <SettingsDatePicker
              value={draftEnd}
              onChange={setDraftEnd}
              aria-label="Data final"
              placeholder="Selecionar data final"
            />
          </label>
        </div>
      </ScheduleActionModal>
    </>
  );
}
