"use client";

import { BILLING_STEP_LABELS } from "./billing-utils";

type Props = {
  currentStep: number;
  labels?: readonly string[];
  fullWidth?: boolean;
};

export function BillingStepIndicator({
  currentStep,
  labels = BILLING_STEP_LABELS,
  fullWidth = false,
}: Props) {
  return (
    <ol
      className={`flex gap-1.5 sm:gap-2 ${fullWidth ? "w-full" : "flex-wrap"}`}
      aria-label="Etapas"
    >
      {labels.map((label, index) => {
        const step = index + 1;
        const active = step === currentStep;
        const done = step < currentStep;
        return (
          <li
            key={label}
            className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition sm:px-3 sm:py-2 sm:text-[11px] ${
              fullWidth ? "flex-1" : "min-w-[5.5rem] flex-1 sm:flex-none sm:justify-start"
            } ${
              active
                ? "bg-[#0d1f3c] text-white shadow-sm"
                : done
                  ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                  : "bg-[#fafbfc] text-neutral-500 ring-1 ring-[rgba(17,17,17,0.08)]"
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] sm:h-5 sm:w-5 sm:text-[10px] ${
                active ? "bg-white/20" : done ? "bg-emerald-200 text-emerald-900" : "bg-neutral-100"
              }`}
            >
              {done ? "✓" : step}
            </span>
            <span className="truncate">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
