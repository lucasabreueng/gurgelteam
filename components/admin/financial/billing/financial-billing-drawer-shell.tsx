"use client";

import { useEffect, type ReactNode } from "react";
import { HiXMark } from "react-icons/hi2";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { DRAWER_FOOTER_INNER_CLASS, DRAWER_FOOTER_SHELL_CLASS } from "@/components/ui/drawer-footer";
import { BillingStepIndicator } from "./billing-step-indicator";
import { BILLING_STEP_LABELS } from "./billing-utils";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  currentStep: number;
  stepLabels?: readonly string[];
  hideSteps?: boolean;
  fullWidthSteps?: boolean;
  children: ReactNode;
  summary: ReactNode;
  footer: ReactNode;
};

export function FinancialBillingDrawerShell({
  open,
  onClose,
  title,
  subtitle,
  currentStep,
  stepLabels = BILLING_STEP_LABELS,
  hideSteps = false,
  fullWidthSteps = false,
  children,
  summary,
  footer,
}: Props) {
  useDrawerBodyLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[228] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="app-drawer-panel relative flex h-full w-full max-w-full flex-col bg-[#f3f5f9] shadow-2xl lg:max-w-[min(720px,96vw)]"
      >
        <header className="shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white px-4 py-4 md:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-[#0d1f3c] md:text-2xl">{title}</h1>
              <p className="mt-0.5 max-w-xl text-[13px] leading-snug text-neutral-600 md:text-[14px]">
                {subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"
              aria-label="Fechar"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          {!hideSteps ? (
            <div className="mb-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white px-3 py-3 shadow-sm md:px-4">
              <BillingStepIndicator
                currentStep={currentStep}
                labels={stepLabels}
                fullWidth={fullWidthSteps}
              />
            </div>
          ) : null}
          {children}
        </div>

        <footer className={DRAWER_FOOTER_SHELL_CLASS}>
          <div className="border-b border-[rgba(17,17,17,0.06)] bg-[#fafbfc] px-4 py-3 md:px-6">
            {summary}
          </div>
          <div className={DRAWER_FOOTER_INNER_CLASS}>{footer}</div>
        </footer>
      </aside>
    </div>
  );
}
