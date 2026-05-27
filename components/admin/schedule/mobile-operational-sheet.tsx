"use client";

import { HiXMark } from "react-icons/hi2";
import { OperationalSidebar } from "./operational-sidebar";

type Props = {
  open: boolean;
  onClose: () => void;
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export function MobileOperationalSheet({
  open,
  onClose,
  selectedDate,
  onSelectDate,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[220] lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-[#f3f5f9] p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0d1f3c]">Painel operacional</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500"
            aria-label="Fechar"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>
        <OperationalSidebar
          selectedDate={selectedDate}
          onSelectDate={(d) => {
            onSelectDate(d);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
