"use client";

import type { OverallInspectionStatus } from "@/lib/contracts/maintenance";
import { ChecklistSummary } from "./checklist-summary";
import {
  DRAWER_FOOTER_INNER_CLASS,
  DRAWER_FOOTER_SHELL_CLASS,
  DrawerFooterActions,
  DrawerFooterExtra,
} from "@/components/ui/drawer-footer";

type SummaryProps = {
  ok: number;
  warn: number;
  fail: number;
  overall: OverallInspectionStatus;
};

type Props = SummaryProps & {
  onRelease: () => void;
  onSendToMaintenance: () => void;
  onSave: () => void;
  onFinish: () => void;
};

function ActionBtn({
  children,
  onClick,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant: "primary" | "warn" | "outline";
}) {
  const cls =
    variant === "primary"
      ? "bg-emerald-600 text-white"
      : variant === "warn"
        ? "bg-[#0d1f3c] text-white"
        : "border border-[rgba(13,31,60,0.2)] bg-white text-[#0d1f3c]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl px-3 py-3 text-[10px] font-bold uppercase tracking-wider transition hover:brightness-110 ${cls}`}
    >
      {children}
    </button>
  );
}

export function ChecklistDrawerFooter({
  ok,
  warn,
  fail,
  overall,
  onRelease,
  onSendToMaintenance,
  onSave,
  onFinish,
}: Props) {
  return (
    <footer className={`${DRAWER_FOOTER_SHELL_CLASS} shadow-[0_-8px_32px_rgba(13,31,60,0.08)]`}>
      <div className={DRAWER_FOOTER_INNER_CLASS}>
        <DrawerFooterExtra>
          <ChecklistSummary ok={ok} warn={warn} fail={fail} overall={overall} />
        </DrawerFooterExtra>
        <DrawerFooterActions columns={4}>
          <ActionBtn variant="primary" onClick={onRelease}>
            Liberar para pista
          </ActionBtn>
          <ActionBtn variant="warn" onClick={onSendToMaintenance}>
            Enviar para manutenção
          </ActionBtn>
          <ActionBtn variant="outline" onClick={onSave}>
            Salvar checklist
          </ActionBtn>
          <ActionBtn variant="outline" onClick={onFinish}>
            Finalizar inspeção
          </ActionBtn>
        </DrawerFooterActions>
      </div>
    </footer>
  );
}
