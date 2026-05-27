"use client";

import { useEffect } from "react";
import { HiCheckCircle } from "react-icons/hi2";

type Props = {
  open: boolean;
  onContinue: () => void;
};

export function PasswordChangedDialog({ open, onContinue }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onContinue();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onContinue]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/55 p-4"
      onClick={onContinue}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="password-changed-title"
        aria-describedby="password-changed-desc"
        className="w-full max-w-md rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white p-6 text-center shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <HiCheckCircle className="h-8 w-8" aria-hidden />
        </div>
        <h2
          id="password-changed-title"
          className="mt-4 text-xl font-bold text-[#0d1f3c]"
        >
          Senha alterada
        </h2>
        <p
          id="password-changed-desc"
          className="mt-2 text-[14px] leading-relaxed text-neutral-600"
        >
          Sua senha foi redefinida com sucesso. Use a nova senha para entrar na
          área do aluno.
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="mt-6 w-full rounded-xl bg-accent px-4 py-3.5 text-[14px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(13,31,60,0.22)] transition hover:brightness-110"
        >
          Ir para o login
        </button>
      </div>
    </div>
  );
}
