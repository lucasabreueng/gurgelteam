"use client";

import { useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import { RegisterPilotForm } from "./register-pilot-form";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function RegisterPilotDrawer({ open, onClose, onSuccess }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[228] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Fechar"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-pilot-drawer-title"
        className="relative flex h-full w-full max-w-[min(100vw,520px)] flex-col bg-[#f4f6f8] shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[rgba(17,17,17,0.08)] bg-white px-5 py-4">
          <h2
            id="register-pilot-drawer-title"
            className="text-lg font-bold text-[#0d1f3c]"
          >
            Cadastrar piloto
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.1)] transition hover:bg-[#fafbfc]"
            aria-label="Fechar"
          >
            <HiXMark className="h-5 w-5 text-neutral-600" aria-hidden />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <RegisterPilotForm
            embedded
            onCancel={onClose}
            onSuccess={() => {
              onSuccess?.();
              onClose();
            }}
          />
        </div>
      </aside>
    </div>
  );
}
